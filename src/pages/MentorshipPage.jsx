import { useState, useEffect } from 'react';
import { getMentorships, addMentorship, requestMentorship, getCurrentUser } from '../data/store';

export default function MentorshipPage() {
  const [mentorships, setMentorships] = useState([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const user = getCurrentUser();

  const [form, setForm] = useState({
    mentorName: '', topic: '', notes: '',
  });

  const reload = () => setMentorships(getMentorships());
  useEffect(() => { reload(); }, []);

  const filteredMentorships = mentorships.filter(m => {
    if (!filter) return true;
    return m.status === filter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMentorship({
      mentorId: Date.now(),
      mentorName: form.mentorName || user?.name || 'Anonymous',
      menteeId: null,
      menteeName: null,
      topic: form.topic,
      status: 'Open',
      startDate: null,
      notes: form.notes,
    });
    setShowModal(false);
    setForm({ mentorName: '', topic: '', notes: '' });
    reload();
  };

  const handleRequest = (id) => {
    requestMentorship(id, user?.name || 'Anonymous');
    reload();
  };

  const colorMap = {
    'Open': 'green',
    'Active': 'blue',
    'Completed': 'gray',
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🤝 Mentorship</h1>
          <p className="page-subtitle">Connect with experienced alumni mentors or offer your guidance</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Offer Mentorship</button>
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
          {filteredMentorships.map((m, i) => (
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
              </div>
              {m.status === 'Open' && (
                <div className="card-footer">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Available for mentorship</span>
                  <button className="btn-primary btn-small" onClick={() => handleRequest(m.id)}>
                    Request Mentorship
                  </button>
                </div>
              )}
              {m.status === 'Active' && (
                <div className="card-footer">
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)' }}>✅ Mentorship in progress</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🤝</div>
          <h3>No mentorships found</h3>
          <p>Be the first to offer mentorship or adjust your filters.</p>
        </div>
      )}

      {/* Offer Mentorship Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Offer Mentorship</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input value={form.mentorName} onChange={e => setForm({...form, mentorName: e.target.value})} placeholder={user?.name || ''} />
                </div>
                <div className="form-group">
                  <label>Topic / Area of Expertise</label>
                  <input value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} required placeholder="e.g. Machine Learning, Product Management" />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Brief description of what you can help with..." />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Offer Mentorship</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
