const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query } = require('../db');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, degree, branch, current_year, cgpa, interests, career_goal } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, 12);
    const verification_token = crypto.randomBytes(32).toString('hex');
    const userResult = await query(
      `INSERT INTO users (name, email, password_hash, verification_token, is_verified)
       VALUES ($1, $2, $3, $4, TRUE) RETURNING id, name, email, role`,
      [name, email, password_hash, verification_token]
    );
    const user = userResult.rows[0];
    await query(
      `INSERT INTO profiles (user_id, college, degree, branch, current_year, cgpa, interests, career_goal)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user.id, college || null, degree || null, branch || null, current_year || 1, cgpa || null, interests || [], career_goal || null]
    );
    // Award first login achievement
    const achievement = await query("SELECT id FROM achievements WHERE condition_type = 'login_count' LIMIT 1");
    if (achievement.rows.length > 0) {
      await query('INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [user.id, achievement.rows[0].id]);
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    await query('UPDATE users SET last_active = NOW() WHERE id = $1', [user.id]);
    // Update streak
    const profileResult = await query('SELECT last_activity_date, streak_days FROM profiles WHERE user_id = $1', [user.id]);
    if (profileResult.rows.length > 0) {
      const { last_activity_date, streak_days } = profileResult.rows[0];
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let newStreak = streak_days;
      if (!last_activity_date) {
        newStreak = 1;
      } else if (last_activity_date.toISOString().split('T')[0] === yesterday) {
        newStreak = streak_days + 1;
      } else if (last_activity_date.toISOString().split('T')[0] !== today) {
        newStreak = 1;
      }
      await query('UPDATE profiles SET streak_days = $1, last_activity_date = $2 WHERE user_id = $3', [newStreak, today, user.id]);
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await query('SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.json({ message: 'If that email exists, a reset link was sent.' });
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);
    await query('UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3', [token, expires, email]);
    res.json({ message: 'Password reset email sent. Token: ' + token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await query('SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()', [token]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid or expired token' });
    const hash = await bcrypt.hash(password, 12);
    await query('UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2', [hash, result.rows[0].id]);
    res.json({ message: 'Password reset successfully' });
  } catch {
    res.status(500).json({ error: 'Reset failed' });
  }
});

module.exports = router;
