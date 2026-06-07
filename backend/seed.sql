-- Guidance+ Seed Data

-- Career Paths
INSERT INTO career_paths (title, slug, icon, color, description, avg_salary_lpa, demand_level, tags, required_skills) VALUES
('Software Developer', 'software-developer', 'Code', '#6366f1', 'Build scalable applications across web, mobile, and desktop platforms.', 12.5, 'very_high', ARRAY['programming','web','backend','frontend'], ARRAY['JavaScript','Python','Data Structures','Algorithms','Git']),
('AI Engineer', 'ai-engineer', 'Brain', '#8b5cf6', 'Design and deploy machine learning and deep learning systems.', 18.0, 'very_high', ARRAY['ai','ml','deep-learning','python'], ARRAY['Python','Machine Learning','Deep Learning','TensorFlow','Mathematics']),
('Data Scientist', 'data-scientist', 'BarChart2', '#0ea5e9', 'Analyze complex data to derive business insights.', 15.0, 'high', ARRAY['data','analytics','statistics','python'], ARRAY['Python','Statistics','SQL','Machine Learning','Data Visualization']),
('Data Engineer', 'data-engineer', 'Database', '#f59e0b', 'Build data pipelines and infrastructure for analytics.', 14.0, 'high', ARRAY['data','pipelines','sql','cloud'], ARRAY['SQL','Python','Apache Spark','Kafka','Cloud Platforms']),
('Cybersecurity Engineer', 'cybersecurity-engineer', 'Shield', '#ef4444', 'Protect systems and networks from digital attacks.', 13.0, 'high', ARRAY['security','networking','ethical-hacking'], ARRAY['Networking','Linux','Python','Security Tools','Cryptography']),
('Cloud Engineer', 'cloud-engineer', 'Cloud', '#06b6d4', 'Design and manage cloud infrastructure and services.', 14.5, 'very_high', ARRAY['cloud','aws','devops','infrastructure'], ARRAY['AWS','Azure','GCP','Terraform','Linux','Networking']),
('DevOps Engineer', 'devops-engineer', 'Settings', '#10b981', 'Bridge development and operations through automation.', 13.5, 'high', ARRAY['devops','ci-cd','docker','kubernetes'], ARRAY['Docker','Kubernetes','CI/CD','Linux','Scripting','Cloud']),
('Product Manager', 'product-manager', 'Layers', '#f97316', 'Lead product strategy and cross-functional teams.', 16.0, 'high', ARRAY['product','strategy','management','ux'], ARRAY['Product Strategy','Agile','User Research','Analytics','Communication']),
('UI/UX Designer', 'uiux-designer', 'Palette', '#ec4899', 'Create intuitive and beautiful user experiences.', 10.0, 'high', ARRAY['design','ux','figma','prototyping'], ARRAY['Figma','User Research','Prototyping','Design Systems','CSS'])
ON CONFLICT (slug) DO NOTHING;

-- Roadmap stages for AI Engineer
INSERT INTO roadmaps (career_path_id, stage, stage_order, title, description, skills, tools, projects, certifications, estimated_weeks, resources)
SELECT id, 'Beginner', 1, 'Foundations of AI', 'Learn Python, mathematics, and introductory ML concepts.',
  ARRAY['Python','Linear Algebra','Statistics','Probability','NumPy','Pandas'],
  ARRAY['Jupyter Notebook','Google Colab','VS Code'],
  ARRAY['Data Analysis on Iris Dataset','Linear Regression from Scratch','Spam Email Classifier'],
  ARRAY['Google – Crash Course on ML','Coursera – Python for Everybody'],
  10,
  '{"videos":["3Blue1Brown - Neural Networks","Corey Schafer - Python"],"books":["Python Machine Learning by Sebastian Raschka"]}'::JSONB
FROM career_paths WHERE slug = 'ai-engineer'
ON CONFLICT DO NOTHING;

INSERT INTO roadmaps (career_path_id, stage, stage_order, title, description, skills, tools, projects, certifications, estimated_weeks, resources)
SELECT id, 'Intermediate', 2, 'Machine Learning & Deep Learning', 'Master ML algorithms and deep learning architectures.',
  ARRAY['Scikit-learn','TensorFlow','PyTorch','CNNs','RNNs','Feature Engineering'],
  ARRAY['TensorFlow','PyTorch','Weights & Biases','Google Colab Pro'],
  ARRAY['Image Classifier with CNN','Sentiment Analysis LSTM','House Price Prediction'],
  ARRAY['DeepLearning.AI - Deep Learning Specialization','fast.ai Practical Deep Learning'],
  16,
  '{"videos":["Andrej Karpathy - Neural Networks: Zero to Hero"],"books":["Deep Learning by Goodfellow"]}'::JSONB
FROM career_paths WHERE slug = 'ai-engineer'
ON CONFLICT DO NOTHING;

INSERT INTO roadmaps (career_path_id, stage, stage_order, title, description, skills, tools, projects, certifications, estimated_weeks, resources)
SELECT id, 'Advanced', 3, 'Specialization & MLOps', 'NLP, Computer Vision, Reinforcement Learning, and deploying models.',
  ARRAY['Transformers','BERT','GPT','MLOps','FastAPI','Docker','LangChain'],
  ARRAY['HuggingFace','MLflow','Docker','FastAPI','Kubernetes'],
  ARRAY['ChatBot with LangChain','Real-time Object Detection','Model Deployment Pipeline'],
  ARRAY['AWS Certified Machine Learning','Google Professional ML Engineer'],
  20,
  '{"videos":["HuggingFace Course","MLOps Course - Full Stack Deep Learning"]}'::JSONB
FROM career_paths WHERE slug = 'ai-engineer'
ON CONFLICT DO NOTHING;

INSERT INTO roadmaps (career_path_id, stage, stage_order, title, description, skills, tools, projects, certifications, estimated_weeks, resources)
SELECT id, 'Industry Ready', 4, 'Production AI Systems', 'Build end-to-end AI products, contribute to open source, build portfolio.',
  ARRAY['System Design for ML','A/B Testing','Data Drift Detection','AI Ethics','Leadership'],
  ARRAY['Kubeflow','SageMaker','Vertex AI','Prometheus'],
  ARRAY['End-to-end ML Platform','AI SaaS Product','Research Paper Implementation'],
  ARRAY['Google Cloud Professional Data Engineer','Certified AI Practitioner'],
  12,
  '{"tips":["Contribute to HuggingFace","Publish on Medium/ArXiv","Kaggle Competitions"]}'::JSONB
FROM career_paths WHERE slug = 'ai-engineer'
ON CONFLICT DO NOTHING;

-- Roadmap stages for Software Developer
INSERT INTO roadmaps (career_path_id, stage, stage_order, title, description, skills, tools, projects, certifications, estimated_weeks, resources)
SELECT id, 'Beginner', 1, 'Programming Fundamentals', 'Learn core programming, data structures, and version control.',
  ARRAY['JavaScript','HTML','CSS','Python','Data Structures','Git'],
  ARRAY['VS Code','Git','GitHub','Chrome DevTools'],
  ARRAY['Personal Portfolio Website','Todo App','Calculator'],
  ARRAY['freeCodeCamp Responsive Web Design','The Odin Project'],
  8,
  '{"videos":["CS50 by Harvard","Traversy Media - HTML/CSS Crash Course"]}'::JSONB
FROM career_paths WHERE slug = 'software-developer'
ON CONFLICT DO NOTHING;

INSERT INTO roadmaps (career_path_id, stage, stage_order, title, description, skills, tools, projects, certifications, estimated_weeks, resources)
SELECT id, 'Intermediate', 2, 'Full Stack Development', 'Build complete web applications with React, Node.js, and databases.',
  ARRAY['React','Node.js','Express','PostgreSQL','REST APIs','Authentication'],
  ARRAY['Postman','Docker','Figma','MongoDB','Redis'],
  ARRAY['Blog Platform','E-Commerce App','Real-time Chat App'],
  ARRAY['Meta Front-End Developer (Coursera)','IBM Full Stack Software Developer'],
  16,
  '{"videos":["Full Stack Open Course","Traversy Media - MERN Stack"]}'::JSONB
FROM career_paths WHERE slug = 'software-developer'
ON CONFLICT DO NOTHING;

INSERT INTO roadmaps (career_path_id, stage, stage_order, title, description, skills, tools, projects, certifications, estimated_weeks, resources)
SELECT id, 'Advanced', 3, 'System Design & Architecture', 'Design scalable systems, microservices, and cloud deployments.',
  ARRAY['System Design','Microservices','Kubernetes','GraphQL','WebSockets','Redis'],
  ARRAY['Docker','Kubernetes','AWS','Nginx','Terraform'],
  ARRAY['Microservices App','Video Streaming Platform','Social Media Backend'],
  ARRAY['AWS Solutions Architect Associate','Kubernetes CKA'],
  16,
  '{"books":["Designing Data-Intensive Applications","Clean Code"]}'::JSONB
FROM career_paths WHERE slug = 'software-developer'
ON CONFLICT DO NOTHING;

INSERT INTO roadmaps (career_path_id, stage, stage_order, title, description, skills, tools, projects, certifications, estimated_weeks, resources)
SELECT id, 'Industry Ready', 4, 'Career Mastery', 'Contribute to open source, crack interviews, build product.',
  ARRAY['LLD','HLD','DSA Mastery','Behavioral Interviews','Open Source'],
  ARRAY['LeetCode','HackerRank','GitHub'],
  ARRAY['SaaS Product Launch','Open Source Contributions','Competitive Programming'],
  ARRAY['Google Associate Cloud Engineer'],
  12,
  '{"tips":["Practice 150 LeetCode problems","Build a SaaS","LinkedIn optimization"]}'::JSONB
FROM career_paths WHERE slug = 'software-developer'
ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO skills (name, category, importance, difficulty, description, learning_time_weeks, resources, tags) VALUES
('Python', 'Programming', 'critical', 'beginner', 'Versatile language used across web, AI, data, and automation.', 6, '{"free":["Python.org Docs","Corey Schafer YouTube"],"paid":["Udemy - 100 Days of Code"]}'::JSONB, ARRAY['programming','ai','data']),
('JavaScript', 'Programming', 'critical', 'beginner', 'Core language for web development (frontend & backend).', 8, '{"free":["javascript.info","MDN Web Docs"],"paid":["Udemy - The Complete JS Course"]}'::JSONB, ARRAY['web','frontend','backend']),
('React', 'Frontend', 'high', 'intermediate', 'Popular UI library for building interactive web apps.', 6, '{"free":["React Docs","Scrimba React Course"]}'::JSONB, ARRAY['web','frontend','javascript']),
('Node.js', 'Backend', 'high', 'intermediate', 'JavaScript runtime for building scalable backend services.', 6, '{"free":["Node.js Docs","Traversy Media"]}'::JSONB, ARRAY['backend','javascript','api']),
('SQL', 'Database', 'high', 'beginner', 'Standard language for relational database management.', 4, '{"free":["SQLZoo","W3Schools SQL"]}'::JSONB, ARRAY['database','data','backend']),
('Machine Learning', 'AI/ML', 'high', 'advanced', 'Build systems that learn from data to make predictions.', 12, '{"free":["Google ML Crash Course","fast.ai"]}'::JSONB, ARRAY['ai','ml','python']),
('Docker', 'DevOps', 'high', 'intermediate', 'Containerization platform for consistent deployments.', 4, '{"free":["Docker Docs","TechWorld with Nana"]}'::JSONB, ARRAY['devops','cloud','containers']),
('AWS', 'Cloud', 'high', 'intermediate', 'Leading cloud platform with 200+ services.', 10, '{"free":["AWS Free Tier","Cloud Guru Free Tier"]}'::JSONB, ARRAY['cloud','devops','infrastructure']),
('Data Structures & Algorithms', 'CS Fundamentals', 'critical', 'intermediate', 'Foundation for coding interviews and system design.', 16, '{"free":["NeetCode.io","LeetCode"]}'::JSONB, ARRAY['dsa','interviews','programming']),
('System Design', 'Architecture', 'high', 'advanced', 'Design scalable, reliable distributed systems.', 8, '{"free":["System Design Primer","ByteByteGo"]}'::JSONB, ARRAY['architecture','interviews','backend']),
('Figma', 'Design', 'high', 'beginner', 'Industry-standard UI/UX design tool.', 4, '{"free":["Figma YouTube Channel","Learn Figma - freeCodeCamp"]}'::JSONB, ARRAY['design','ux','ui']),
('Git & GitHub', 'Tools', 'critical', 'beginner', 'Version control system and collaboration platform.', 2, '{"free":["Git Documentation","GitHub Skills"]}'::JSONB, ARRAY['tools','version-control','collaboration'])
ON CONFLICT (name) DO NOTHING;

-- Projects
INSERT INTO projects (title, description, domain, difficulty, required_skills, technologies, estimated_days, learning_outcomes, tags) VALUES
('AI Career Counselor Chatbot', 'Build a chatbot that analyzes user skills and recommends career paths using NLP.', 'AI/ML', 'advanced', ARRAY['Python','NLP','LangChain','FastAPI'], ARRAY['Python','LangChain','OpenAI API','FastAPI','React'], 21, ARRAY['LLM integration','REST API design','Prompt engineering'], ARRAY['ai','nlp','chatbot']),
('Full Stack E-Commerce Platform', 'Build a complete e-commerce site with cart, payments, and admin dashboard.', 'Web Development', 'intermediate', ARRAY['React','Node.js','PostgreSQL','Stripe'], ARRAY['React','Express','PostgreSQL','Stripe API','Tailwind CSS'], 30, ARRAY['Full stack development','Payment integration','Admin dashboards'], ARRAY['web','fullstack','ecommerce']),
('Real-time Collaborative Code Editor', 'Build a multiplayer code editor like CodeSandbox with live sync.', 'Web Development', 'advanced', ARRAY['React','WebSockets','Node.js','Monaco Editor'], ARRAY['React','Socket.io','Monaco Editor','Node.js'], 25, ARRAY['WebSockets','CRDT algorithms','Real-time systems'], ARRAY['web','realtime','collaboration']),
('Network Intrusion Detection System', 'ML-powered system to detect anomalies in network traffic.', 'Cybersecurity', 'advanced', ARRAY['Python','Machine Learning','Networking','Scikit-learn'], ARRAY['Python','Scikit-learn','Pandas','Wireshark'], 20, ARRAY['Anomaly detection','Network security','ML pipelines'], ARRAY['cybersecurity','ml','networking']),
('Data Pipeline with Apache Kafka', 'Build real-time data streaming pipeline for analytics dashboard.', 'Data Engineering', 'advanced', ARRAY['Python','Kafka','Spark','SQL'], ARRAY['Apache Kafka','Apache Spark','PostgreSQL','Grafana'], 20, ARRAY['Streaming data','ETL pipelines','Data visualization'], ARRAY['data','kafka','pipeline']),
('Personal Finance Tracker', 'Web app to track income, expenses, and visualize financial health.', 'Web Development', 'beginner', ARRAY['React','Node.js','PostgreSQL'], ARRAY['React','Express','PostgreSQL','Chart.js'], 14, ARRAY['CRUD operations','Data visualization','Auth'], ARRAY['web','finance','beginner']),
('Image Classification App', 'Train CNN to classify images and deploy with a web interface.', 'AI/ML', 'intermediate', ARRAY['Python','PyTorch','FastAPI','React'], ARRAY['PyTorch','FastAPI','React','Docker'], 16, ARRAY['CNN architecture','Model deployment','API design'], ARRAY['ai','computer-vision','deployment']),
('Smart Study Planner', 'App that generates personalized study plans using AI based on goals and time.', 'AI/ML', 'intermediate', ARRAY['Python','React','OpenAI API'], ARRAY['React','Node.js','OpenAI API','PostgreSQL'], 18, ARRAY['AI integration','Scheduling algorithms','User personalization'], ARRAY['ai','productivity','study']),
('IoT Smart Home Dashboard', 'Raspberry Pi-based dashboard monitoring temperature, motion, and energy usage.', 'IoT', 'intermediate', ARRAY['Python','MQTT','React','Raspberry Pi'], ARRAY['Python','MQTT','InfluxDB','Grafana','React'], 21, ARRAY['IoT protocols','Time-series data','Sensor integration'], ARRAY['iot','python','dashboard']),
('Cloud Cost Optimizer', 'Tool that analyzes AWS usage and suggests cost-saving recommendations.', 'Cloud Computing', 'advanced', ARRAY['Python','AWS','Terraform','Data Analysis'], ARRAY['Python','Boto3','AWS','Pandas','Streamlit'], 18, ARRAY['AWS APIs','Cost analysis','Infrastructure as Code'], ARRAY['cloud','aws','cost'])
ON CONFLICT DO NOTHING;

-- Certifications
INSERT INTO certifications (title, provider, domain, level, duration_weeks, cost_usd, url, description, tags) VALUES
('Google Machine Learning Crash Course', 'Google', 'AI/ML', 'beginner', 2, 0, 'https://developers.google.com/machine-learning/crash-course', 'Free intro to ML by Google.', ARRAY['ml','python','free']),
('AWS Certified Solutions Architect Associate', 'Amazon', 'Cloud', 'intermediate', 12, 300, 'https://aws.amazon.com/certification', 'Industry gold-standard cloud certification.', ARRAY['aws','cloud','certification']),
('Google Professional ML Engineer', 'Google', 'AI/ML', 'advanced', 16, 200, 'https://cloud.google.com/certification/machine-learning-engineer', 'Professional ML engineering on GCP.', ARRAY['ml','gcp','professional']),
('Meta Front-End Developer', 'Meta / Coursera', 'Web Development', 'beginner', 24, 0, 'https://www.coursera.org/professional-certificates/meta-front-end-developer', 'Comprehensive front-end specialization.', ARRAY['react','html','css','frontend']),
('DeepLearning.AI TensorFlow Developer', 'DeepLearning.AI / Coursera', 'AI/ML', 'intermediate', 16, 0, 'https://www.coursera.org/professional-certificates/tensorflow-in-practice', 'Hands-on TensorFlow for ML practitioners.', ARRAY['tensorflow','ml','python']),
('Certified Kubernetes Administrator', 'CNCF', 'DevOps', 'advanced', 12, 395, 'https://www.cncf.io/certification/cka/', 'Official Kubernetes administration certification.', ARRAY['kubernetes','devops','containers']),
('CompTIA Security+', 'CompTIA', 'Cybersecurity', 'beginner', 10, 370, 'https://www.comptia.org/certifications/security', 'Entry-level cybersecurity certification.', ARRAY['security','cybersecurity','networking'])
ON CONFLICT DO NOTHING;

-- Internships & Jobs
INSERT INTO internships_jobs (title, company, type, location, is_remote, stipend_month, domain, required_skills, description, deadline) VALUES
('Software Developer Intern', 'Microsoft', 'internship', 'Hyderabad', FALSE, 80000, 'Web Development', ARRAY['JavaScript','React','Node.js'], 'Work on Azure developer tools team. Build features used by millions.', CURRENT_DATE + 30),
('ML Research Intern', 'Google', 'internship', 'Bangalore', FALSE, 100000, 'AI/ML', ARRAY['Python','TensorFlow','Machine Learning'], 'Research intern in Google Brain. Work on cutting-edge ML models.', CURRENT_DATE + 45),
('Data Engineering Intern', 'Flipkart', 'internship', 'Bangalore', TRUE, 50000, 'Data Engineering', ARRAY['Python','Spark','SQL','Kafka'], 'Build real-time data pipelines for e-commerce analytics.', CURRENT_DATE + 20),
('Frontend Developer Intern', 'Razorpay', 'internship', 'Bangalore', TRUE, 40000, 'Web Development', ARRAY['React','TypeScript','CSS'], 'Build next-gen payment UI experiences.', CURRENT_DATE + 25),
('Cybersecurity Intern', 'HCL Technologies', 'internship', 'Noida', FALSE, 35000, 'Cybersecurity', ARRAY['Networking','Linux','Python','Security Tools'], 'Work with security operations team on threat detection.', CURRENT_DATE + 35),
('Junior Software Engineer', 'Infosys', 'full_time', 'Pune', FALSE, NULL, 'Software Development', ARRAY['Java','Spring Boot','SQL'], 'Develop enterprise software solutions for Fortune 500 clients.', CURRENT_DATE + 60),
('Data Analyst', 'Swiggy', 'full_time', 'Bangalore', TRUE, NULL, 'Data Science', ARRAY['SQL','Python','Tableau','Excel'], 'Analyze food delivery data to optimize operations.', CURRENT_DATE + 40),
('Cloud Engineer', 'TCS', 'full_time', 'Chennai', FALSE, NULL, 'Cloud Computing', ARRAY['AWS','Terraform','Linux','Docker'], 'Manage cloud infrastructure for enterprise clients.', CURRENT_DATE + 50)
ON CONFLICT DO NOTHING;

-- Achievements
INSERT INTO achievements (title, description, icon, xp_reward, condition_type, condition_value) VALUES
('First Login', 'Welcome to Guidance+! Your journey begins.', 'Star', 10, 'login_count', 1),
('Profile Complete', 'Filled out 100% of your profile.', 'User', 50, 'profile_completion', 100),
('Roadmap Explorer', 'Explored your first career roadmap.', 'Map', 25, 'roadmaps_viewed', 1),
('Quick Learner', 'Completed 5 skills in your roadmap.', 'Zap', 100, 'skills_completed', 5),
('Project Builder', 'Completed your first project.', 'Code', 150, 'projects_completed', 1),
('Week Warrior', 'Maintained a 7-day streak.', 'Flame', 200, 'streak_days', 7),
('Interview Ready', 'Completed 50 interview questions.', 'Award', 150, 'questions_answered', 50),
('Mentor Seeker', 'Had 10 conversations with AI Mentor.', 'MessageSquare', 75, 'chat_sessions', 10),
('Job Hunter', 'Applied to 5 internships.', 'Briefcase', 100, 'applications_count', 5),
('Community Champion', 'Posted 10 times in the forum.', 'Users', 75, 'forum_posts', 10)
ON CONFLICT (title) DO NOTHING;

-- Aptitude Questions
INSERT INTO aptitude_questions (category, subcategory, question, options, correct_answer, explanation, difficulty) VALUES
('Quantitative', 'Number Systems', 'What is the LCM of 12, 18, and 24?', '["36","48","72","60"]'::JSONB, 2, 'LCM(12,18,24) = 72. Prime factorization: 12=2²×3, 18=2×3², 24=2³×3. LCM=2³×3²=72.', 'easy'),
('Quantitative', 'Percentages', 'A product is sold for Rs. 540 at a 20% profit. What is the cost price?', '["Rs. 432","Rs. 450","Rs. 480","Rs. 500"]'::JSONB, 1, 'CP = SP / (1 + profit%) = 540 / 1.20 = Rs. 450.', 'easy'),
('Quantitative', 'Time & Work', 'A can do a job in 10 days, B in 15 days. How long if they work together?', '["5 days","6 days","7 days","8 days"]'::JSONB, 1, 'Combined rate = 1/10 + 1/15 = 5/30 = 1/6. Time = 6 days.', 'medium'),
('Logical', 'Pattern Recognition', 'What comes next: 2, 6, 12, 20, 30, ?', '["40","42","44","46"]'::JSONB, 1, 'Differences are 4,6,8,10,12. Next = 30+12 = 42.', 'easy'),
('Logical', 'Syllogisms', 'All cats are animals. All animals have four legs. Conclusion: All cats have four legs.', '["True","False","Cannot determine","Partially true"]'::JSONB, 0, 'Both premises are universal affirmatives. The conclusion follows deductively.', 'easy'),
('Verbal', 'Reading Comprehension', 'Which word is closest in meaning to "Ephemeral"?', '["Permanent","Transient","Eternal","Massive"]'::JSONB, 1, 'Ephemeral means lasting for a very short time — Transient is the correct synonym.', 'medium'),
('Verbal', 'Synonyms', 'Choose the antonym of "Lucid":', '["Clear","Transparent","Vague","Bright"]'::JSONB, 2, 'Lucid means clear and easy to understand. Its antonym is Vague.', 'easy'),
('Quantitative', 'Speed & Distance', 'A train 150m long passes a pole in 15s. What is its speed in km/h?', '["36","40","54","60"]'::JSONB, 0, 'Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h.', 'easy'),
('Logical', 'Blood Relations', 'A is the son of B. C is the sister of A. D is the father of B. What is C to D?', '["Daughter","Granddaughter","Niece","Sister"]'::JSONB, 1, 'D is father of B, B is parent of A and C. So C is grandchild (granddaughter) of D.', 'medium'),
('Quantitative', 'Simple Interest', 'Find SI on Rs. 5000 at 8% per annum for 3 years.', '["Rs. 1000","Rs. 1200","Rs. 1500","Rs. 800"]'::JSONB, 1, 'SI = P×R×T/100 = 5000×8×3/100 = Rs. 1200.', 'easy')
ON CONFLICT DO NOTHING;

-- Interview Questions
INSERT INTO interview_questions (type, domain, question, sample_answer, difficulty, tags) VALUES
('HR', 'General', 'Tell me about yourself.', 'Structured introduction: Background → Education → Key skills → Why this role. Keep it under 2 minutes, concise, and relevant to the job.', 'easy', ARRAY['hr','intro','fresher']),
('HR', 'General', 'Why do you want to join our company?', 'Research the company mission, recent products/achievements. Align your answer with specific aspects of the company. Show genuine interest.', 'easy', ARRAY['hr','motivation']),
('HR', 'General', 'What is your greatest strength?', 'Choose a skill that is relevant to the role. Give a specific example using STAR method (Situation, Task, Action, Result).', 'easy', ARRAY['hr','strengths']),
('Technical', 'Web Development', 'What is the difference between == and === in JavaScript?', '== performs type coercion (1 == "1" is true), === is strict equality without type coercion (1 === "1" is false). Always prefer === in production code.', 'easy', ARRAY['javascript','web','fundamentals']),
('Technical', 'AI/ML', 'Explain overfitting and how to prevent it.', 'Overfitting: model memorizes training data but fails on new data. Prevention: regularization (L1/L2), dropout, more training data, cross-validation, early stopping, simpler model.', 'medium', ARRAY['ml','overfitting','regularization']),
('Technical', 'Database', 'What is the difference between SQL and NoSQL databases?', 'SQL: structured, ACID compliant, relational, best for structured data (PostgreSQL, MySQL). NoSQL: flexible schema, horizontal scaling, best for unstructured data (MongoDB, Redis, DynamoDB).', 'medium', ARRAY['database','sql','nosql']),
('System Design', 'General', 'How would you design a URL shortener like bit.ly?', 'Components: API Gateway, Hash generation (Base62), Database (mapping long→short), Cache (Redis), CDN. Consider: collision handling, custom aliases, analytics, rate limiting, expiry.', 'hard', ARRAY['system-design','scalability','backend']),
('Technical', 'Python', 'What are Python decorators? Give an example.', 'Decorators wrap functions to extend behavior without modifying them. Example: @timer logs execution time. Use @functools.wraps to preserve metadata. Common: @property, @staticmethod, @classmethod.', 'medium', ARRAY['python','decorators','oop'])
ON CONFLICT DO NOTHING;
