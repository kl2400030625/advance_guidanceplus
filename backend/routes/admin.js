const express = require('express');
const { query } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const router = express.Router();

router.use(authMiddleware, adminMiddleware);

// Dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await query('SELECT COUNT(*) FROM users');
    const activeUsers = await query("SELECT COUNT(*) FROM users WHERE last_active > NOW() - INTERVAL '7 days'");
    const totalProjects = await query('SELECT COUNT(*) FROM projects');
    const totalRoadmaps = await query('SELECT COUNT(*) FROM roadmaps');
    const popularCareers = await query('SELECT career_goal, COUNT(*) as count FROM profiles WHERE career_goal IS NOT NULL GROUP BY career_goal ORDER BY count DESC LIMIT 5');
    const recentUsers = await query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 10');
    const dailySignups = await query("SELECT DATE(created_at) as date, COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY DATE(created_at) ORDER BY date ASC");
    res.json({
      total_users: parseInt(totalUsers.rows[0].count),
      active_users: parseInt(activeUsers.rows[0].count),
      total_projects: parseInt(totalProjects.rows[0].count),
      total_roadmaps: parseInt(totalRoadmaps.rows[0].count),
      popular_careers: popularCareers.rows,
      recent_users: recentUsers.rows,
      daily_signups: dailySignups.rows
    });
  } catch {
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await query(`SELECT u.id, u.name, u.email, u.role, u.created_at, u.last_active, p.career_goal, p.completion_percentage, p.streak_days FROM users u LEFT JOIN profiles p ON u.id = p.user_id ORDER BY u.created_at DESC`);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load users' });
  }
});

// Send notification to all users
router.post('/notify', async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const users = await query('SELECT id FROM users');
    for (const user of users.rows) {
      await query('INSERT INTO notifications (user_id, title, message, type) VALUES ($1,$2,$3,$4)', [user.id, title, message, type || 'info']);
    }
    res.json({ success: true, sent_to: users.rows.length });
  } catch {
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

module.exports = router;
