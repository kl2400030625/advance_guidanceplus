const express = require('express');
const { query } = require('../db');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Get projects with filters
router.get('/', async (req, res) => {
  try {
    const { domain, difficulty, skill, search } = req.query;
    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params = [];
    let i = 1;
    if (domain) { sql += ` AND domain = $${i}`; params.push(domain); i++; }
    if (difficulty) { sql += ` AND difficulty = $${i}`; params.push(difficulty); i++; }
    if (skill) { sql += ` AND $${i} = ANY(required_skills)`; params.push(skill); i++; }
    if (search) { sql += ` AND (title ILIKE $${i} OR description ILIKE $${i})`; params.push(`%${search}%`); i++; }
    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM projects WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to load project' });
  }
});

// Get recommendations for logged-in user
router.get('/recommend/me', authMiddleware, async (req, res) => {
  try {
    const profileResult = await query('SELECT career_goal, interests, branch FROM profiles WHERE user_id=$1', [req.user.id]);
    const profile = profileResult.rows[0];
    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params = [];
    if (profile?.career_goal) {
      sql += ` AND (domain ILIKE $1 OR $1 = ANY(tags))`;
      params.push(`%${profile.career_goal}%`);
    }
    sql += ' LIMIT 6';
    const result = await query(sql, params);
    if (result.rows.length === 0) {
      const fallback = await query('SELECT * FROM projects ORDER BY RANDOM() LIMIT 6');
      return res.json(fallback.rows);
    }
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load recommendations' });
  }
});

module.exports = router;
