const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDB } = require('./db');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const roadmapRoutes = require('./routes/roadmaps');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const prepRoutes = require('./routes/prep');
const jobRoutes = require('./routes/jobs');
const aiRoutes = require('./routes/ai');
const forumRoutes = require('./routes/forum');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/prep', prepRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Guidance+ API running on port ${PORT}`));
});
