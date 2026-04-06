import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, register } from '../data/store';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('alumni');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = login(email, password);
      if (result.success) {
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(result.message);
      }
    } else {
      if (!name.trim()) { setError('Name is required'); return; }
      const result = register(name, email, password, role);
      if (result.success) {
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <h1>
            Alumni Database
            <span>Management System</span>
          </h1>
        </div>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to access your alumni network' : 'Create your account to join the alumni network'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="alumni">Alumni</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <button type="submit" className="btn-primary">
            {isLogin ? '🔐 Sign In' : '🚀 Create Account'}
          </button>
        </form>

        <p className="auth-link" style={{ marginTop: '20px' }}>
          {isLogin ? (
            <>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); setError(''); }}>Register Here</a></>
          ) : (
            <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); setError(''); }}>Sign In</a></>
          )}
        </p>

        {/* <div style={{ marginTop: '20px', padding: '14px', background: '#f0f4f8', borderRadius: '10px', fontSize: '0.8rem', color: '#64748b' }}>
          <strong>Demo Credentials:</strong><br/>
          Admin: admin@alumni.edu / admin123<br/>
          Alumni: john.doe@email.com / password123
        </div> */}
      </div>
    </div>
  );
}
