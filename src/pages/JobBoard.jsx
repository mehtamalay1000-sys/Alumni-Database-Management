import { useState, useEffect } from 'react';
import { getJobs, addJob, deleteJob, getCurrentUser } from '../data/store';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applied, setApplied] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', deadline: '',
  });

  const [applyForm, setApplyForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    coverLetter: '',
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
    setShowPostModal(false);
    setForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', deadline: '' });
    reload();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this job posting?')) {
      deleteJob(id);
      reload();
    }
  };

  const openJobDetail = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
    setApplied(false);
    setResumeFile(null);
    setApplyForm({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      coverLetter: '',
    });
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please upload your resume before applying.');
      return;
    }
    // Save applied state
    setAppliedJobs(prev => [...prev, selectedJob.id]);
    setApplied(true);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  const closeApplyModal = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
    setApplied(false);
    setResumeFile(null);
  };

  const colorCycle = ['green', 'blue', 'purple', 'orange', 'teal'];

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">💼 Job Board</h1>
          <p className="page-subtitle">Discover opportunities shared by fellow alumni</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowPostModal(true)}>+ Post a Job</button>
        )}
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
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {isAdmin ? (
                    <button className="btn-danger btn-small" onClick={() => handleDelete(job.id)}>Delete</button>
                  ) : (
                    appliedJobs.includes(job.id) ? (
                      <span className="badge badge-green" style={{ fontWeight: 600, padding: '6px 14px', fontSize: '0.82rem' }}>✅ Applied</span>
                    ) : (
                      <button className="btn-apply" onClick={() => openJobDetail(job)}>
                        Apply Now →
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Post Job Modal (Admin Only) */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
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
                <button type="button" className="btn-secondary" onClick={() => setShowPostModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Detail & Apply Modal (Student/Alumni) */}
      {showApplyModal && selectedJob && (
        <div className="modal-overlay" onClick={closeApplyModal}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            {!applied ? (
              <>
                {/* Job Details Section */}
                <div className="job-detail-header">
                  <div className="job-detail-title-row">
                    <div>
                      <h2 style={{ margin: 0 }}>{selectedJob.title}</h2>
                      <p className="job-detail-company">{selectedJob.company} · {selectedJob.location}</p>
                    </div>
                    <button className="modal-close-btn" onClick={closeApplyModal}>✕</button>
                  </div>
                  <div className="card-meta" style={{ marginTop: '12px' }}>
                    <span className="badge badge-blue">{selectedJob.type}</span>
                    {selectedJob.salary && <span className="badge badge-green">{selectedJob.salary}</span>}
                    {selectedJob.deadline && <span className="badge badge-orange">Deadline: {selectedJob.deadline}</span>}
                  </div>
                </div>

                <div className="job-detail-body">
                  <div className="job-detail-section">
                    <h4>📋 Job Description</h4>
                    <p>{selectedJob.description}</p>
                  </div>

                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <div className="job-detail-section">
                      <h4>🛠️ Required Skills</h4>
                      <div className="card-meta">
                        {selectedJob.skills.map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                      </div>
                    </div>
                  )}

                  <div className="job-detail-section">
                    <h4>ℹ️ Additional Info</h4>
                    <div className="job-detail-info-grid">
                      <div><span className="job-info-label">Posted By</span><span>{selectedJob.postedBy}</span></div>
                      <div><span className="job-info-label">Posted On</span><span>{selectedJob.postedDate}</span></div>
                      {selectedJob.deadline && <div><span className="job-info-label">Apply By</span><span>{selectedJob.deadline}</span></div>}
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />

                  {/* Application Form */}
                  <div className="job-detail-section">
                    <h4>📝 Your Application</h4>
                    <form onSubmit={handleApply}>
                      <div className="profile-form-grid">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            value={applyForm.fullName}
                            onChange={e => setApplyForm({...applyForm, fullName: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            value={applyForm.email}
                            onChange={e => setApplyForm({...applyForm, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="tel"
                            placeholder="+91 XXXXXXXXXX"
                            value={applyForm.phone}
                            onChange={e => setApplyForm({...applyForm, phone: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Resume / CV *</label>
                          <div className="resume-upload-area">
                            <input
                              type="file"
                              id="resume-upload"
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeChange}
                              style={{ display: 'none' }}
                            />
                            <label htmlFor="resume-upload" className="resume-upload-label">
                              {resumeFile ? (
                                <span className="resume-file-info">
                                  <span className="resume-file-icon">📄</span>
                                  <span>
                                    <strong>{resumeFile.name}</strong>
                                    <small>{(resumeFile.size / 1024).toFixed(1)} KB</small>
                                  </span>
                                </span>
                              ) : (
                                <span className="resume-placeholder">
                                  <span style={{ fontSize: '1.5rem' }}>📎</span>
                                  <span>Click to upload resume</span>
                                  <small>PDF, DOC, DOCX · Max 5MB</small>
                                </span>
                              )}
                            </label>
                          </div>
                        </div>
                        <div className="form-group full-width">
                          <label>Cover Letter (Optional)</label>
                          <textarea
                            rows="3"
                            placeholder="Tell the employer why you're a great fit for this role..."
                            value={applyForm.coverLetter}
                            onChange={e => setApplyForm({...applyForm, coverLetter: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={closeApplyModal}>Cancel</button>
                        <button type="submit" className="btn-primary btn-apply-submit">🚀 Submit Application</button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="apply-success">
                <div className="apply-success-icon">🎉</div>
                <h2>Application Submitted!</h2>
                <p>Your application for <strong>{selectedJob.title}</strong> at <strong>{selectedJob.company}</strong> has been submitted successfully.</p>
                <div className="apply-success-details">
                  <div><span>📧</span> A confirmation will be sent to <strong>{applyForm.email}</strong></div>
                  <div><span>📄</span> Resume: <strong>{resumeFile?.name}</strong></div>
                </div>
                <button className="btn-primary" onClick={closeApplyModal} style={{ marginTop: '20px' }}>
                  ← Back to Job Board
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
