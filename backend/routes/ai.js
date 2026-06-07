const express = require('express');
const { query } = require('../db');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

router.use(authMiddleware);

// Simulated AI mentor response engine
function generateMentorResponse(userMessage, profile) {
  const msg = userMessage.toLowerCase();
  const career = profile?.career_goal || 'Software Development';
  const name = profile?.name || 'there';

  if (msg.includes('roadmap') || msg.includes('path')) {
    return `Great question, ${name}! For your goal of becoming a ${career}, I recommend this roadmap:\n\n**Phase 1 (Months 1-3):** Master the fundamentals - Python/JavaScript, Data Structures, Git.\n**Phase 2 (Months 4-6):** Build core domain skills - frameworks, databases, APIs.\n**Phase 3 (Months 7-9):** Work on real projects, contribute to open source.\n**Phase 4 (Months 10-12):** DSA practice, system design, internship/job applications.\n\nWould you like me to go deeper on any specific phase?`;
  }
  if (msg.includes('resume') || msg.includes('cv')) {
    return `Here are my top resume tips for a ${career} role:\n\n✅ **Lead with impact** - Use numbers: "Built API serving 10K requests/day"\n✅ **Tailor for ATS** - Include keywords from job descriptions\n✅ **Projects section** - 3-4 strong projects with GitHub links\n✅ **Keep it 1 page** - Concise and focused for freshers\n✅ **Skills section** - List tools, languages, and frameworks\n\nWould you like me to review a specific section?`;
  }
  if (msg.includes('interview') || msg.includes('crack')) {
    return `To crack ${career} interviews, focus on these areas:\n\n🎯 **DSA:** Practice 100+ LeetCode problems (Easy→Medium→Hard)\n🎯 **Technical:** Deep knowledge of your tech stack\n🎯 **Projects:** Be able to explain every line of your projects\n🎯 **System Design:** Learn to design scalable systems (for SDE-2+)\n🎯 **Behavioral:** Use STAR method for HR rounds\n\nWhich area would you like to focus on first?`;
  }
  if (msg.includes('skill') || msg.includes('learn')) {
    return `Based on your profile targeting ${career}, the most in-demand skills to learn are:\n\n1. **Python/JavaScript** - Foundation for everything\n2. **Data Structures & Algorithms** - Essential for interviews\n3. **Domain-specific frameworks** - React, TensorFlow, etc.\n4. **Cloud basics** - AWS/GCP/Azure familiarity\n5. **Git & DevOps** - Collaboration and deployment\n\nStart with fundamentals and build progressively. Consistency beats intensity!`;
  }
  if (msg.includes('project') || msg.includes('portfolio')) {
    return `For a strong ${career} portfolio, build these types of projects:\n\n🚀 **1 Ambitious Project** - Something that solves a real problem\n📊 **2-3 Domain Projects** - Show technical depth\n🤝 **1 Open Source Contribution** - Shows collaboration skills\n\nEach project should have:\n- Clean README with setup instructions\n- Live demo or screenshots\n- Well-commented code\n- Problem statement and solution approach\n\nNeed help choosing a specific project idea?`;
  }
  if (msg.includes('internship') || msg.includes('job')) {
    return `To land your first internship/job as a ${career}:\n\n📋 **Timeline:** Start applying 3-4 months before desired start date\n🎯 **Platforms:** LinkedIn, Internshala, Unstop, company career pages\n📝 **Application:** Customize your resume for each role\n🔗 **Network:** Connect with professionals on LinkedIn\n💡 **Cold email:** Reach out to alumni at target companies\n\nFor Indian companies: TCS, Infosys, Wipro hire in bulk. For product companies: prepare DSA thoroughly.\n\nWant tips on a specific company or role?`;
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `Hello ${name}! 👋 I'm your AI Mentor at Guidance+.\n\nI'm here to help you with:\n- 🗺️ Career roadmap planning\n- 📝 Resume advice and review\n- 💼 Interview preparation strategies\n- 🛠️ Skill recommendations\n- 🚀 Project ideas and portfolio building\n- 🎯 Internship and job hunting tips\n\nWhat would you like to work on today?`;
  }
  return `That's a great question! Based on your interest in ${career}, here's my guidance:\n\nThe key to success in tech is consistent practice and building real projects. Focus on:\n1. **Learn by doing** - Build projects as you learn\n2. **Community engagement** - Join Discord servers, local meetups\n3. **Document your journey** - Blog or LinkedIn posts help you get noticed\n4. **Seek mentors** - Don't hesitate to reach out to seniors\n\nIs there a specific challenge you're facing that I can help you with?`;
}

// ATS Score analyzer
function analyzeATS(resume) {
  const keywords = ['python', 'javascript', 'react', 'node', 'sql', 'api', 'git', 'docker', 'aws', 'machine learning', 'data structures', 'algorithms', 'agile', 'rest', 'database'];
  const resumeText = JSON.stringify(resume).toLowerCase();
  const found = keywords.filter(k => resumeText.includes(k));
  const score = Math.min(100, Math.round((found.length / keywords.length) * 100) + Math.random() * 10);
  const missing = keywords.filter(k => !resumeText.includes(k)).slice(0, 5);
  return {
    score: Math.round(score),
    found_keywords: found,
    missing_keywords: missing,
    suggestions: [
      missing.length > 0 ? `Add keywords: ${missing.join(', ')}` : 'Great keyword coverage!',
      'Use action verbs: Built, Developed, Implemented, Optimized',
      'Quantify achievements with numbers (10K users, 40% faster)',
      'Match job description language exactly',
      'Ensure contact info is ATS-parseable (no tables/graphics)'
    ]
  };
}

// Generate weekly study plan
function generateStudyPlan(profile) {
  const career = profile?.career_goal || 'Software Development';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const plan = {};
  const templates = {
    morning: ['Solve 2 LeetCode problems', 'Watch 1 tutorial video (45 min)', 'Read documentation'],
    afternoon: ['Build a mini feature for your project', 'Practice coding exercises', 'Study system design concepts'],
    evening: ['Review what you learned today', 'Contribute to open source', 'Write a blog post about your learning']
  };
  days.forEach((day, i) => {
    if (day === 'Sunday') {
      plan[day] = { focus: 'Review & Rest', tasks: ['Weekly review of all learnings', 'Plan next week goals', 'Watch inspiring tech talks'] };
    } else {
      plan[day] = {
        focus: `${career} - Day ${i + 1}`,
        tasks: [
          templates.morning[i % 3],
          templates.afternoon[i % 3],
          templates.evening[i % 3]
        ]
      };
    }
  });
  return plan;
}

// Chat with AI mentor
router.post('/chat', async (req, res) => {
  try {
    const { message, session_id } = req.body;
    const profileResult = await query(
      `SELECT p.career_goal, p.interests, p.branch, u.name FROM profiles p JOIN users u ON p.user_id = u.id WHERE p.user_id = $1`,
      [req.user.id]
    );
    const profile = profileResult.rows[0];

    let aiResponse;
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: `You are an expert AI mentor at Guidance+, a student career platform. The user is ${profile?.name || 'a student'} targeting a career in ${profile?.career_goal || 'technology'}. Their branch: ${profile?.branch || 'Engineering'}. Give personalized, practical advice. Use emojis and markdown formatting.` },
            { role: 'user', content: message }
          ],
          max_tokens: 500
        });
        aiResponse = completion.choices[0].message.content;
      } catch (openAIErr) {
        aiResponse = generateMentorResponse(message, profile);
      }
    } else {
      aiResponse = generateMentorResponse(message, profile);
    }

    // Save to chat history
    if (session_id) {
      const existing = await query('SELECT id, messages FROM chat_history WHERE session_id=$1 AND user_id=$2', [session_id, req.user.id]);
      const userMsg = { role: 'user', content: message, timestamp: new Date() };
      const aiMsg = { role: 'assistant', content: aiResponse, timestamp: new Date() };
      if (existing.rows.length > 0) {
        const msgs = [...(existing.rows[0].messages || []), userMsg, aiMsg];
        await query('UPDATE chat_history SET messages=$1, updated_at=NOW() WHERE session_id=$2', [JSON.stringify(msgs), session_id]);
      } else {
        const sessionTitle = message.slice(0, 50);
        await query('INSERT INTO chat_history (user_id, session_id, session_title, messages) VALUES ($1,$2,$3,$4)', [req.user.id, session_id, sessionTitle, JSON.stringify([userMsg, aiMsg])]);
      }
    }
    res.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chat failed' });
  }
});

// Get chat sessions
router.get('/sessions', async (req, res) => {
  try {
    const result = await query('SELECT id, session_id, session_title, created_at, updated_at FROM chat_history WHERE user_id=$1 ORDER BY updated_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load sessions' });
  }
});

// Get chat session messages
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM chat_history WHERE session_id=$1 AND user_id=$2', [req.params.sessionId, req.user.id]);
    if (result.rows.length === 0) return res.json({ messages: [] });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to load session' });
  }
});

// ATS Analysis
router.post('/ats', async (req, res) => {
  try {
    const { resume } = req.body;
    const analysis = analyzeATS(resume);
    res.json(analysis);
  } catch {
    res.status(500).json({ error: 'ATS analysis failed' });
  }
});

// Weekly study plan
router.get('/study-plan', async (req, res) => {
  try {
    const profileResult = await query('SELECT career_goal, interests FROM profiles WHERE user_id=$1', [req.user.id]);
    const profile = profileResult.rows[0];
    const plan = generateStudyPlan(profile);
    res.json({ plan, generated_at: new Date() });
  } catch {
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

module.exports = router;
