import { useState, useEffect } from 'react';
import { getMentorships, bookMentorship, hasBookedMentorship, getCurrentUser } from '../data/store';

export default function MentorshipPage() {
  const [mentorships, setMentorships] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [booked, setBooked] = useState(false);
  const user = getCurrentUser();

  const [bookingForm, setBookingForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    month: '',
    paymentMode: '',
  });

  const reload = () => setMentorships(getMentorships());
  useEffect(() => { reload(); }, []);

  const filteredMentorships = mentorships.filter(m => {
    if (!filter) return true;
    return m.status === filter;
  });

  const openBookingModal = (mentorship) => {
    setSelectedMentorship(mentorship);
    setShowBookingModal(true);
    setBooked(false);
    setBookingForm({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      month: '',
      paymentMode: '',
    });
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedMentorship(null);
    setBooked(false);
  };

  const handleBookMentorship = (e) => {
    e.preventDefault();
    const result = bookMentorship(selectedMentorship.id, {
      userId: user?.id,
      fullName: bookingForm.fullName,
      email: bookingForm.email,
      phone: bookingForm.phone,
      month: bookingForm.month,
      paymentMode: bookingForm.paymentMode,
    });
    if (result.success) {
      setBooked(true);
      reload();
    } else {
      alert(result.message);
    }
  };

  const colorMap = {
    'Open': 'green',
    'Active': 'blue',
    'Completed': 'gray',
  };

  // Generate next 6 months for the month picker
  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      months.push(label);
    }
    return months;
  };

  const paymentModes = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'];

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🤝 Mentorship</h1>
          <p className="page-subtitle">Connect with experienced alumni mentors and book your sessions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-tabs" style={{ marginBottom: '20px' }}>
        <button className={`filter-tab ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
        <button className={`filter-tab ${filter === 'Open' ? 'active' : ''}`} onClick={() => setFilter('Open')}>
          🟢 Open
        </button>
        <button className={`filter-tab ${filter === 'Active' ? 'active' : ''}`} onClick={() => setFilter('Active')}>
          🔵 Active
        </button>
      </div>

      {/* Mentorship Cards */}
      {filteredMentorships.length > 0 ? (
        <div className="cards-grid">
          {filteredMentorships.map((m, i) => {
            const alreadyBooked = user ? hasBookedMentorship(m.id, user.id) : false;
            return (
              <div className="card animate-in" key={m.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`card-banner ${colorMap[m.status] || 'blue'}`} />
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4>{m.topic}</h4>
                    <span className={`badge badge-${colorMap[m.status] || 'gray'}`}>{m.status}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>👨‍🏫 <strong>Mentor:</strong> {m.mentorName}</span>
                    {m.menteeName && <span>👩‍🎓 <strong>Mentee:</strong> {m.menteeName}</span>}
                    {m.startDate && <span>📅 <strong>Started:</strong> {m.startDate}</span>}
                  </div>
                  {m.notes && (
                    <p style={{ marginTop: '10px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      "{m.notes}"
                    </p>
                  )}
                  {/* Price tag */}
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-orange" style={{ fontSize: '0.82rem', padding: '5px 12px', fontWeight: 700 }}>
                      💰 ₹299
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>per month</span>
                  </div>
                </div>
                {m.status === 'Open' && (
                  <div className="card-footer">
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Available for mentorship</span>
                    {alreadyBooked ? (
                      <span className="badge badge-green" style={{ fontWeight: 600, padding: '6px 14px', fontSize: '0.82rem' }}>✅ Booked</span>
                    ) : (
                      <button className="btn-apply" onClick={() => openBookingModal(m)}>
                        📖 Book Mentorship
                      </button>
                    )}
                  </div>
                )}
                {m.status === 'Active' && (
                  <div className="card-footer">
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)' }}>✅ Mentorship in progress</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🤝</div>
          <h3>No mentorships found</h3>
          <p>Try adjusting your filters.</p>
        </div>
      )}

      {/* Book Mentorship Detail Modal */}
      {showBookingModal && selectedMentorship && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            {!booked ? (
              <>
                {/* Mentorship Details Section */}
                <div className="job-detail-header">
                  <div className="job-detail-title-row">
                    <div>
                      <h2 style={{ margin: 0 }}>{selectedMentorship.topic}</h2>
                      <p className="job-detail-company">Mentor: {selectedMentorship.mentorName}</p>
                    </div>
                    <button className="modal-close-btn" onClick={closeBookingModal}>✕</button>
                  </div>
                  <div className="card-meta" style={{ marginTop: '12px' }}>
                    <span className="badge badge-green">Open</span>
                    <span className="badge badge-orange" style={{ fontSize: '0.85rem', padding: '5px 14px', fontWeight: 700 }}>💰 ₹299 / month</span>
                  </div>
                </div>

                <div className="job-detail-body">
                  <div className="job-detail-section">
                    <h4>📋 Mentorship Details</h4>
                    <p>{selectedMentorship.notes || 'Connect with an experienced mentor for personalized guidance and knowledge sharing in this domain.'}</p>
                  </div>

                  <div className="job-detail-section">
                    <h4>ℹ️ Mentor Information</h4>
                    <div className="job-detail-info-grid">
                      <div><span className="job-info-label">Mentor Name</span><span>{selectedMentorship.mentorName}</span></div>
                      <div><span className="job-info-label">Topic</span><span>{selectedMentorship.topic}</span></div>
                      <div><span className="job-info-label">Status</span><span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Available</span></div>
                      <div>
                        <span className="job-info-label">Fee</span>
                        <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>₹299 / month</span>
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '20px 0' }} />

                  {/* Booking Form */}
                  <div className="job-detail-section">
                    <h4>📖 Book Your Mentorship</h4>
                    <form onSubmit={handleBookMentorship}>
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
                          <label>Mentorship Month</label>
                          <select
                            value={bookingForm.month}
                            onChange={e => setBookingForm({...bookingForm, month: e.target.value})}
                            required
                          >
                            <option value="">Select Month</option>
                            {getMonthOptions().map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Payment Mode</label>
                          <select
                            value={bookingForm.paymentMode}
                            onChange={e => setBookingForm({...bookingForm, paymentMode: e.target.value})}
                            required
                          >
                            <option value="">Select Payment Mode</option>
                            {paymentModes.map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Amount</label>
                          <input type="text" value="₹299" disabled style={{ opacity: 0.7, cursor: 'not-allowed', fontWeight: 700, fontSize: '1.05rem' }} />
                          <small style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            Fixed pricing per month
                          </small>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div style={{
                        background: 'var(--gray-50)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px 20px',
                        marginTop: '8px',
                        marginBottom: '8px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mentorship Fee</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>₹299.00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Duration</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>1 Month</span>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px dashed var(--border-light)', margin: '10px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)' }}>Total</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)' }}>₹299.00</span>
                        </div>
                      </div>

                      <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={closeBookingModal}>Cancel</button>
                        <button type="submit" className="btn-primary btn-apply-submit">💳 Pay & Book Mentorship</button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="apply-success">
                <div className="apply-success-icon">🎉</div>
                <h2>Mentorship Booked Successfully!</h2>
                <p>Your mentorship session with <strong>{selectedMentorship.mentorName}</strong> has been booked and payment received.</p>
                <div className="apply-success-details">
                  <div><span>📖</span> Topic: <strong>{selectedMentorship.topic}</strong></div>
                  <div><span>👨‍🏫</span> Mentor: <strong>{selectedMentorship.mentorName}</strong></div>
                  <div><span>📅</span> Month: <strong>{bookingForm.month}</strong></div>
                  <div><span>💳</span> Payment: <strong>{bookingForm.paymentMode}</strong></div>
                  <div><span>💰</span> Amount Paid: <strong>₹299.00</strong></div>
                  <div><span>📧</span> Confirmation sent to <strong>{bookingForm.email}</strong></div>
                </div>
                <button className="btn-primary" onClick={closeBookingModal} style={{ marginTop: '20px' }}>
                  ← Back to Mentorships
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
