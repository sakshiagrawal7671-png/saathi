import React, { useState, useEffect, useRef } from 'react';
import { shortsApi } from '../services/api';
import toast from 'react-hot-toast';

const CAT_META = {
  STUDY_TIP:           { label:'Study Tip',          icon:'📚', color:'#0ea5e9' },
  LIFE_LESSON:         { label:'Life Lesson',        icon:'🌱', color:'#10b981' },
  EMOTIONAL_WELLBEING: { label:'Emotional Wellbeing', icon:'💜', color:'#8b5cf6' },
  CAREER_ADVICE:       { label:'Career Advice',      icon:'🚀', color:'#f97316' },
  FAMILY_RELATIONSHIP: { label:'Family & Relationships', icon:'❤️', color:'#ef4444' },
};

const BG_GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#30cfd0,#330867)',
  'linear-gradient(135deg,#a8edea,#fed6e3)',
];

export default function ShortsPage() {
  const [shorts,  setShorts]  = useState([]);
  const [stats,   setStats]   = useState(null);
  const [saved,   setSaved]   = useState([]);
  const [current, setCurrent] = useState(0);
  const [tab,     setTab]     = useState('today');
  const [loading, setLoading] = useState(true);
  const viewedRef = useRef(new Set());

  const load = async () => {
    const [d, s, sv] = await Promise.all([
      shortsApi.getDaily(), shortsApi.getStats(), shortsApi.getSaved()
    ]);
    setShorts(d.data.data || []);
    setStats(s.data.data);
    setSaved(sv.data.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // Mark current short as viewed
  useEffect(() => {
    if (shorts.length === 0) return;
    const s = shorts[current];
    if (s && !viewedRef.current.has(s.short.id)) {
      viewedRef.current.add(s.short.id);
      shortsApi.markViewed(s.short.id).then(() => {
        shortsApi.getStats().then(r => setStats(r.data.data));
      });
    }
  }, [current, shorts]);

  const toggleLike = async () => {
    const s = shorts[current];
    await shortsApi.toggleLike(s.short.id);
    setShorts(prev => prev.map((item,i) => i===current ? { ...item, liked: !item.liked } : item));
  };

  const toggleSave = async () => {
    const s = shorts[current];
    await shortsApi.toggleSave(s.short.id);
    setShorts(prev => prev.map((item,i) => i===current ? { ...item, saved: !item.saved } : item));
    toast.success(shorts[current].saved ? 'Removed from saved' : 'Saved! 📌');
    shortsApi.getSaved().then(r => setSaved(r.data.data || []));
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>✨</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading today's shorts...</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:480, margin:'0 auto' }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>SAATHI Shorts ✨</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4, fontSize:13 }}>
          Tiny doses of wisdom. Curated daily. No endless scroll.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <button onClick={() => setTab('today')} className={`btn ${tab==='today' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex:1, justifyContent:'center' }}>
          ✨ Today
        </button>
        <button onClick={() => setTab('saved')} className={`btn ${tab==='saved' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex:1, justifyContent:'center' }}>
          📌 Saved ({saved.length})
        </button>
      </div>

      {tab === 'today' && (
        <>
          {/* Daily limit indicator */}
          <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:14 }}>
            {shorts.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)} style={{
                width: i===current ? 28 : 8, height:8, borderRadius:99, cursor:'pointer',
                background: i <= current ? '#7c3aed' : 'var(--border)',
                transition:'all 0.3s'
              }} />
            ))}
          </div>

          {/* Card stack */}
          {shorts.length > 0 && (
            <div style={{ position:'relative' }}>
              {(() => {
                const item = shorts[current];
                const meta = CAT_META[item.short.category];
                const bg = BG_GRADIENTS[current % BG_GRADIENTS.length];
                return (
                  <div style={{
                    borderRadius:28, padding:'40px 32px', minHeight:420,
                    background: bg, color:'white', position:'relative', overflow:'hidden',
                    display:'flex', flexDirection:'column', justifyContent:'space-between'
                  }}>
                    <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200,
                      borderRadius:'50%', background:'rgba(255,255,255,0.1)' }} />
                    <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160,
                      borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />

                    <div style={{ position:'relative', zIndex:1 }}>
                      <div style={{ display:'inline-flex', alignItems:'center', gap:6,
                        padding:'5px 14px', borderRadius:99, background:'rgba(255,255,255,0.2)',
                        fontSize:12, fontWeight:600, marginBottom:24, backdropFilter:'blur(8px)' }}>
                        {meta.icon} {meta.label}
                      </div>

                      <div style={{ fontSize:56, marginBottom:16 }}>{item.short.icon}</div>

                      <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:22, marginBottom:16, lineHeight:1.3 }}>
                        {item.short.title}
                      </h2>

                      <p style={{ fontSize:15, lineHeight:1.7, opacity:.95 }}>
                        {item.short.content}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ position:'relative', zIndex:1, display:'flex',
                      justifyContent:'space-between', alignItems:'center', marginTop:24 }}>
                      <div style={{ display:'flex', gap:10 }}>
                        <button onClick={toggleLike} style={{
                          width:44, height:44, borderRadius:14, border:'none', cursor:'pointer',
                          background: item.liked ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                          fontSize:20, backdropFilter:'blur(8px)' }}>
                          {item.liked ? '❤️' : '🤍'}
                        </button>
                        <button onClick={toggleSave} style={{
                          width:44, height:44, borderRadius:14, border:'none', cursor:'pointer',
                          background: item.saved ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                          fontSize:20, backdropFilter:'blur(8px)' }}>
                          {item.saved ? '📌' : '📍'}
                        </button>
                      </div>
                      <span style={{ fontSize:12, opacity:.8 }}>{current+1} / {shorts.length}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Navigation */}
              <div style={{ display:'flex', gap:10, marginTop:16 }}>
                <button onClick={() => setCurrent(c => Math.max(0,c-1))} disabled={current===0}
                  className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>← Previous</button>
                {current < shorts.length - 1 ? (
                  <button onClick={() => setCurrent(c => c+1)} className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>
                    Next →
                  </button>
                ) : (
                  <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:13, color:'#10b981', fontWeight:600 }}>
                    🎉 That's today's wisdom!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats footer */}
          <div style={{ textAlign:'center', marginTop:20, padding:'14px 20px', borderRadius:14,
            background:'var(--soft-gray)' }}>
            <p style={{ fontSize:12, color:'var(--text-secondary)' }}>
              ✨ {stats?.viewedToday || 0} / {stats?.dailyLimit || 5} shorts today — quality over quantity, always.
            </p>
          </div>
        </>
      )}

      {tab === 'saved' && (
        <div>
          {saved.length === 0 ? (
            <div className="card" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📌</div>
              <p style={{ color:'var(--text-secondary)' }}>Save shorts you love to find them here later</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {saved.map((s, i) => {
                const meta = CAT_META[s.category];
                return (
                  <div key={i} className="card" style={{ borderLeft:`4px solid ${meta.color}` }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                      <span style={{ fontSize:28 }}>{s.icon}</span>
                      <div>
                        <p style={{ fontSize:11, fontWeight:600, color:meta.color, marginBottom:4 }}>{meta.label}</p>
                        <h4 style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>{s.title}</h4>
                        <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>{s.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
