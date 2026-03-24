import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import AlumniDashboard from './pages/AlumniDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageAlumni from './pages/ManageAlumni';
import JobBoard from './pages/JobBoard';
import EventsPage from './pages/EventsPage';
import MentorshipPage from './pages/MentorshipPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Alumni Routes */}
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<AlumniDashboard />} />
          <Route path="jobs" element={<JobBoard />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="mentorship" element={<MentorshipPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AppLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="alumni" element={<ManageAlumni />} />
          <Route path="jobs" element={<JobBoard />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="mentorship" element={<MentorshipPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
