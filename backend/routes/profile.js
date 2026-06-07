const express = require('express');
const { query } = require('../db');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

router.use(authMiddleware);

// Get full profile with stats
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const profileResult = await query(
      `SELECT p.*, u.name, u.email, u.avatar_url, u.created_at
       FROM profiles p JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1`, [userId]
    );
    if (profileResult.rows.length === 0) return res.status(404).json({ error: 'Profile not found' });
    const profile = profileResult.rows[0];

    const skillsDone = await query("SELECT COUNT(*) FROM progress_tracking WHERE user_id=$1 AND item_type='skill' AND status='completed'", [userId]);
    const projectsDone = await query("SELECT COUNT(*) FROM progress_tracking WHERE user_id=$1 AND item_type='project' AND status='completed'", [userId]);
    const certsDone = await query("SELECT COUNT(*) FROM progress_tracking WHERE user_id=$1 AND item_type='certification' AND status='completed'", [userId]);
    const badgesResult = await query(
      `SELECT a.title, a.icon, a.xp_reward, ua.earned_at FROM user_achievements ua
       JOIN achievements a ON ua.achievement_id = a.id WHERE ua.user_id = $1`, [userId]
    );
    const notifResult = await query("SELECT * FROM notifications WHERE user_id=$1 AND is_read=FALSE ORDER BY created_at DESC LIMIT 10", [userId]);

    const skills_completed = parseInt(skillsDone.rows[0].count);
    const projects_completed = parseInt(projectsDone.rows[0].count);
    const certs_completed = parseInt(certsDone.rows[0].count);
    const readiness = Math.min(100, Math.round((skills_completed * 10 + projects_completed * 20 + certs_completed * 15 + (profile.streak_days || 0) * 2)));

    res.json({
      ...profile,
      skills_completed, projects_completed, certs_completed,
      career_readiness_score: readiness,
      badges: badgesResult.rows,
      notifications: notifResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// Update profile
router.put('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { college, degree, branch, current_year, cgpa, interests, career_goal, skills, bio, github_url, linkedin_url, portfolio_url } = req.body;
    const fields = { college, degree, branch, current_year, cgpa, interests, career_goal, skills, bio, github_url, linkedin_url, portfolio_url };
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) {
        setClauses.push(`${key} = $${i}`);
        values.push(val);
        i++;
      }
    }
    if (setClauses.length === 0) return res.status(400).json({ error: 'No fields to update' });
    
    // Calculate completion percentage
    const filled = Object.values(fields).filter(v => v !== undefined && v !== null && v !== '').length;
    const total = Object.keys(fields).length;
    const completion = Math.round((filled / total) * 100);
    setClauses.push(`completion_percentage = $${i}`, `updated_at = NOW()`);
    values.push(completion);

    values.push(userId);
    await query(`UPDATE profiles SET ${setClauses.join(', ')} WHERE user_id = $${values.length}`, values);

    // Check profile complete achievement
    if (completion === 100) {
      const ach = await query("SELECT id FROM achievements WHERE condition_type = 'profile_completion' LIMIT 1");
      if (ach.rows.length > 0) {
        await query('INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, ach.rows[0].id]);
        await query('UPDATE profiles SET total_xp = total_xp + 50 WHERE user_id = $1', [userId]);
      }
    }

    const updated = await query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Update progress
router.post('/progress', async (req, res) => {
  try {
    const { item_type, item_id, item_title, status, progress_pct } = req.body;
    const userId = req.user.id;
    const completed_at = status === 'completed' ? new Date() : null;
    await query(
      `INSERT INTO progress_tracking (user_id, item_type, item_id, item_title, status, progress_pct, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, item_type, item_id)
       DO UPDATE SET status=$5, progress_pct=$6, completed_at=$7`,
      [userId, item_type, item_id, item_title, status, progress_pct || 0, completed_at]
    );
    if (status === 'completed') {
      await query(`INSERT INTO daily_activity (user_id, date, xp_earned, tasks_completed)
        VALUES ($1, CURRENT_DATE, 20, 1)
        ON CONFLICT (user_id, date)
        DO UPDATE SET xp_earned = daily_activity.xp_earned + 20, tasks_completed = daily_activity.tasks_completed + 1`, [userId]);
      await query('UPDATE profiles SET total_xp = total_xp + 20 WHERE user_id = $1', [userId]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Progress update failed' });
  }
});

// Get all progress
router.get('/progress', async (req, res) => {
  try {
    const result = await query('SELECT * FROM progress_tracking WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

// Mark notification read
router.patch('/notifications/:id/read', async (req, res) => {
  await query('UPDATE notifications SET is_read=TRUE WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// Weekly activity
router.get('/activity', async (req, res) => {
  try {
    const result = await query(
      `SELECT date, xp_earned, tasks_completed FROM daily_activity
       WHERE user_id=$1 AND date >= CURRENT_DATE - INTERVAL '30 days'
       ORDER BY date ASC`, [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load activity' });
  }
});

module.exports = router;
