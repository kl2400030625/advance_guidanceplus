const express = require('express');
const { query } = require('../db');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// All skills
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let sql = 'SELECT * FROM skills WHERE 1=1';
    const params = [];
    let i = 1;
    if (category) { sql += ` AND category = $${i}`; params.push(category); i++; }
    if (difficulty) { sql += ` AND difficulty = $${i}`; params.push(difficulty); i++; }
    if (search) { sql += ` AND (name ILIKE $${i} OR description ILIKE $${i})`; params.push(`%${search}%`); i++; }
    const result = await query(sql, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load skills' });
  }
});

// Recommendations for logged-in user
router.get('/recommend/me', authMiddleware, async (req, res) => {
  try {
    const profileResult = await query('SELECT career_goal, interests, branch, skills FROM profiles WHERE user_id=$1', [req.user.id]);
    const profile = profileResult.rows[0];

    // Find career path skills
    let careerSkills = [];
    if (profile?.career_goal) {
      const careerResult = await query("SELECT required_skills FROM career_paths WHERE slug ILIKE $1 OR title ILIKE $1 LIMIT 1", [`%${profile.career_goal}%`]);
      if (careerResult.rows.length > 0) careerSkills = careerResult.rows[0].required_skills || [];
    }

    const userSkills = profile?.skills || [];
    const skillsToLearn = careerSkills.filter(s => !userSkills.includes(s));

    let result;
    if (skillsToLearn.length > 0) {
      result = await query('SELECT * FROM skills WHERE name = ANY($1) LIMIT 8', [skillsToLearn]);
    }
    if (!result || result.rows.length === 0) {
      result = await query('SELECT * FROM skills ORDER BY importance DESC LIMIT 8');
    }
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Skill categories list
router.get('/categories', async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT category FROM skills ORDER BY category');
    res.json(result.rows.map(r => r.category));
  } catch {
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

module.exports = router;
