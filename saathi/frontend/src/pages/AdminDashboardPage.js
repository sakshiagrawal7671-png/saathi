import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ROLE_COLORS = {
  USER:'#0ea5e9', MENTOR:'#10b981', EXPERT_CREATOR:'#f59e0b', ADMIN:'#7c3aed'
};

export default function AdminDashboardPage() {
  const { user } = useSelector(s => s.auth);
  const [stats,    setStats]    = useState(null);
  const [analytics,setAnalytics]= useState(null);
  const [users,    setUsers]    = useState([]);
  const [flagged,  setFlagged]  = useState([]);
  const [tab,      setTab]      = useState('overview');
  const [loading,  setLoading]  = useState(true);

  const load = async () => {
    try {
      const [st, an, us, fl] = await Promise.all([
        adminApi.getStats(), adminApi.getAnalytics(),
        adminApi.getUsers(), adminApi.getFlagged()
      ]);
      setStats(st.data.data);
      setAnalytics(an.data.data);
      setUsers(us.data.data || []);
      setFlagged(fl.data.data || []);
    } catch (e) {
      toast.error('Access denied or failed to load');
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const changeRole = async (id, role) => {
    await adminApi.updateRole(id, role);
    toast.success('Role updated');
    load();
  };

  const toggleEnabled = async (id) => {
    await adminApi.toggleEnabled(id);
    toast.success('User status changed');
    load();
  };

  const deletePost = async (id) => {
    if (!window.confirm('Remove this post permanently?')) return;
    await adminApi.deletePost(id);
    toast.success('Post removed');
    load();
  };

  const unflagPost = async (id) => {
    await adminApi.flagPost(id, false);
    toast.success('Post cleared');
    load();
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>⚙️</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading admin panel...</p>
      </div>
    </div>
  );

  if (user?.role !== 'ADMIN') return (
    <div style={{ textAlign:'center', padding:80 }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🔒</div>
      <h2 style={{ fontFamily:'Poppins', fontWeight:700, color:'#ef4444' }}>Access Denied</h2>
      <p style={{ color:'var(--text-secondary)', marginTop:8 }}>This page is for administrators only.</p>
    </div>
  );

  const statCards = stats ? [
    { label:'Total Users',        value:stats.totalUsers,           icon:'👥', color:'#7c3aed' },
    { label:'Active Today',        value:stats.activeToday,          icon:'🟢', color:'#10b981' },
    { label:'Active This Week',   value:stats.activeThisWeek,       icon:'📅', color:'#0ea5e9' },
    { label:'Journal Entries',    value:stats.totalJournalEntries,  icon:'📓', color:'#f59e0b' },
    { label:'Mood Entries',       value:stats.totalMoodEntries,     icon:'😊', color:'#ec4899' },
    { label:'Community Posts',    value:stats.totalCommunityPosts,  icon:'🌍', color:'#06b6d4' },
    { label:'Flagged Posts',      value:stats.flaggedPosts || flagged.length, icon:'🚩', color:'#ef4444' },
    { label:'Pending Experts',    value:stats.pendingExpertApplications, icon:'🎓', color:'#8b5cf6' },
    { label:'Verified Experts',   value:stats.verifiedExperts,      icon:'✅', color:'#10b981' },
  ] : [];

  return (
    <div style={{ maxWidth:1100, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Admin Dashboard ⚙️</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Manage users, content, and platform health.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {[
          { id:'overview',  label:'📊 Overview' },
          { id:'users',     label:'👥 Users' },
          { id:'community', label:'🌍 Community' },
          { id:'analytics', label:'📈 Analytics' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`btn ${tab===t.id ? 'btn-primary' : 'btn-ghost'}`}>{t.label}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
            {statCards.map(({ label, value, icon, color }) => (
              <div key={label} className="card" style={{ padding:'18px 20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>{label}</p>
                    <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:28, color }}>{value ?? 0}</p>
                  </div>
                  <span style={{ fontSize:28 }}>{icon}</span>
                </div>
              </div>
            ))}
          </div>

          {stats?.roleBreakdown && (
            <div className="card">
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14 }}>Role Distribution</h3>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                {Object.entries(stats.roleBreakdown).map(([role, count]) => (
                  <div key={role} style={{ padding:'10px 18px', borderRadius:12,
                    background:`${ROLE_COLORS[role]}18`, border:`1px solid ${ROLE_COLORS[role]}44` }}>
                    <p style={{ fontWeight:700, fontSize:20, color:ROLE_COLORS[role] }}>{count}</p>
                    <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>{role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div className="card" style={{ padding:'24px' }}>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:16 }}>
            All Users ({users.length})
          </h3>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:'2px solid var(--border)' }}>
                  {['ID','Name','Email','Role','Level','Streak','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', color:'var(--text-muted)',
                      fontWeight:600, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'10px 14px', color:'var(--text-muted)' }}>#{u.id}</td>
                    <td style={{ padding:'10px 14px', fontWeight:500 }}>{u.fullName || '—'}</td>
                    <td style={{ padding:'10px 14px', color:'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} style={{
                        padding:'4px 8px', borderRadius:8, border:`1px solid ${ROLE_COLORS[u.role]}44`,
                        background:`${ROLE_COLORS[u.role]}10`, color:ROLE_COLORS[u.role], fontSize:11,
                        fontWeight:700, cursor:'pointer' }}>
                        {['USER','MENTOR','EXPERT_CREATOR','ADMIN'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding:'10px 14px' }}>⚔️ {u.level}</td>
                    <td style={{ padding:'10px 14px' }}>🔥 {u.streakDays}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600,
                        background: u.enabled ? '#dcfce7' : '#fee2e2',
                        color: u.enabled ? '#15803d' : '#dc2626' }}>
                        {u.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 14px' }}>
                      <button onClick={() => toggleEnabled(u.id)} style={{
                        padding:'4px 10px', borderRadius:8, border:'1px solid var(--border)',
                        background:'white', cursor:'pointer', fontSize:11 }}>
                        {u.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMMUNITY */}
      {tab === 'community' && (
        <div>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14 }}>
            Flagged Posts ({flagged.length})
          </h3>
          {flagged.length === 0 ? (
            <div className="card" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
              <p style={{ color:'var(--text-secondary)' }}>No flagged posts — community is healthy!</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {flagged.map(post => (
                <div key={post.id} className="card" style={{ borderLeft:'4px solid #ef4444' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div>
                      <p style={{ fontWeight:700 }}>{post.title}</p>
                      <p style={{ fontSize:12, color:'var(--text-muted)' }}>
                        by user #{post.user?.id} · {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => unflagPost(post.id)} className="btn btn-secondary" style={{ fontSize:12 }}>
                        ✓ Clear
                      </button>
                      <button onClick={() => deletePost(post.id)} style={{
                        padding:'6px 12px', borderRadius:8, border:'1px solid #fecaca',
                        background:'#fff1f2', color:'#dc2626', cursor:'pointer', fontSize:12 }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:'var(--text-secondary)' }}>{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS */}
      {tab === 'analytics' && analytics && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {[
            { label:'Avg Community Stress', value:`${analytics.avgCommunityStress}/10`, icon:'😤', color:'#ef4444' },
            { label:'Avg Community Energy', value:`${analytics.avgCommunityEnergy}/10`, icon:'⚡', color:'#f59e0b' },
            { label:'Avg Community Sleep',  value:`${analytics.avgCommunitySleep}h`,   icon:'💤', color:'#8b5cf6' },
            { label:'Total Focus Minutes',  value:analytics.totalFocusMinutes,          icon:'🌳', color:'#10b981' },
            { label:'Total Connection Logs',value:analytics.totalConnectionLogs,        icon:'❤️', color:'#ec4899' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="card" style={{ padding:'20px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ fontSize:36 }}>{icon}</div>
              <div>
                <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:28, color }}>{value}</p>
                <p style={{ fontSize:13, color:'var(--text-secondary)' }}>{label}</p>
              </div>
            </div>
          ))}

          {/* Mood distribution */}
          {analytics.communityMoodDistribution && (
            <div className="card" style={{ gridColumn:'1/-1' }}>
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14 }}>Community Mood Distribution</h3>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {Object.entries(analytics.communityMoodDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([mood, count]) => (
                    <div key={mood} style={{ padding:'8px 14px', borderRadius:12, background:'var(--soft-gray)' }}>
                      <p style={{ fontWeight:700 }}>{count}</p>
                      <p style={{ fontSize:11, color:'var(--text-muted)' }}>{mood.replace('_',' ')}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
