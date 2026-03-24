import { useState, useEffect } from 'react';
import { getStats, getAlumni, addAlumni, updateAlumni, deleteAlumni } from '../data/store';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [form, setForm] = useState({
    name: '', batch: '', email: '', jobTitle: '', company: '', phone: '', department: '', linkedin: '', bio: '',
  });

  const reload = () => {
    setStats(getStats());
    setAlumni(getAlumni());
  };

  useEffect(() => { reload(); }, []);

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.jobTitle || '').toLowerCase().includes(search.toLowerCase());
    const matchesBatch = !batchFilter || a.batch === batchFilter;
    return matchesSearch && matchesBatch;
  });

  const batches = [...new Set(alumni.map(a => a.batch).filter(Boolean))].sort();

  const openAddModal = () => {
    setEditingAlumni(null);
    setForm({ name: '', batch: '', email: '', jobTitle: '', company: '', phone: '', department: '', linkedin: '', bio: '' });
    setShowModal(true);
  };

  const openEditModal = (alum) => {
    setEditingAlumni(alum);
    setForm({
      name: alum.name, batch: alum.batch, email: alum.email,
      jobTitle: alum.jobTitle || '', company: alum.company || '',
      phone: alum.phone || '', department: alum.department || '',
      linkedin: alum.linkedin || '', bio: alum.bio || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAlumni) {
      updateAlumni(editingAlumni.id, form);
    } else {
      addAlumni({ ...form, skills: [], avatar: '' });
    }
    setShowModal(false);
    reload();
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this alumni record?')) {
      deleteAlumni(id);
      reload();
    }
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="animate-in">
      <h1 className="page-title">Admin Dashboard</h1>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card green animate-in stagger-1">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalAlumni || 0}</h3>
            <p>Alumni Records</p>
          </div>
        </div>
        <div className="stat-card orange animate-in stagger-2">
          <div className="stat-icon">🤝</div>
          <div className="stat-info">
            <h3>{stats.mentorshipRequests || 0}</h3>
            <p>Mentorship Requests</p>
          </div>
        </div>
        <div className="stat-card blue animate-in stagger-3">
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

      {/* Alumni Table */}
      <div className="table-wrapper animate-in">
        <div className="table-header">
          <h3>Manage Alumni</h3>
          <div className="table-actions">
            <input
              className="table-search"
              placeholder="🔍 Search alumni..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="table-filter" value={batchFilter} onChange={e => setBatchFilter(e.target.value)}>
              <option value="">All Batches</option>
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <button className="btn-primary btn-small" onClick={openAddModal}>+ Add Alumni</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Batch</th>
              <th>Email</th>
              <th>Job Title</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map(alum => (
                <tr key={alum.id}>
                  <td>
                    <div className="table-avatar">
                      <div className="table-avatar-circle">{getInitials(alum.name)}</div>
                      <div>
                        <div className="table-name">{alum.name}</div>
                        <div className="table-sub">{alum.company || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{alum.batch || 'N/A'}</span></td>
                  <td>{alum.email}</td>
                  <td>{alum.jobTitle || 'N/A'}</td>
                  <td>{alum.department || 'N/A'}</td>
                  <td>
                    <div className="table-actions-cell">
                      <button className="btn-success btn-small" onClick={() => openEditModal(alum)}>Edit</button>
                      <button className="btn-danger btn-small" onClick={() => handleDelete(alum.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="table-empty">No alumni records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingAlumni ? 'Edit Alumni' : 'Add New Alumni'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="profile-form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Batch</label>
                  <input placeholder="e.g. Batch 2020" value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea rows="3" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingAlumni ? 'Update' : 'Add Alumni'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
