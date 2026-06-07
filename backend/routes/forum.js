const express = require('express');
const { query } = require('../db');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Get posts
router.get('/', async (req, res) => {
  try {
    const { tag, search } = req.query;
    let sql = `SELECT fp.*, u.name as author_name, u.avatar_url,
      (SELECT COUNT(*) FROM forum_comments WHERE post_id = fp.id) as comment_count
      FROM forum_posts fp JOIN users u ON fp.user_id = u.id WHERE 1=1`;
    const params = [];
    let i = 1;
    if (tag) { sql += ` AND $${i} = ANY(fp.tags)`; params.push(tag); i++; }
    if (search) { sql += ` AND (fp.title ILIKE $${i} OR fp.content ILIKE $${i})`; params.push(`%${search}%`); i++; }
    sql += ' ORDER BY fp.is_pinned DESC, fp.created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

// Create post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const result = await query(
      'INSERT INTO forum_posts (user_id, title, content, tags) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.id, title, content, tags || []]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get post with comments
router.get('/:id', async (req, res) => {
  try {
    const postResult = await query(`SELECT fp.*, u.name as author_name FROM forum_posts fp JOIN users u ON fp.user_id = u.id WHERE fp.id=$1`, [req.params.id]);
    if (postResult.rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    await query('UPDATE forum_posts SET views = views + 1 WHERE id=$1', [req.params.id]);
    const comments = await query(`SELECT fc.*, u.name as author_name FROM forum_comments fc JOIN users u ON fc.user_id = u.id WHERE fc.post_id=$1 ORDER BY fc.created_at ASC`, [req.params.id]);
    res.json({ post: postResult.rows[0], comments: comments.rows });
  } catch {
    res.status(500).json({ error: 'Failed to load post' });
  }
});

// Add comment
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const result = await query('INSERT INTO forum_comments (post_id, user_id, content) VALUES ($1,$2,$3) RETURNING *', [req.params.id, req.user.id, content]);
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Upvote post
router.post('/:id/upvote', authMiddleware, async (req, res) => {
  try {
    await query('UPDATE forum_posts SET upvotes = upvotes + 1 WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to upvote' });
  }
});

module.exports = router;
