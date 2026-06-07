const express = require('express');
const { query } = require('../db');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Get aptitude questions
router.get('/aptitude', async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    let sql = 'SELECT * FROM aptitude_questions WHERE 1=1';
    const params = [];
    let i = 1;
    if (category) { sql += ` AND category ILIKE $${i}`; params.push(category); i++; }
    if (difficulty) { sql += ` AND difficulty = $${i}`; params.push(difficulty); i++; }
    sql += ` ORDER BY RANDOM() LIMIT $${i}`;
    params.push(parseInt(limit));
    const result = await query(sql, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

// Get interview questions
router.get('/interview', async (req, res) => {
  try {
    const { type, domain, difficulty, limit = 10 } = req.query;
    let sql = 'SELECT * FROM interview_questions WHERE 1=1';
    const params = [];
    let i = 1;
    if (type) { sql += ` AND type ILIKE $${i}`; params.push(type); i++; }
    if (domain) { sql += ` AND domain ILIKE $${i}`; params.push(domain); i++; }
    if (difficulty) { sql += ` AND difficulty = $${i}`; params.push(difficulty); i++; }
    sql += ` ORDER BY RANDOM() LIMIT $${i}`;
    params.push(parseInt(limit));
    const result = await query(sql, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load interview questions' });
  }
});

// AI Mock Interview - generate questions based on domain
router.post('/mock-interview', authMiddleware, async (req, res) => {
  try {
    const { role, experience_level } = req.body;
    const technical = await query(
      "SELECT * FROM interview_questions WHERE type='Technical' AND (domain ILIKE $1 OR domain IS NULL) ORDER BY RANDOM() LIMIT 4",
      [`%${role}%`]
    );
    const hr = await query("SELECT * FROM interview_questions WHERE type='HR' ORDER BY RANDOM() LIMIT 3");
    const system = await query("SELECT * FROM interview_questions WHERE type='System Design' ORDER BY RANDOM() LIMIT 2");

    // Generate AI intro
    const intro = `Welcome to your mock interview for the role of ${role}! I'm your AI interviewer. We'll have a ${experience_level || 'entry-level'} level session covering technical, HR, and problem-solving rounds. Take your time and answer confidently. Let's begin!`;

    res.json({
      intro,
      questions: [
        ...hr.rows.map(q => ({ ...q, round: 'HR Round' })),
        ...technical.rows.map(q => ({ ...q, round: 'Technical Round' })),
        ...system.rows.map(q => ({ ...q, round: 'System Design Round' }))
      ]
    });
  } catch {
    res.status(500).json({ error: 'Failed to generate mock interview' });
  }
});

// Submit aptitude answer + track
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { question_id, selected_answer, is_correct } = req.body;
    if (is_correct) {
      await query('UPDATE profiles SET total_xp = total_xp + 5 WHERE user_id=$1', [req.user.id]);
    }
    // Check achievement
    const countResult = await query(
      "SELECT COUNT(*) FROM progress_tracking WHERE user_id=$1 AND item_type='aptitude'", [req.user.id]
    );
    const count = parseInt(countResult.rows[0].count) + 1;
    if (count >= 50) {
      const ach = await query("SELECT id FROM achievements WHERE condition_type='questions_answered' LIMIT 1");
      if (ach.rows.length > 0) {
        await query('INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.user.id, ach.rows[0].id]);
      }
    }
    res.json({ success: true, xp_awarded: is_correct ? 5 : 0 });
  } catch {
    res.status(500).json({ error: 'Submit failed' });
  }
});

module.exports = router;
