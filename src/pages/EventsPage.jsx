import { useState, useEffect } from 'react';
import { getEvents, addEvent, deleteEvent, bookEventTicket, hasBookedEvent, getCurrentUser } from '../data/store';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [booked, setBooked] = useState(false);
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  const [form, setForm] = useState({
    title: '', date: '', time: '', location: '', description: '', type: 'Reunion', organizer: '', maxAttendees: 100,
  });

  const [bookingForm, setBookingForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
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

  const openBookingModal = (event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
    setBooked(false);
    setBookingForm({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
    });
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedEvent(null);
    setBooked(false);
  };

  const handleBookTicket = (e) => {
    e.preventDefault();
    const result = bookEventTicket(selectedEvent.id, {
      userId: user?.id,
      fullName: bookingForm.fullName,
      email: bookingForm.email,
      phone: bookingForm.phone,
    });
    if (result.success) {
      setBooked(true);
      reload();
    } else {
      alert(result.message);
    }
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

  const getFullDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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
            const { month, day } = getMonthDay(event.date);
            const past = isPast(event.date);
            const attendPercent = Math.round((event.attendees / event.maxAttendees) * 100);
            const alreadyBooked = user ? hasBookedEvent(event.id, user.id) : false;
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
                      alreadyBooked ? (
                        <span className="badge badge-green" style={{ fontWeight: 600, padding: '6px 14px', fontSize: '0.82rem' }}>🎫 Booked</span>
                      ) : (
                        <button className="btn-apply" onClick={() => openBookingModal(event)}>
                          🎫 Book Ticket
                        </button>
                      )
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

      {/* Create Event Modal (Admin) */}
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

      {/* Event Detail & Book Ticket Modal */}
      {showBookingModal && selectedEvent && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            {!booked ? (
              <>
                {/* Event Details Section */}
                <div className="job-detail-header">
                  <div className="job-detail-title-row">
                    <div>
                      <h2 style={{ margin: 0 }}>{selectedEvent.title}</h2>
                      <p className="job-detail-company">{selectedEvent.type} · By {selectedEvent.organizer}</p>
                    </div>
                    <button className="modal-close-btn" onClick={closeBookingModal}>✕</button>
                  </div>
                  <div className="card-meta" style={{ marginTop: '12px' }}>
                    <span className="badge badge-blue">📅 {getFullDate(selectedEvent.date)}</span>
                    <span className="badge badge-purple">🕐 {selectedEvent.time}</span>
                    <span className="badge badge-teal">📍 {selectedEvent.location}</span>
                  </div>
                </div>

                <div className="job-detail-body">
                  <div className="job-detail-section">
                    <h4>📋 Event Description</h4>
                    <p>{selectedEvent.description}</p>
                  </div>

                  <div className="job-detail-section">
                    <h4>ℹ️ Event Details</h4>
                    <div className="job-detail-info-grid">
                      <div><span className="job-info-label">Organizer</span><span>{selectedEvent.organizer}</span></div>
                      <div><span className="job-info-label">Date</span><span>{getFullDate(selectedEvent.date)}</span></div>
                      <div><span className="job-info-label">Time</span><span>{selectedEvent.time}</span></div>
                      <div><span className="job-info-label">Venue</span><span>{selectedEvent.location}</span></div>
                      <div><span className="job-info-label">Seats Booked</span><span>{selectedEvent.attendees} / {selectedEvent.maxAttendees}</span></div>
                      <div>
                        <span className="job-info-label">Availability</span>
                        <span style={{ color: selectedEvent.attendees >= selectedEvent.maxAttendees ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 700 }}>
                          {selectedEvent.attendees >= selectedEvent.maxAttendees ? 'Fully Booked' : `${selectedEvent.maxAttendees - selectedEvent.attendees} seats left`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '20px 0' }} />

                  {/* Booking Form */}
                  <div className="job-detail-section">
                    <h4>🎫 Book Your Ticket</h4>
                    <form onSubmit={handleBookTicket}>
                      <div className="profile-form-grid">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            value={bookingForm.fullName}
                            onChange={e => setBookingForm({...bookingForm, fullName: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            value={bookingForm.email}
                            onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            placeholder="+91 XXXXXXXXXX"
                            value={bookingForm.phone}
                            onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>No. of Tickets</label>
                          <input type="text" value="1" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                          <small style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            Limited to 1 ticket per student
                          </small>
                        </div>
                      </div>
                      <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={closeBookingModal}>Cancel</button>
                        <button type="submit" className="btn-primary btn-apply-submit">🎫 Confirm Booking</button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="apply-success">
                <div className="apply-success-icon">🎉</div>
                <h2>Ticket Booked Successfully!</h2>
                <p>Your ticket for <strong>{selectedEvent.title}</strong> has been booked successfully.</p>
                <div className="apply-success-details">
                  <div><span>📅</span> {getFullDate(selectedEvent.date)} at {selectedEvent.time}</div>
                  <div><span>📍</span> {selectedEvent.location}</div>
                  <div><span>📧</span> Confirmation sent to <strong>{bookingForm.email}</strong></div>
                  <div><span>🎫</span> Ticket: <strong>1 × {selectedEvent.title}</strong></div>
                </div>
                <button className="btn-primary" onClick={closeBookingModal} style={{ marginTop: '20px' }}>
                  ← Back to Events
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
