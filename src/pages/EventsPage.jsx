import { useState, useEffect } from 'react';
import { getEvents, addEvent, deleteEvent, rsvpEvent, getCurrentUser } from '../data/store';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  const [form, setForm] = useState({
    title: '', date: '', time: '', location: '', description: '', type: 'Reunion', organizer: '', maxAttendees: 100,
  });

  const reload = () => setEvents(getEvents());
  useEffect(() => { reload(); }, []);

  const eventTypes = ['Reunion', 'Cultural', 'Seminar', 'Career', 'Networking', 'Workshop'];

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent({ ...form, maxAttendees: Number(form.maxAttendees) });
    setShowModal(false);
    setForm({ title: '', date: '', time: '', location: '', description: '', type: 'Reunion', organizer: '', maxAttendees: 100 });
    reload();
  };

  const handleRSVP = (id) => {
    rsvpEvent(id);
    reload();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this event?')) {
      deleteEvent(id);
      reload();
    }
  };

  const colorCycle = ['blue', 'purple', 'green', 'orange', 'teal', 'red'];
  const isPast = (dateStr) => new Date(dateStr) < new Date();

  const getMonthDay = (dateStr) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      day: d.getDate(),
      year: d.getFullYear(),
    };
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📅 Events</h1>
          <p className="page-subtitle">Stay connected through alumni events and gatherings</p>
        </div>
        {isAdmin && <button className="btn-primary" onClick={() => setShowModal(true)}>+ Create Event</button>}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          className="table-search"
          placeholder="🔍 Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '280px' }}
        />
        <div className="filter-tabs">
          <button className={`filter-tab ${typeFilter === '' ? 'active' : ''}`} onClick={() => setTypeFilter('')}>All</button>
          {eventTypes.map(t => (
            <button key={t} className={`filter-tab ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="cards-grid">
          {filteredEvents.map((event, i) => {
            const { month, day, year } = getMonthDay(event.date);
            const past = isPast(event.date);
            const attendPercent = Math.round((event.attendees / event.maxAttendees) * 100);
            return (
              <div className="card animate-in" key={event.id} style={{ animationDelay: `${i * 0.05}s`, opacity: past ? 0.65 : 1 }}>
                <div className={`card-banner ${colorCycle[i % colorCycle.length]}`} />
                <div className="card-body">
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div className="event-date-badge" style={{ margin: 0 }}>
                      <div className="month">{month}</div>
                      <div className="day">{day}</div>
                    </div>
                    <div>
                      <h4 style={{ marginBottom: '4px' }}>{event.title}</h4>
                      <div className="card-meta" style={{ marginBottom: 0 }}>
                        <span className={`badge badge-${colorCycle[i % colorCycle.length]}`}>{event.type}</span>
                        {past && <span className="badge badge-red">Past</span>}
                      </div>
                    </div>
                  </div>
                  <p>{event.description}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    <span>📍 {event.location}</span>
                    <span>🕐 {event.time}</span>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>{event.attendees} / {event.maxAttendees} attending</span>
                      <span>{attendPercent}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${attendPercent}%` }} />
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    By {event.organizer}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {!past && (
                      <button className="btn-primary btn-small" onClick={() => handleRSVP(event.id)}>RSVP</button>
                    )}
                    {isAdmin && (
                      <button className="btn-danger btn-small" onClick={() => handleDelete(event.id)}>Delete</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No events found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="profile-form-grid">
                <div className="form-group full-width">
                  <label>Event Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input placeholder="e.g. 10:00 AM" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Organizer</label>
                  <input value={form.organizer} onChange={e => setForm({...form, organizer: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Max Attendees</label>
                  <input type="number" value={form.maxAttendees} onChange={e => setForm({...form, maxAttendees: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
