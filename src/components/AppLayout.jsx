import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../data/store';

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      navigate('/login');
    } else {
      setUser(u);
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/alumni', label: 'Manage Alumni', icon: '👥' },
    { to: '/admin/jobs', label: 'Job Board', icon: '💼' },
    { to: '/admin/events', label: 'Events', icon: '📅' },
    { to: '/admin/mentorship', label: 'Mentorship', icon: '🤝' },
  ];

  const alumniLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊', end: true },
    { to: '/dashboard/jobs', label: 'Job Board', icon: '💼' },
    { to: '/dashboard/events', label: 'Events', icon: '📅' },
    { to: '/dashboard/mentorship', label: 'Mentorship', icon: '🤝' },
    { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ];

  const links = isAdmin ? adminLinks : alumniLinks;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">🎓</div>
          <h2>
            Alumni Database
            <span>Management System</span>
          </h2>
        </div>
        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-nav">
              {links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-user">
              <div className="topbar-avatar">{getInitials(user.name)}</div>
              <div className="topbar-user-info">
                <span className="topbar-user-name">{user.name}</span>
                <span className="topbar-user-role">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
