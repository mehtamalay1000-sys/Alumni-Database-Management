// Alumni Database Management System - Data Store
// Uses localStorage for persistence

const STORAGE_KEYS = {
  USERS: 'alumni_users',
  ALUMNI: 'alumni_records',
  JOBS: 'alumni_jobs',
  EVENTS: 'alumni_events',
  MENTORSHIP: 'alumni_mentorship',
  CURRENT_USER: 'alumni_current_user',
};

// --- Seed Data ---
const seedAlumni = [
  { id: 1, name: 'Rahul Sharma', batch: 'Batch 2018', email: 'rahul.sharma@email.com', jobTitle: 'Software Engineer', company: 'Tech Solutions', phone: '+91 9876543210', avatar: '', department: 'Computer Science', linkedin: 'https://linkedin.com/in/rahulsharma', bio: 'Passionate about building scalable web applications and cloud computing.', skills: ['React', 'Node.js', 'AWS'] },
  { id: 2, name: 'Meera Patel', batch: 'Batch 2019', email: 'meera.patel@email.com', jobTitle: 'Data Analyst', company: 'Software Bop', phone: '+91 9876543211', avatar: '', department: 'Information Technology', linkedin: 'https://linkedin.com/in/meerapatel', bio: 'Data enthusiast with a passion for machine learning and AI.', skills: ['Python', 'SQL', 'Tableau'] },
  { id: 3, name: 'Akshat Singh', batch: 'Batch 2017', email: 'akshat.singh@email.com', jobTitle: 'Marketing Manager', company: 'Adblaze', phone: '+91 9876543212', avatar: '', department: 'Business Administration', linkedin: 'https://linkedin.com/in/akshatsingh', bio: 'Creative marketer with expertise in digital campaigns.', skills: ['SEO', 'Content Marketing', 'Analytics'] },
  { id: 4, name: 'Priya Nair', batch: 'Batch 2020', email: 'priya.nair@email.com', jobTitle: 'UX Designer', company: 'DesignHub', phone: '+91 9876543213', avatar: '', department: 'Design', linkedin: 'https://linkedin.com/in/priyanair', bio: 'Human-centered designer focused on crafting delightful digital experiences.', skills: ['Figma', 'User Research', 'Prototyping'] },
  { id: 5, name: 'Vikram Reddy', batch: 'Batch 2016', email: 'vikram.reddy@email.com', jobTitle: 'DevOps Engineer', company: 'CloudFirst', phone: '+91 9876543214', avatar: '', department: 'Computer Science', linkedin: 'https://linkedin.com/in/vikramreddy', bio: 'Infrastructure nerd who loves automating everything.', skills: ['Docker', 'Kubernetes', 'Terraform'] },
  { id: 6, name: 'Ananya Gupta', batch: 'Batch 2021', email: 'ananya.gupta@email.com', jobTitle: 'Frontend Developer', company: 'WebWorks', phone: '+91 9876543215', avatar: '', department: 'Computer Science', linkedin: 'https://linkedin.com/in/ananyagupta', bio: 'Building pixel-perfect, accessible web interfaces.', skills: ['React', 'TypeScript', 'CSS'] },
  { id: 7, name: 'Karthik Menon', batch: 'Batch 2018', email: 'karthik.menon@email.com', jobTitle: 'Product Manager', company: 'InnovateTech', phone: '+91 9876543216', avatar: '', department: 'Business Administration', linkedin: 'https://linkedin.com/in/karthikmenon', bio: 'Bridging the gap between technology and business.', skills: ['Agile', 'Strategy', 'Leadership'] },
  { id: 8, name: 'Sneha Joshi', batch: 'Batch 2019', email: 'sneha.joshi@email.com', jobTitle: 'Data Scientist', company: 'AI Labs', phone: '+91 9876543217', avatar: '', department: 'Computer Science', linkedin: 'https://linkedin.com/in/snehajoshi', bio: 'Turning data into actionable insights using ML.', skills: ['Python', 'TensorFlow', 'Statistics'] },
];

const seedJobs = [
  { id: 1, title: 'Software Engineer', company: 'Tech Solutions', location: 'Bangalore', type: 'Full-time', salary: '₹12-18 LPA', description: 'Looking for a skilled software engineer with 2+ years of experience in React and Node.js.', postedBy: 'Rahul Sharma', postedDate: '2026-03-10', deadline: '2026-04-10', skills: ['React', 'Node.js', 'MongoDB'] },
  { id: 2, title: 'Marketing Intern', company: 'MarketMax', location: 'Mumbai', type: 'Internship', salary: '₹15,000/month', description: 'Exciting internship opportunity for marketing enthusiasts.', postedBy: 'Akshat Singh', postedDate: '2026-03-08', deadline: '2026-03-30', skills: ['Social Media', 'Content Writing'] },
  { id: 3, title: 'Data Analyst', company: 'DataDriven', location: 'Hyderabad', type: 'Full-time', salary: '₹8-12 LPA', description: 'Join our analytics team to drive data-informed decisions.', postedBy: 'Meera Patel', postedDate: '2026-03-12', deadline: '2026-04-15', skills: ['SQL', 'Python', 'Tableau'] },
  { id: 4, title: 'UX Designer', company: 'Creative Co', location: 'Remote', type: 'Contract', salary: '₹60,000/month', description: 'Design beautiful and functional user interfaces for our products.', postedBy: 'Priya Nair', postedDate: '2026-03-05', deadline: '2026-04-05', skills: ['Figma', 'Adobe XD', 'User Research'] },
  { id: 5, title: 'DevOps Engineer', company: 'CloudFirst', location: 'Pune', type: 'Full-time', salary: '₹15-22 LPA', description: 'Manage and optimize our cloud infrastructure.', postedBy: 'Vikram Reddy', postedDate: '2026-03-01', deadline: '2026-03-31', skills: ['AWS', 'Docker', 'CI/CD'] },
];

const seedEvents = [
  { id: 1, title: 'Alumni Reunion 2026', date: '2026-04-15', time: '10:00 AM', location: 'College Auditorium', description: 'Annual alumni reunion with networking, talks, and cultural events. Reconnect with your batchmates!', type: 'Reunion', organizer: 'Alumni Association', attendees: 120, maxAttendees: 200, image: '' },
  { id: 2, title: 'Musala by Auditorium', date: '2026-03-28', time: '6:00 PM', location: 'College Auditorium', description: 'Musical evening showcasing talent from alumni across batches.', type: 'Cultural', organizer: 'Cultural Committee', attendees: 80, maxAttendees: 150, image: '' },
  { id: 3, title: 'Tech Talk: AI in 2026', date: '2026-04-02', time: '2:00 PM', location: 'Seminar Hall B', description: 'Industry expert panel discussion on the future of AI and its applications.', type: 'Seminar', organizer: 'Tech Club', attendees: 45, maxAttendees: 100, image: '' },
  { id: 4, title: 'Career Fair 2026', date: '2026-05-10', time: '9:00 AM', location: 'Main Campus Ground', description: 'Connect with top companies for job opportunities. Open to all alumni and final year students.', type: 'Career', organizer: 'Placement Cell', attendees: 200, maxAttendees: 500, image: '' },
  { id: 5, title: 'Startup Pitch Night', date: '2026-04-20', time: '5:00 PM', location: 'Innovation Lab', description: 'Alumni entrepreneurs pitch their startups to potential investors and mentors.', type: 'Networking', organizer: 'Entrepreneurship Cell', attendees: 35, maxAttendees: 75, image: '' },
];

const seedMentorship = [
  { id: 1, mentorId: 1, mentorName: 'Rahul Sharma', menteeId: 6, menteeName: 'Ananya Gupta', topic: 'Frontend Development Career Growth', status: 'Active', startDate: '2026-02-01', notes: 'Weekly 1-hour sessions on Sundays.' },
  { id: 2, mentorId: 5, mentorName: 'Vikram Reddy', menteeId: null, menteeName: null, topic: 'Cloud Architecture & DevOps', status: 'Open', startDate: null, notes: 'Looking for mentees interested in cloud and infrastructure.' },
  { id: 3, mentorId: 7, mentorName: 'Karthik Menon', menteeId: null, menteeName: null, topic: 'Product Management Fundamentals', status: 'Open', startDate: null, notes: 'Happy to guide aspiring product managers.' },
  { id: 4, mentorId: 3, mentorName: 'Akshat Singh', menteeId: null, menteeName: null, topic: 'Digital Marketing & Branding', status: 'Open', startDate: null, notes: '10+ years of experience in digital marketing.' },
  { id: 5, mentorId: 8, mentorName: 'Sneha Joshi', menteeId: null, menteeName: null, topic: 'Data Science & Machine Learning', status: 'Open', startDate: null, notes: 'Can guide on ML projects and career paths.' },
];

const seedUsers = [
  { id: 1, email: 'admin@alumni.edu', password: 'admin123', name: 'Admin User', role: 'admin', alumniId: null },
  { id: 2, email: 'john.doe@email.com', password: 'password123', name: 'John Doe', role: 'alumni', alumniId: 1 },
];

// --- Helpers ---
function getFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function initializeStore() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, seedUsers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALUMNI)) {
    saveToStorage(STORAGE_KEYS.ALUMNI, seedAlumni);
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    saveToStorage(STORAGE_KEYS.JOBS, seedJobs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    saveToStorage(STORAGE_KEYS.EVENTS, seedEvents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MENTORSHIP)) {
    saveToStorage(STORAGE_KEYS.MENTORSHIP, seedMentorship);
  }
}

// --- Auth ---
export function login(email, password) {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, safeUser);
    return { success: true, user: safeUser };
  }
  return { success: false, message: 'Invalid email or password' };
}

export function register(name, email, password, role = 'alumni') {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }
  const newUser = { id: Date.now(), email, password, name, role, alumniId: null };
  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);

  // Also create alumni record
  if (role === 'alumni') {
    const alumni = getFromStorage(STORAGE_KEYS.ALUMNI, []);
    const newAlumni = {
      id: Date.now(),
      name,
      batch: '',
      email,
      jobTitle: '',
      company: '',
      phone: '',
      avatar: '',
      department: '',
      linkedin: '',
      bio: '',
      skills: [],
    };
    alumni.push(newAlumni);
    saveToStorage(STORAGE_KEYS.ALUMNI, alumni);
    newUser.alumniId = newAlumni.id;
    saveToStorage(STORAGE_KEYS.USERS, users);
  }

  const { password: _, ...safeUser } = newUser;
  saveToStorage(STORAGE_KEYS.CURRENT_USER, safeUser);
  return { success: true, user: safeUser };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUser() {
  return getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
}

// --- Alumni CRUD ---
export function getAlumni() {
  return getFromStorage(STORAGE_KEYS.ALUMNI, []);
}

export function getAlumniById(id) {
  const alumni = getAlumni();
  return alumni.find(a => a.id === Number(id)) || null;
}

export function addAlumni(record) {
  const alumni = getAlumni();
  const newRecord = { ...record, id: Date.now() };
  alumni.push(newRecord);
  saveToStorage(STORAGE_KEYS.ALUMNI, alumni);
  return newRecord;
}

export function updateAlumni(id, updates) {
  const alumni = getAlumni();
  const index = alumni.findIndex(a => a.id === Number(id));
  if (index !== -1) {
    alumni[index] = { ...alumni[index], ...updates };
    saveToStorage(STORAGE_KEYS.ALUMNI, alumni);
    return alumni[index];
  }
  return null;
}

export function deleteAlumni(id) {
  let alumni = getAlumni();
  alumni = alumni.filter(a => a.id !== Number(id));
  saveToStorage(STORAGE_KEYS.ALUMNI, alumni);
}

// --- Jobs CRUD ---
export function getJobs() {
  return getFromStorage(STORAGE_KEYS.JOBS, []);
}

export function addJob(job) {
  const jobs = getJobs();
  const newJob = { ...job, id: Date.now(), postedDate: new Date().toISOString().split('T')[0] };
  jobs.push(newJob);
  saveToStorage(STORAGE_KEYS.JOBS, jobs);
  return newJob;
}

export function deleteJob(id) {
  let jobs = getJobs();
  jobs = jobs.filter(j => j.id !== Number(id));
  saveToStorage(STORAGE_KEYS.JOBS, jobs);
}

// --- Events CRUD ---
export function getEvents() {
  return getFromStorage(STORAGE_KEYS.EVENTS, []);
}

export function addEvent(event) {
  const events = getEvents();
  const newEvent = { ...event, id: Date.now(), attendees: 0 };
  events.push(newEvent);
  saveToStorage(STORAGE_KEYS.EVENTS, events);
  return newEvent;
}

export function rsvpEvent(eventId) {
  const events = getEvents();
  const index = events.findIndex(e => e.id === Number(eventId));
  if (index !== -1 && events[index].attendees < events[index].maxAttendees) {
    events[index].attendees += 1;
    saveToStorage(STORAGE_KEYS.EVENTS, events);
    return events[index];
  }
  return null;
}

export function deleteEvent(id) {
  let events = getEvents();
  events = events.filter(e => e.id !== Number(id));
  saveToStorage(STORAGE_KEYS.EVENTS, events);
}

// --- Mentorship CRUD ---
export function getMentorships() {
  return getFromStorage(STORAGE_KEYS.MENTORSHIP, []);
}

export function addMentorship(mentorship) {
  const mentorships = getMentorships();
  const newMentorship = { ...mentorship, id: Date.now() };
  mentorships.push(newMentorship);
  saveToStorage(STORAGE_KEYS.MENTORSHIP, mentorships);
  return newMentorship;
}

export function requestMentorship(mentorshipId, menteeName) {
  const mentorships = getMentorships();
  const index = mentorships.findIndex(m => m.id === Number(mentorshipId));
  if (index !== -1 && mentorships[index].status === 'Open') {
    mentorships[index].menteeName = menteeName;
    mentorships[index].status = 'Active';
    mentorships[index].startDate = new Date().toISOString().split('T')[0];
    saveToStorage(STORAGE_KEYS.MENTORSHIP, mentorships);
    return mentorships[index];
  }
  return null;
}

// --- Stats ---
export function getStats() {
  const alumni = getAlumni();
  const events = getEvents();
  const mentorships = getMentorships();
  const jobs = getJobs();

  return {
    totalAlumni: alumni.length,
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
    activeMentorships: mentorships.filter(m => m.status === 'Active').length,
    openMentorships: mentorships.filter(m => m.status === 'Open').length,
    totalJobs: jobs.length,
    mentorshipRequests: mentorships.length,
  };
}

// Initialize on import
initializeStore();
