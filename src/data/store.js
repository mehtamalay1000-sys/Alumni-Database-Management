// Alumni Database Management System - Data Store
// Uses localStorage for persistence
import { realPlacedStudents } from './realStudents';

const STORAGE_KEYS = {
  USERS: 'alumni_users',
  ALUMNI: 'alumni_records',
  JOBS: 'alumni_jobs',
  EVENTS: 'alumni_events',
  EVENT_BOOKINGS: 'alumni_event_bookings',
  MENTORSHIP: 'alumni_mentorship',
  MENTORSHIP_BOOKINGS: 'alumni_mentorship_bookings',
  CURRENT_USER: 'alumni_current_user',
  DATA_VERSION: 'alumni_data_version',
};

const CURRENT_DATA_VERSION = '2024-25-v2';

// --- Seed Data (Real 2024-25 Placement Data) ---
const seedAlumni = realPlacedStudents.map(s => ({
  ...s,
  avatar: '',
  linkedin: '',
  bio: `${s.jobTitle} at ${s.company}. Batch 2024-25, Computer Engineering.`,
}));

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
  // Force re-seed alumni when data version changes (ensures real data replaces placeholders)
  const storedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
  if (storedVersion !== CURRENT_DATA_VERSION) {
    saveToStorage(STORAGE_KEYS.ALUMNI, seedAlumni);
    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
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

export function updateCurrentUser(updates) {
  const user = getCurrentUser();
  if (user) {
    const updatedUser = { ...user, ...updates };
    saveToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);
    return updatedUser;
  }
  return null;
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

export function bookEventTicket(eventId, userInfo) {
  const bookings = getFromStorage(STORAGE_KEYS.EVENT_BOOKINGS, []);
  // Check if user already booked this event
  if (bookings.find(b => b.eventId === Number(eventId) && b.userId === userInfo.userId)) {
    return { success: false, message: 'You have already booked a ticket for this event.' };
  }
  const events = getEvents();
  const index = events.findIndex(e => e.id === Number(eventId));
  if (index === -1) return { success: false, message: 'Event not found.' };
  if (events[index].attendees >= events[index].maxAttendees) {
    return { success: false, message: 'This event is fully booked.' };
  }
  // Create booking
  const booking = {
    id: Date.now(),
    eventId: Number(eventId),
    userId: userInfo.userId,
    fullName: userInfo.fullName,
    email: userInfo.email,
    phone: userInfo.phone,
    bookedAt: new Date().toISOString(),
  };
  bookings.push(booking);
  saveToStorage(STORAGE_KEYS.EVENT_BOOKINGS, bookings);
  // Increment attendee count
  events[index].attendees += 1;
  saveToStorage(STORAGE_KEYS.EVENTS, events);
  return { success: true, booking, event: events[index] };
}

export function hasBookedEvent(eventId, userId) {
  const bookings = getFromStorage(STORAGE_KEYS.EVENT_BOOKINGS, []);
  return bookings.some(b => b.eventId === Number(eventId) && b.userId === userId);
}

export function getEventBookings(userId) {
  const bookings = getFromStorage(STORAGE_KEYS.EVENT_BOOKINGS, []);
  if (userId) return bookings.filter(b => b.userId === userId);
  return bookings;
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

export function bookMentorship(mentorshipId, userInfo) {
  const bookings = getFromStorage(STORAGE_KEYS.MENTORSHIP_BOOKINGS, []);
  // Check if user already booked this mentorship
  if (bookings.find(b => b.mentorshipId === Number(mentorshipId) && b.userId === userInfo.userId)) {
    return { success: false, message: 'You have already booked this mentorship.' };
  }
  const mentorships = getMentorships();
  const index = mentorships.findIndex(m => m.id === Number(mentorshipId));
  if (index === -1) return { success: false, message: 'Mentorship not found.' };
  if (mentorships[index].status !== 'Open') {
    return { success: false, message: 'This mentorship is no longer available.' };
  }
  // Create booking
  const booking = {
    id: Date.now(),
    mentorshipId: Number(mentorshipId),
    userId: userInfo.userId,
    fullName: userInfo.fullName,
    email: userInfo.email,
    phone: userInfo.phone,
    month: userInfo.month,
    paymentMode: userInfo.paymentMode,
    amount: 299,
    bookedAt: new Date().toISOString(),
  };
  bookings.push(booking);
  saveToStorage(STORAGE_KEYS.MENTORSHIP_BOOKINGS, bookings);
  // Update mentorship status
  mentorships[index].menteeName = userInfo.fullName;
  mentorships[index].status = 'Active';
  mentorships[index].startDate = new Date().toISOString().split('T')[0];
  saveToStorage(STORAGE_KEYS.MENTORSHIP, mentorships);
  return { success: true, booking, mentorship: mentorships[index] };
}

export function hasBookedMentorship(mentorshipId, userId) {
  const bookings = getFromStorage(STORAGE_KEYS.MENTORSHIP_BOOKINGS, []);
  return bookings.some(b => b.mentorshipId === Number(mentorshipId) && b.userId === userId);
}

export function getMentorshipBookings(userId) {
  const bookings = getFromStorage(STORAGE_KEYS.MENTORSHIP_BOOKINGS, []);
  if (userId) return bookings.filter(b => b.userId === userId);
  return bookings;
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
