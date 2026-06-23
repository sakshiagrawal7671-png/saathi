import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { islandApi } from '../services/api';
import toast from 'react-hot-toast';

const TIME_THEMES = {
  DAWN:  { sky:'linear-gradient(180deg,#fda4af,#fbbf24,#fef9c3)', sea:'#7dd3fc', sun:'☀️', label:'Dawn' },
  DAY:   { sky:'linear-gradient(180deg,#7dd3fc,#bae6fd,#e0f2fe)', sea:'#38bdf8', sun:'☀️', label:'Day' },
  DUSK:  { sky:'linear-gradient(180deg,#7c3aed,#f97316,#fde68a)', sea:'#6366f1', sun:'🌅', label:'Dusk' },
  NIGHT: { sky:'linear-gradient(180deg,#0f172a,#1e293b,#312e81)', sea:'#1e3a8a', sun:'🌙', label:'Night' },
};

const STRUCTURE_POSITIONS = [
  // name match -> { top, left } percentages on the island
  { name:'Family House',     top:'58%', left:'48%' },
  { name:'Memory Lake',      top:'40%', left:'18%' },
  { name:'Gratitude Garden', top:'70%', left:'22%' },
  { name:'Dream Tower',      top:'22%', left:'55%' },
  { name:'Pet Area',         top:'68%', left:'72%' },
  { name:'Wisdom Library',   top:'35%', left:'78%' },
  { name:'Hope Bridge',      top:'78%', left:'50%' },
  { name:'Focus Forest',     top:'48%', left:'85%' },
];

export default function PersonalIslandPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      const res = await islandApi.getStatus();
      setStatus(res.data.data);
    } catch { toast.error('Failed to load your island'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12, animation:'float 2s ease-in-out infinite' }}>🏝️</div>
        <p style={{ color:'var(--text-secondary)' }}>Sailing to your island...</p>
      </div>
    </div>
  );

  const theme = TIME_THEMES[status?.timeOfDay] || TIME_THEMES.DAY;
  const structures = status?.structures || [];
  const unlockedCount = status?.unlockedCount || 0;
  const totalCount = status?.totalCount || 8;

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Your Personal Island 🏝️</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          A visual world that grows with you. Every part of your journey has a place here.
        </p>
      </div>

      {/* Island Level Banner */}
      <div style={{ borderRadius:16, padding:'14px 22px', marginBottom:18,
        background:'linear-gradient(135deg,#fef9c3,#fef3c7)', border:'1px solid #fde68a',
        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:24 }}>🏝️</span>
          <div>
            <p style={{ fontWeight:700, fontSize:14, color:'#92400e' }}>Island Level {status?.islandLevel || 1}</p>
            <p style={{ fontSize:12, color:'#b45309' }}>{unlockedCount} of {totalCount} structures unlocked</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {Array.from({ length: totalCount }).map((_,i) => (
            <div key={i} style={{ width:10, height:10, borderRadius:'50%',
              background: i < unlockedCount ? '#f59e0b' : '#fde68a' }} />
          ))}
        </div>
      </div>

      {/* Island Visual */}
      <div style={{
        position:'relative', borderRadius:24, overflow:'hidden', marginBottom:24,
        height:480, background: theme.sky, border:'1px solid var(--border)'
      }}>
        {/* Sun/Moon */}
        <div style={{ position:'absolute', top:24, right:40, fontSize:48,
          filter: status?.timeOfDay==='NIGHT' ? 'drop-shadow(0 0 20px rgba(255,255,255,0.5))' : 'drop-shadow(0 0 20px rgba(253,224,71,0.6))' }}>
          {theme.sun}
        </div>

        {/* Stars for night */}
        {status?.timeOfDay === 'NIGHT' && Array.from({ length:30 }).map((_,i) => (
          <div key={i} style={{ position:'absolute',
            top:`${Math.random()*50}%`, left:`${Math.random()*100}%`,
            width:2, height:2, borderRadius:'50%', background:'white',
            opacity:Math.random()*0.8+0.2,
            animation:`twinkle ${Math.random()*3+2}s ease-in-out infinite ${Math.random()*2}s` }} />
        ))}

        {/* Clouds */}
        {status?.timeOfDay !== 'NIGHT' && [20,55,75].map((left,i) => (
          <div key={i} style={{ position:'absolute', top:`${10+i*8}%`, left:`${left}%`,
            fontSize:32, opacity:.7, animation:`drift ${20+i*5}s linear infinite` }}>☁️</div>
        ))}

        {/* Sea */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'35%',
          background: theme.sea, opacity:.6,
          borderTopLeftRadius:'50% 20px', borderTopRightRadius:'50% 20px' }} />

        {/* Island land mass */}
        <div style={{ position:'absolute', bottom:'18%', left:'8%', right:'8%', height:'45%',
          background:'linear-gradient(180deg,#84cc16,#65a30d)',
          borderRadius:'50% 50% 20% 20% / 30% 30% 15% 15%',
          boxShadow:'0 -4px 20px rgba(0,0,0,0.1)' }} />

        {/* Structures */}
        {STRUCTURE_POSITIONS.map(pos => {
          const s = structures.find(st => st.name === pos.name);
          if (!s) return null;
          return (
            <div key={pos.name}
              onClick={() => setSelected(s)}
              style={{
                position:'absolute', top:pos.top, left:pos.left,
                transform:'translate(-50%,-50%)', cursor:'pointer',
                textAlign:'center', transition:'transform 0.2s',
                filter: s.unlocked ? 'none' : 'grayscale(1) opacity(0.4)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform='translate(-50%,-50%) scale(1.15)'}
              onMouseLeave={e => e.currentTarget.style.transform='translate(-50%,-50%) scale(1)'}>
              <div style={{ fontSize:36, filter: s.unlocked ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none' }}>
                {s.unlocked ? s.icon : '🔒'}
              </div>
              {s.unlocked && (
                <div style={{ position:'absolute', inset:0, animation: 'pulse-glow 3s ease-in-out infinite' }} />
              )}
            </div>
          );
        })}

        {/* Floating decorations */}
        {status?.timeOfDay !== 'NIGHT' && (
          <div style={{ position:'absolute', top:'15%', left:'15%', fontSize:24, animation:'float 4s ease-in-out infinite' }}>🦋</div>
        )}
        <div style={{ position:'absolute', bottom:'10%', right:'15%', fontSize:28, animation:'float 5s ease-in-out infinite 1s' }}>🐚</div>
      </div>

      {/* Selected structure detail */}
      {selected && (
        <div className="card" style={{ marginBottom:20, borderLeft:`4px solid ${selected.unlocked ? '#10b981' : '#94a3b8'}` }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
            <div style={{ fontSize:40 }}>{selected.unlocked ? selected.icon : '🔒'}</div>
            <div style={{ flex:1 }}>
              <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:17 }}>{selected.name}</h3>
              <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:4 }}>{selected.description}</p>
              {selected.unlocked ? (
                <Link to={selected.link} style={{ textDecoration:'none' }}>
                  <button className="btn btn-primary" style={{ marginTop:10, fontSize:12 }}>Visit →</button>
                </Link>
              ) : (
                <span style={{ display:'inline-block', marginTop:10, padding:'4px 12px',
                  borderRadius:99, background:'#f1f5f9', color:'#64748b', fontSize:11, fontWeight:600 }}>
                  🔒 Locked
                </span>
              )}
            </div>
            <button onClick={() => setSelected(null)} style={{ background:'none', border:'none',
              cursor:'pointer', color:'var(--text-muted)', fontSize:18 }}>✕</button>
          </div>
        </div>
      )}

      {/* All structures grid */}
      <div className="card">
        <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14 }}>Island Structures</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {structures.map(s => (
            <div key={s.name} onClick={() => setSelected(s)} style={{
              padding:'16px 10px', borderRadius:14, textAlign:'center', cursor:'pointer',
              background: s.unlocked ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)' : 'var(--soft-gray)',
              border:`1px solid ${s.unlocked ? '#bbf7d0' : 'var(--border)'}`,
              opacity: s.unlocked ? 1 : .6, transition:'transform 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              <div style={{ fontSize:28, marginBottom:6 }}>{s.unlocked ? s.icon : '🔒'}</div>
              <p style={{ fontSize:12, fontWeight:600, color: s.unlocked ? '#15803d' : 'var(--text-muted)' }}>{s.name}</p>
              <p style={{ fontSize:10, color: s.unlocked ? '#10b981' : 'var(--text-muted)', marginTop:2 }}>
                {s.unlocked ? '✓ Unlocked' : 'Locked'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes twinkle { 0%,100%{opacity:.2} 50%{opacity:1} }
        @keyframes drift { from{transform:translateX(0)} to{transform:translateX(30px)} }
        @keyframes pulse-glow { 0%,100%{opacity:0} 50%{opacity:.3} }
      `}</style>
    </div>
  );
}
