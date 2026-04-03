import { useState, useEffect, useMemo } from 'react';
import { getStats, getAlumni } from '../data/store';
import { getPlacementStats, totalStudents2025, totalPlacedCount } from '../data/realStudents';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [alumni, setAlumni] = useState([]);
  const placementStats = useMemo(() => getPlacementStats(), []);

  useEffect(() => {
    setStats(getStats());
    setAlumni(getAlumni());
  }, []);

  // Sort alumni by package (highest first) - real data
  const topPlacedStudents = useMemo(() => {
    return [...alumni]
      .filter(a => a.package && a.department === 'Computer Engineering')
      .sort((a, b) => {
        const pkgA = parseFloat(a.package) || 0;
        const pkgB = parseFloat(b.package) || 0;
        return pkgB - pkgA;
      });
  }, [alumni]);

  // Company-wise placement data for bar chart
  const companyChartData = useMemo(() => {
    return Object.entries(placementStats.companyWise)
      .map(([name, count]) => ({ name: name.length > 15 ? name.slice(0, 14) + '…' : name, fullName: name, Students: count }))
      .sort((a, b) => b.Students - a.Students)
      .slice(0, 12);
  }, [placementStats]);

  // Package distribution for pie chart
  const packagePieData = useMemo(() => {
    return Object.entries(placementStats.packageDistribution).map(([name, value]) => ({ name, value }));
  }, [placementStats]);

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const getRankBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="animate-in">
      <h1 className="page-title">Admin Dashboard — Placement Cell 2024-25</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card green animate-in stagger-1">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <h3>{totalStudents2025}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card blue animate-in stagger-2">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{totalPlacedCount}</h3>
            <p>Students Placed ({placementStats.placementPercentage}%)</p>
          </div>
        </div>
        <div className="stat-card purple animate-in stagger-3">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{placementStats.highestPackage} LPA</h3>
            <p>Highest Package</p>
          </div>
        </div>
        <div className="stat-card orange animate-in stagger-4">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>₹{placementStats.averagePackage} LPA</h3>
            <p>Average Package</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(16,185,129,0.15)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>Median Package</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>₹{placementStats.medianPackage} LPA</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>Lowest Package</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ef4444' }}>₹{placementStats.lowestPackage} LPA</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(59,130,246,0.15)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>Companies Recruited</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#3b82f6' }}>{Object.keys(placementStats.companyWise).length}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))', borderRadius: '14px', padding: '18px 20px', border: '1px solid rgba(139,92,246,0.15)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>Confirmed Offers</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#8b5cf6' }}>{placementStats.totalPlaced}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Company-wise Bar Chart */}
        <div className="table-wrapper animate-in" style={{ padding: '28px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>
            🏢 Company-wise Placements
          </h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={companyChartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 500 }} axisLine={false} tickLine={false} angle={-40} textAnchor="end" interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: '12px 16px', background: 'rgba(255,255,255,0.98)' }}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                />
                <Bar dataKey="Students" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Package Distribution Pie Chart */}
        <div className="table-wrapper animate-in" style={{ padding: '28px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>
            💰 Package Distribution (CTC Range)
          </h3>
          <div style={{ width: '100%', height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={packagePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  labelLine={{ strokeWidth: 1 }}
                >
                  {packagePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: '12px 16px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Placed Students */}
      <div className="table-wrapper animate-in">
        <div className="table-header">
          <h3>🏆 Top Placed Students — Computer Engineering — Batch 2024-25</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Company</th>
              <th>Designation</th>
              <th>CGPA</th>
              <th>Package (CTC)</th>
            </tr>
          </thead>
          <tbody>
            {topPlacedStudents.length > 0 ? (
              topPlacedStudents.map((alum, index) => (
                <tr key={alum.id} style={index < 3 ? { background: index === 0 ? 'rgba(16,185,129,0.06)' : index === 1 ? 'rgba(59,130,246,0.04)' : 'rgba(245,158,11,0.04)' } : {}}>
                  <td>
                    <span style={{
                      fontSize: index < 3 ? '1.4rem' : '0.9rem',
                      fontWeight: 700,
                      color: index >= 3 ? 'var(--text-secondary)' : undefined,
                    }}>
                      {getRankBadge(index)}
                    </span>
                  </td>
                  <td>
                    <div className="table-avatar">
                      <div className="table-avatar-circle" style={
                        index === 0 ? { background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff' } :
                        index === 1 ? { background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff' } :
                        index === 2 ? { background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff' } :
                        {}
                      }>{getInitials(alum.name)}</div>
                      <div>
                        <div className="table-name">{alum.name}</div>
                        <div className="table-sub">{alum.collegeId || alum.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{alum.company || 'N/A'}</span></td>
                  <td>{alum.jobTitle || 'N/A'}</td>
                  <td>{alum.cgpa || 'N/A'}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '5px 14px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      background: index === 0 ? 'linear-gradient(135deg, #10b981, #059669)' :
                                  index === 1 ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
                                  index === 2 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                  'var(--gray-100)',
                      color: index < 3 ? '#fff' : 'var(--gray-700)',
                      boxShadow: index < 3 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                    }}>
                      ₹ {alum.package}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="table-empty">No placement records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
