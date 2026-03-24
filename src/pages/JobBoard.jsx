import { useState, useEffect } from 'react';
import { getJobs, addJob, deleteJob, getCurrentUser } from '../data/store';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', deadline: '',
  });

  const reload = () => setJobs(getJobs());
  useEffect(() => { reload(); }, []);

  const types = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || j.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addJob({ ...form, postedBy: user?.name || 'Anonymous', skills: [] });
    setShowModal(false);
    setForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', deadline: '' });
    reload();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this job posting?')) {
      deleteJob(id);
      reload();
    }
  };

  const colorCycle = ['green', 'blue', 'purple', 'orange', 'teal'];

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">💼 Job Board</h1>
          <p className="page-subtitle">Discover opportunities shared by fellow alumni</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Post a Job</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          className="table-search"
          placeholder="🔍 Search jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '280px' }}
        />
        <div className="filter-tabs">
          <button className={`filter-tab ${typeFilter === '' ? 'active' : ''}`} onClick={() => setTypeFilter('')}>All</button>
          {types.map(t => (
            <button key={t} className={`filter-tab ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="cards-grid">
          {filteredJobs.map((job, i) => (
            <div className="card animate-in" key={job.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`card-banner ${colorCycle[i % colorCycle.length]}`} />
              <div className="card-body">
                <h4>{job.title}</h4>
                <p style={{ marginBottom: '8px' }}>{job.company} · {job.location}</p>
                <div className="card-meta">
                  <span className="badge badge-blue">{job.type}</span>
                  {job.salary && <span className="badge badge-green">{job.salary}</span>}
                </div>
                <p>{job.description}</p>
                {job.skills && job.skills.length > 0 && (
                  <div className="card-meta" style={{ marginTop: '8px' }}>
                    {job.skills.map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                  </div>
                )}
              </div>
              <div className="card-footer">
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Posted by {job.postedBy} · {job.postedDate}
                </span>
                {isAdmin && (
                  <button className="btn-danger btn-small" onClick={() => handleDelete(job.id)}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters, or post a new job opportunity.</p>
        </div>
      )}

      {/* Post Job Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Post a New Job</h2>
            <form onSubmit={handleSubmit}>
              <div className="profile-form-grid">
                <div className="form-group">
                  <label>Job Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input placeholder="e.g. ₹10-15 LPA" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
