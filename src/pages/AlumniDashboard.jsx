import { useState, useEffect } from 'react';
import { getStats, getJobs, getEvents, getCurrentUser } from '../data/store';

export default function AlumniDashboard() {
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    setStats(getStats());
    setJobs(getJobs().slice(0, 4));
    setEvents(getEvents().filter(e => new Date(e.date) > new Date()).slice(0, 4));
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getMonthDay = (dateStr) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      day: d.getDate(),
    };
  };

  return (
    <div className="animate-in">
      <h1 className="page-title">Welcome, {user?.name || 'Alumni'} 👋</h1>
      <p className="page-subtitle">Here's what's happening in your alumni network</p>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card green animate-in stagger-1">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalAlumni || 0}</h3>
            <p>Total Alumni</p>
          </div>
        </div>
        <div className="stat-card blue animate-in stagger-2">
          <div className="stat-icon">🤝</div>
          <div className="stat-info">
            <h3>{stats.activeMentorships || 0}</h3>
            <p>Active Mentorships</p>
          </div>
        </div>
        <div className="stat-card orange animate-in stagger-3">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.upcomingEvents || 0}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>
        <div className="stat-card purple animate-in stagger-4">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <h3>{stats.totalJobs || 0}</h3>
            <p>Job Postings</p>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Recent Job Postings */}
        <div className="dashboard-card animate-in">
          <h3>💼 Recent Job Postings</h3>
          {jobs.length > 0 ? (
            jobs.map(job => (
              <div className="job-item" key={job.id}>
                <div className="job-dot" />
                <div className="job-info">
                  <h4>{job.title}</h4>
                  <p>{job.company} · {job.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No job postings yet</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-card animate-in">
          <h3>📅 Upcoming Events</h3>
          {events.length > 0 ? (
            events.map(event => {
              const { month, day } = getMonthDay(event.date);
              return (
                <div className="event-item" key={event.id}>
                  <div className="event-date-badge">
                    <div className="month">{month}</div>
                    <div className="day">{day}</div>
                  </div>
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <p>{event.location} · {event.time}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
}
