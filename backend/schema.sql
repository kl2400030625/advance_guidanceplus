-- Guidance+ PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  reset_token TEXT,
  reset_token_expires TIMESTAMPTZ,
  role VARCHAR(20) DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  college VARCHAR(200),
  degree VARCHAR(100),
  branch VARCHAR(100),
  current_year INTEGER DEFAULT 1,
  cgpa DECIMAL(4,2),
  interests TEXT[],
  career_goal VARCHAR(100),
  skills TEXT[],
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  career_readiness_score INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  importance VARCHAR(20) DEFAULT 'medium',
  difficulty VARCHAR(20) DEFAULT 'intermediate',
  description TEXT,
  learning_time_weeks INTEGER DEFAULT 4,
  resources JSONB,
  tags TEXT[]
);

CREATE TABLE IF NOT EXISTS career_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(30),
  description TEXT,
  avg_salary_lpa DECIMAL(6,2),
  demand_level VARCHAR(20) DEFAULT 'high',
  tags TEXT[],
  required_skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_path_id UUID REFERENCES career_paths(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  stage_order INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  skills TEXT[],
  tools TEXT[],
  projects TEXT[],
  certifications TEXT[],
  estimated_weeks INTEGER DEFAULT 8,
  resources JSONB
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  domain VARCHAR(100),
  difficulty VARCHAR(20) DEFAULT 'intermediate',
  required_skills TEXT[],
  technologies TEXT[],
  estimated_days INTEGER DEFAULT 14,
  github_template TEXT,
  learning_outcomes TEXT[],
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  provider VARCHAR(100),
  domain VARCHAR(100),
  level VARCHAR(30),
  duration_weeks INTEGER DEFAULT 4,
  cost_usd DECIMAL(10,2) DEFAULT 0,
  url TEXT,
  description TEXT,
  tags TEXT[]
);

CREATE TABLE IF NOT EXISTS internships_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  company VARCHAR(150),
  type VARCHAR(30) DEFAULT 'internship',
  location VARCHAR(150),
  is_remote BOOLEAN DEFAULT FALSE,
  salary_lpa DECIMAL(6,2),
  stipend_month INTEGER,
  domain VARCHAR(100),
  required_skills TEXT[],
  description TEXT,
  apply_url TEXT,
  deadline DATE,
  posted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES internships_jobs(id) ON DELETE CASCADE,
  status VARCHAR(30) DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, job_id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  xp_reward INTEGER DEFAULT 50,
  condition_type VARCHAR(50),
  condition_value INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS progress_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL,
  item_id UUID,
  item_title VARCHAR(200),
  status VARCHAR(30) DEFAULT 'in_progress',
  progress_pct INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID DEFAULT uuid_generate_v4(),
  session_title VARCHAR(200),
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  upvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aptitude_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(50),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty VARCHAR(20) DEFAULT 'easy',
  tags TEXT[]
);

CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  domain VARCHAR(100),
  question TEXT NOT NULL,
  sample_answer TEXT,
  difficulty VARCHAR(20) DEFAULT 'medium',
  tags TEXT[]
);

CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  plan JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  type VARCHAR(30) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  xp_earned INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);
