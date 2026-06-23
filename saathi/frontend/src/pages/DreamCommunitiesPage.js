import React, { useState, useEffect } from 'react';
import { dreamCommApi } from '../services/api';
import toast from 'react-hot-toast';

export default function DreamCommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [mine,        setMine]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState('all');

  const load = async () => {
    try {
      const [all, my] = await Promise.all([dreamCommApi.getAll(), dreamCommApi.getMine()]);
      setCommunities(all.data.data || []);
      setMine(my.data.data || []);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const join = async (id, name) => {
    try {
      await dreamCommApi.join(id);
      toast.success(`Joined ${name}! Welcome 🎉`);
      load();
    } catch (e) { toast.error(e?.message || 'Already a member'); }
  };

  const leave = async (id, name) => {
    if (!window.confirm(`Leave ${name}?`)) return;
    await dreamCommApi.leave(id);
    toast.success('Left community');
    load();
  };

  const mineIds = new Set(mine.map(c => c.id));
  const display = tab === 'mine' ? mine : communities;

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}><div style={{ fontSize:56 }}>🌍</div></div>
    </div>
  );

  return (
    <div style={{ maxWidth:960, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Dream Communities 🌍</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Find your people. Support-focused communities built around shared goals.
        </p>
      </div>

      <div style={{ borderRadius:16, padding:'16px 22px', marginBottom:20,
        background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0' }}>
        <p style={{ fontSize:14, color:'#15803d', lineHeight:1.7 }}>
          💚 These communities are about <strong>support, not competition</strong>.
          No rankings, no comparisons. Just people working toward similar dreams — together.
        </p>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        <button onClick={() => setTab('all')} className={`btn ${tab==='all'?'btn-primary':'btn-ghost'}`}>🌍 All Communities</button>
        <button onClick={() => setTab('mine')} className={`btn ${tab==='mine'?'btn-primary':'btn-ghost'}`}>
          ⭐ My Communities ({mine.length})
        </button>
      </div>

      {display.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:56 }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🌱</div>
          <p style={{ color:'var(--text-secondary)' }}>{tab==='mine'?'You haven\'t joined any communities yet.':'No communities available.'}</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {display.map(c => {
            const isMem = mineIds.has(c.id);
            return (
              <div key={c.id} className="card" style={{
                borderTop:`4px solid ${c.colorTheme}`,
                transition:'transform 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform='none'}>

                <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:12 }}>
                  <div style={{ fontSize:40, lineHeight:1 }}>{c.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:16 }}>{c.name}</h3>
                      {isMem && (
                        <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600,
                          background:'#dcfce7', color:'#15803d' }}>✓ Member</span>
                      )}
                    </div>
                    <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:4 }}>{c.description}</p>
                  </div>
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:c.colorTheme }} />
                    <span style={{ fontSize:12, color:'var(--text-secondary)' }}>
                      {c.memberCount} member{c.memberCount!==1?'s':''}
                    </span>
                  </div>

                  {isMem ? (
                    <button onClick={() => leave(c.id, c.name)} className="btn btn-ghost"
                      style={{ fontSize:12, color:'#6b7280' }}>Leave</button>
                  ) : (
                    <button onClick={() => join(c.id, c.name)} className="btn btn-primary"
                      style={{ fontSize:12, background:c.colorTheme, borderColor:c.colorTheme }}>
                      + Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card" style={{ marginTop:20, textAlign:'center',
        background:'linear-gradient(135deg,#f8f7ff,#ede9fe)', border:'1px solid #ddd6fe' }}>
        <p style={{ fontSize:14, color:'#5b21b6', lineHeight:1.7 }}>
          💜 Remember: your pace is the right pace. These communities exist to support you,
          not pressure you. Celebrate small wins — together.
        </p>
      </div>
    </div>
  );
}
