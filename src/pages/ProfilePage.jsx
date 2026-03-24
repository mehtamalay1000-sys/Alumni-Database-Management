import { useState, useEffect } from 'react';
import { getCurrentUser, getAlumni, updateAlumni } from '../data/store';

export default function ProfilePage() {
  const user = getCurrentUser();
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', batch: '', department: '',
    jobTitle: '', company: '', linkedin: '', bio: '', skills: [],
  });

  useEffect(() => {
    const alumni = getAlumni();
    const rec = alumni.find(a => a.email === user?.email) || alumni[0];
    if (rec) {
      setForm({ name: rec.name||'', email: rec.email||'', phone: rec.phone||'',
        batch: rec.batch||'', department: rec.department||'', jobTitle: rec.jobTitle||'',
        company: rec.company||'', linkedin: rec.linkedin||'', bio: rec.bio||'',
        skills: rec.skills||[], _id: rec.id });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { _id, ...updates } = form;
    if (_id) { updateAlumni(_id, updates); setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) { setForm({...form, skills: [...form.skills, s]}); setSkillInput(''); }
  };

  const removeSkill = (skill) => setForm({...form, skills: form.skills.filter(s => s !== skill)});

  return (
    <div className="animate-in">
      <h1 className="page-title">👤 Update Profile</h1>
      <p className="page-subtitle">Keep your alumni profile up to date</p>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Batch</label>
            <input value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Current Job Title</label>
            <input value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
          </div>
          <div className="form-group full-width">
            <label>Bio</label>
            <textarea rows="3" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
          </div>
          <div className="form-group full-width">
            <label>Skills</label>
            <div className="skills-input-container">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add a skill"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}} />
              <button type="button" className="btn-secondary" onClick={addSkill}>Add</button>
            </div>
            {form.skills.length > 0 && (
              <div className="skills-list">
                {form.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}
                    <button type="button" onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{marginTop:'8px'}}>✅ Update Profile</button>
        {saved && <span style={{marginLeft:'16px',color:'var(--accent-green)',fontWeight:600,fontSize:'0.9rem'}}>Profile updated!</span>}
      </form>
    </div>
  );
}
