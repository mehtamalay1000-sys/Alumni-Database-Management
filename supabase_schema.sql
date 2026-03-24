-- ============================================
-- Alumni Database Management System
-- Supabase Schema Setup
-- ============================================
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- 1. Alumni Table
create table if not exists alumni (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  batch text default '',
  email text not null,
  job_title text default '',
  company text default '',
  phone text default '',
  avatar text default '',
  department text default '',
  linkedin text default '',
  bio text default '',
  skills text[] default '{}',
  created_at timestamptz default now()
);

-- 2. Jobs Table
create table if not exists jobs (
  id bigint generated always as identity primary key,
  title text not null,
  company text not null,
  location text default '',
  type text default '',
  salary text default '',
  description text default '',
  posted_by text default '',
  posted_date date default current_date,
  deadline date,
  skills text[] default '{}',
  created_at timestamptz default now()
);

-- 3. Events Table
create table if not exists events (
  id bigint generated always as identity primary key,
  title text not null,
  date date not null,
  time text default '',
  location text default '',
  description text default '',
  type text default '',
  organizer text default '',
  attendees int default 0,
  max_attendees int default 100,
  image text default '',
  created_at timestamptz default now()
);

-- 4. Mentorships Table
create table if not exists mentorships (
  id bigint generated always as identity primary key,
  mentor_user_id uuid references auth.users(id) on delete set null,
  mentor_name text not null,
  mentee_user_id uuid references auth.users(id) on delete set null,
  mentee_name text,
  topic text not null,
  status text default 'Open',
  start_date date,
  notes text default '',
  created_at timestamptz default now()
);

-- 5. Profiles table (for storing user role: admin/alumni)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  role text default 'alumni',
  created_at timestamptz default now()
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
alter table alumni enable row level security;
alter table jobs enable row level security;
alter table events enable row level security;
alter table mentorships enable row level security;
alter table profiles enable row level security;

-- Alumni: anyone authenticated can read, owners can update their own
create policy "Anyone can view alumni" on alumni for select using (true);
create policy "Users can insert own alumni record" on alumni for insert with check (auth.uid() = user_id);
create policy "Users can update own alumni record" on alumni for update using (auth.uid() = user_id);
create policy "Users can delete own alumni record" on alumni for delete using (auth.uid() = user_id);

-- Jobs: anyone authenticated can read, anyone can insert
create policy "Anyone can view jobs" on jobs for select using (true);
create policy "Authenticated users can post jobs" on jobs for insert with check (auth.uid() is not null);
create policy "Authenticated users can delete jobs" on jobs for delete using (auth.uid() is not null);

-- Events: anyone can read, authenticated can insert/update
create policy "Anyone can view events" on events for select using (true);
create policy "Authenticated users can create events" on events for insert with check (auth.uid() is not null);
create policy "Authenticated users can update events" on events for update using (auth.uid() is not null);
create policy "Authenticated users can delete events" on events for delete using (auth.uid() is not null);

-- Mentorships: anyone can read, authenticated can insert/update
create policy "Anyone can view mentorships" on mentorships for select using (true);
create policy "Authenticated users can create mentorships" on mentorships for insert with check (auth.uid() is not null);
create policy "Authenticated users can update mentorships" on mentorships for update using (auth.uid() is not null);

-- Profiles: users can read all, insert/update own
create policy "Anyone can view profiles" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- ============================================
-- Seed Data (Optional - run after table creation)
-- ============================================

-- Seed Alumni (without user_id since these are demo records)
insert into alumni (name, batch, email, job_title, company, phone, department, linkedin, bio, skills) values
  ('Rahul Sharma', 'Batch 2018', 'rahul.sharma@email.com', 'Software Engineer', 'Tech Solutions', '+91 9876543210', 'Computer Science', 'https://linkedin.com/in/rahulsharma', 'Passionate about building scalable web applications and cloud computing.', '{"React","Node.js","AWS"}'),
  ('Meera Patel', 'Batch 2019', 'meera.patel@email.com', 'Data Analyst', 'Software Bop', '+91 9876543211', 'Information Technology', 'https://linkedin.com/in/meerapatel', 'Data enthusiast with a passion for machine learning and AI.', '{"Python","SQL","Tableau"}'),
  ('Akshat Singh', 'Batch 2017', 'akshat.singh@email.com', 'Marketing Manager', 'Adblaze', '+91 9876543212', 'Business Administration', 'https://linkedin.com/in/akshatsingh', 'Creative marketer with expertise in digital campaigns.', '{"SEO","Content Marketing","Analytics"}'),
  ('Priya Nair', 'Batch 2020', 'priya.nair@email.com', 'UX Designer', 'DesignHub', '+91 9876543213', 'Design', 'https://linkedin.com/in/priyanair', 'Human-centered designer focused on crafting delightful digital experiences.', '{"Figma","User Research","Prototyping"}'),
  ('Vikram Reddy', 'Batch 2016', 'vikram.reddy@email.com', 'DevOps Engineer', 'CloudFirst', '+91 9876543214', 'Computer Science', 'https://linkedin.com/in/vikramreddy', 'Infrastructure nerd who loves automating everything.', '{"Docker","Kubernetes","Terraform"}'),
  ('Ananya Gupta', 'Batch 2021', 'ananya.gupta@email.com', 'Frontend Developer', 'WebWorks', '+91 9876543215', 'Computer Science', 'https://linkedin.com/in/ananyagupta', 'Building pixel-perfect, accessible web interfaces.', '{"React","TypeScript","CSS"}'),
  ('Karthik Menon', 'Batch 2018', 'karthik.menon@email.com', 'Product Manager', 'InnovateTech', '+91 9876543216', 'Business Administration', 'https://linkedin.com/in/karthikmenon', 'Bridging the gap between technology and business.', '{"Agile","Strategy","Leadership"}'),
  ('Sneha Joshi', 'Batch 2019', 'sneha.joshi@email.com', 'Data Scientist', 'AI Labs', '+91 9876543217', 'Computer Science', 'https://linkedin.com/in/snehajoshi', 'Turning data into actionable insights using ML.', '{"Python","TensorFlow","Statistics"}');

-- Seed Jobs
insert into jobs (title, company, location, type, salary, description, posted_by, posted_date, deadline, skills) values
  ('Software Engineer', 'Tech Solutions', 'Bangalore', 'Full-time', '₹12-18 LPA', 'Looking for a skilled software engineer with 2+ years of experience in React and Node.js.', 'Rahul Sharma', '2026-03-10', '2026-04-10', '{"React","Node.js","MongoDB"}'),
  ('Marketing Intern', 'MarketMax', 'Mumbai', 'Internship', '₹15,000/month', 'Exciting internship opportunity for marketing enthusiasts.', 'Akshat Singh', '2026-03-08', '2026-03-30', '{"Social Media","Content Writing"}'),
  ('Data Analyst', 'DataDriven', 'Hyderabad', 'Full-time', '₹8-12 LPA', 'Join our analytics team to drive data-informed decisions.', 'Meera Patel', '2026-03-12', '2026-04-15', '{"SQL","Python","Tableau"}'),
  ('UX Designer', 'Creative Co', 'Remote', 'Contract', '₹60,000/month', 'Design beautiful and functional user interfaces for our products.', 'Priya Nair', '2026-03-05', '2026-04-05', '{"Figma","Adobe XD","User Research"}'),
  ('DevOps Engineer', 'CloudFirst', 'Pune', 'Full-time', '₹15-22 LPA', 'Manage and optimize our cloud infrastructure.', 'Vikram Reddy', '2026-03-01', '2026-03-31', '{"AWS","Docker","CI/CD"}');

-- Seed Events
insert into events (title, date, time, location, description, type, organizer, attendees, max_attendees) values
  ('Alumni Reunion 2026', '2026-04-15', '10:00 AM', 'College Auditorium', 'Annual alumni reunion with networking, talks, and cultural events. Reconnect with your batchmates!', 'Reunion', 'Alumni Association', 120, 200),
  ('Musala by Auditorium', '2026-03-28', '6:00 PM', 'College Auditorium', 'Musical evening showcasing talent from alumni across batches.', 'Cultural', 'Cultural Committee', 80, 150),
  ('Tech Talk: AI in 2026', '2026-04-02', '2:00 PM', 'Seminar Hall B', 'Industry expert panel discussion on the future of AI and its applications.', 'Seminar', 'Tech Club', 45, 100),
  ('Career Fair 2026', '2026-05-10', '9:00 AM', 'Main Campus Ground', 'Connect with top companies for job opportunities. Open to all alumni and final year students.', 'Career', 'Placement Cell', 200, 500),
  ('Startup Pitch Night', '2026-04-20', '5:00 PM', 'Innovation Lab', 'Alumni entrepreneurs pitch their startups to potential investors and mentors.', 'Networking', 'Entrepreneurship Cell', 35, 75);

-- Seed Mentorships
insert into mentorships (mentor_name, mentee_name, topic, status, start_date, notes) values
  ('Rahul Sharma', 'Ananya Gupta', 'Frontend Development Career Growth', 'Active', '2026-02-01', 'Weekly 1-hour sessions on Sundays.'),
  ('Vikram Reddy', null, 'Cloud Architecture & DevOps', 'Open', null, 'Looking for mentees interested in cloud and infrastructure.'),
  ('Karthik Menon', null, 'Product Management Fundamentals', 'Open', null, 'Happy to guide aspiring product managers.'),
  ('Akshat Singh', null, 'Digital Marketing & Branding', 'Open', null, '10+ years of experience in digital marketing.'),
  ('Sneha Joshi', null, 'Data Science & Machine Learning', 'Open', null, 'Can guide on ML projects and career paths.');
