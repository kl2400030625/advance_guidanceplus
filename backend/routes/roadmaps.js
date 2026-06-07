const express = require('express');
const { query } = require('../db');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Get all career paths (public)
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM career_paths ORDER BY demand_level DESC, avg_salary_lpa DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load career paths' });
  }
});

// Get career path details + roadmap stages
router.get('/:slug', async (req, res) => {
  try {
    const careerResult = await query('SELECT * FROM career_paths WHERE slug=$1', [req.params.slug]);
    if (careerResult.rows.length === 0) return res.status(404).json({ error: 'Career path not found' });
    const career = careerResult.rows[0];
    const stagesResult = await query('SELECT * FROM roadmaps WHERE career_path_id=$1 ORDER BY stage_order ASC', [career.id]);
    res.json({ career, stages: stagesResult.rows });
  } catch {
    res.status(500).json({ error: 'Failed to load roadmap' });
  }
});

// Get user progress for a roadmap (protected)
router.get('/:slug/progress', authMiddleware, async (req, res) => {
  try {
    const careerResult = await query('SELECT id FROM career_paths WHERE slug=$1', [req.params.slug]);
    if (careerResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const careerId = careerResult.rows[0].id;
    const stages = await query('SELECT id FROM roadmaps WHERE career_path_id=$1', [careerId]);
    const stageIds = stages.rows.map(s => s.id);
    const progress = await query(
      `SELECT * FROM progress_tracking WHERE user_id=$1 AND item_type='roadmap_stage' AND item_id = ANY($2)`,
      [req.user.id, stageIds]
    );
    res.json(progress.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

module.exports = router;
