const express = require('express');
const { query } = require('../db');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Get listings with filters
router.get('/', async (req, res) => {
  try {
    const { type, domain, location, is_remote, search } = req.query;
    let sql = 'SELECT * FROM internships_jobs WHERE 1=1';
    const params = [];
    let i = 1;
    if (type) { sql += ` AND type = $${i}`; params.push(type); i++; }
    if (domain) { sql += ` AND domain ILIKE $${i}`; params.push(`%${domain}%`); i++; }
    if (location) { sql += ` AND location ILIKE $${i}`; params.push(`%${location}%`); i++; }
    if (is_remote === 'true') { sql += ` AND is_remote = TRUE`; }
    if (search) { sql += ` AND (title ILIKE $${i} OR company ILIKE $${i})`; params.push(`%${search}%`); i++; }
    sql += ' ORDER BY posted_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load listings' });
  }
});

// Get user applications (kanban)
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, j.title as job_title, j.company, j.type, j.domain, j.location, j.stipend_month, j.salary_lpa
       FROM applications a JOIN internships_jobs j ON a.job_id = j.id
       WHERE a.user_id = $1 ORDER BY a.applied_at DESC`, [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// Apply to job
router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;
    await query(
      'INSERT INTO applications (user_id, job_id, notes) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [req.user.id, req.params.id, notes || null]
    );
    // Award job hunter achievement check
    const countResult = await query('SELECT COUNT(*) FROM applications WHERE user_id=$1', [req.user.id]);
    if (parseInt(countResult.rows[0].count) >= 5) {
      const ach = await query("SELECT id FROM achievements WHERE condition_type='applications_count' LIMIT 1");
      if (ach.rows.length > 0) {
        await query('INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.user.id, ach.rows[0].id]);
      }
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to apply' });
  }
});

// Update application status
router.patch('/applications/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await query('UPDATE applications SET status=$1 WHERE id=$2 AND user_id=$3', [status, req.params.id, req.user.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
