import { useState, useEffect } from 'react';
import { getAlumni, addAlumni, updateAlumni, deleteAlumni } from '../data/store';

export default function ManageAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', batch:'', email:'', jobTitle:'', company:'', phone:'', department:'', linkedin:'', bio:'', package:'', collegeId:'' });

  const reload = () => setAlumni(getAlumni());
  useEffect(() => { reload(); }, []);

  const batches = [...new Set(alumni.map(a => a.batch).filter(Boolean))].sort();
  const depts = [...new Set(alumni.map(a => a.department).filter(Boolean))].sort();

  const filtered = alumni.filter(a => {
    const s = search.toLowerCase();
    const m1 = a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s) || (a.jobTitle||'').toLowerCase().includes(s) || (a.company||'').toLowerCase().includes(s) || (a.collegeId||'').toLowerCase().includes(s);
    const m2 = !batchFilter || a.batch === batchFilter;
    const m3 = !deptFilter || a.department === deptFilter;
    return m1 && m2 && m3;
  });

  const openAdd = () => { setEditing(null); setForm({ name:'', batch:'', email:'', jobTitle:'', company:'', phone:'', department:'', linkedin:'', bio:'', package:'', collegeId:'' }); setShowModal(true); };
  const openEdit = (a) => { setEditing(a); setForm({ name:a.name, batch:a.batch, email:a.email, jobTitle:a.jobTitle||'', company:a.company||'', phone:a.phone||'', department:a.department||'', linkedin:a.linkedin||'', bio:a.bio||'', package:a.package||'', collegeId:a.collegeId||'' }); setShowModal(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) updateAlumni(editing.id, form);
    else addAlumni({ ...form, skills: [], avatar: '' });
    setShowModal(false); reload();
  };

  const handleDelete = (id) => { if(confirm('Delete this alumni?')) { deleteAlumni(id); reload(); } };
  const getInitials = (n) => n.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">👥 Manage Alumni — Batch 2024-25</h1>
        <button className="btn-primary" onClick={openAdd}>+ Add Alumni</button>
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <h3>{filtered.length} Alumni Records</h3>
          <div className="table-actions">
            <input className="table-search" placeholder="🔍 Search name, company, ID..." value={search} onChange={e=>setSearch(e.target.value)} />
            <select className="table-filter" value={batchFilter} onChange={e=>setBatchFilter(e.target.value)}>
              <option value="">All Batches</option>
              {batches.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
            <select className="table-filter" value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
              <option value="">All Depts</option>
              {depts.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <table>
          <thead><tr><th>Name</th><th>College ID</th><th>Designation</th><th>Company</th><th>Package</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(a=>(
              <tr key={a.id}>
                <td><div className="table-avatar"><div className="table-avatar-circle">{getInitials(a.name)}</div><div><div className="table-name">{a.name}</div><div className="table-sub">{a.department||'N/A'}</div></div></div></td>
                <td><span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{a.collegeId||'N/A'}</span></td>
                <td>{a.jobTitle||'N/A'}</td>
                <td><span className="badge badge-blue">{a.company||'N/A'}</span></td>
                <td>
                  <span style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: '16px', fontSize: '0.82rem', fontWeight: 700,
                    background: parseFloat(a.package) >= 8 ? 'linear-gradient(135deg, #10b981, #059669)' :
                                parseFloat(a.package) >= 5 ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
                                'var(--gray-100)',
                    color: parseFloat(a.package) >= 5 ? '#fff' : 'var(--gray-700)',
                  }}>
                    {a.package ? `₹${a.package}` : 'N/A'}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.phone||'N/A'}</td>
                <td><div className="table-actions-cell"><button className="btn-success btn-small" onClick={()=>openEdit(a)}>Edit</button><button className="btn-danger btn-small" onClick={()=>handleDelete(a.id)}>Delete</button></div></td>
              </tr>
            )) : <tr><td colSpan="7" className="table-empty">No records found</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h2>{editing ? 'Edit Alumni' : 'Add Alumni'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="profile-form-grid">
                <div className="form-group"><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                <div className="form-group"><label>College ID</label><input value={form.collegeId} onChange={e=>setForm({...form,collegeId:e.target.value})} placeholder="VU1F2122XXX" /></div>
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
                <div className="form-group"><label>Batch</label><input value={form.batch} onChange={e=>setForm({...form,batch:e.target.value})} placeholder="Batch 2024-25" /></div>
                <div className="form-group"><label>Department</label><input value={form.department} onChange={e=>setForm({...form,department:e.target.value})} placeholder="Computer Engineering" /></div>
                <div className="form-group"><label>Package (CTC)</label><input value={form.package} onChange={e=>setForm({...form,package:e.target.value})} placeholder="e.g. 8.36 LPA" /></div>
                <div className="form-group"><label>Designation</label><input value={form.jobTitle} onChange={e=>setForm({...form,jobTitle:e.target.value})} /></div>
                <div className="form-group"><label>Company</label><input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} /></div>
                <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                <div className="form-group"><label>LinkedIn</label><input value={form.linkedin} onChange={e=>setForm({...form,linkedin:e.target.value})} /></div>
                <div className="form-group full-width"><label>Bio</label><textarea rows="3" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editing?'Update':'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
