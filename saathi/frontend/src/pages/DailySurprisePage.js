import React, { useState, useEffect } from 'react';
import { surpriseApi } from '../services/api';
import toast from 'react-hot-toast';

const TYPE_META = {
  WISDOM_CARD:        { label:'Wisdom Card',       color:'#7c3aed', gradient:'linear-gradient(135deg,#667eea,#764ba2)', actionLabel:'Reflect on this' },
  KINDNESS_MISSION:   { label:'Kindness Mission',  color:'#ec4899', gradient:'linear-gradient(135deg,#f093fb,#f5576c)', actionLabel:'I did this!' },
  REFLECTION_PROMPT:  { label:'Reflection Prompt', color:'#0ea5e9', gradient:'linear-gradient(135deg,#4facfe,#00f2fe)', actionLabel:'I reflected' },
  FAMILY_CHALLENGE:   { label:'Family Challenge',  color:'#f97316', gradient:'linear-gradient(135deg,#fa709a,#fee140)', actionLabel:'Done with family!' },
  GRATITUDE_CHALLENGE:{ label:'Gratitude Challenge',color:'#10b981', gradient:'linear-gradient(135deg,#43e97b,#38f9d7)', actionLabel:'Completed!' },
};

export default function DailySurprisePage() {
  const [surprises, setSurprises] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [flipped,   setFlipped]   = useState({});

  const load = async () => {
    try {
      const res = await surpriseApi.getToday();
      setSurprises(res.data.data || []);
    } catch { toast.error('Failed to load surprises'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const open = async (s) => {
    setFlipped(prev => ({ ...prev, [s.id]: true }));
    if (!s.opened) {
      await surpriseApi.open(s.id);
      load();
    }
  };

  const complete = async (s) => {
    await surpriseApi.complete(s.id);
    toast.success('Completed! +15 XP 🌟');
    load();
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12, animation:'float 2s ease-in-out infinite' }}>🎁</div>
        <p style={{ color:'var(--text-secondary)' }}>Preparing your surprises...</p>
      </div>
    </div>
  );

  const completedCount = surprises.filter(s => s.completed).length;

  return (
    <div style={{ maxWidth:900, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Daily Surprise 🎁</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Five gifts, refreshed every day. Open them when you're ready.
        </p>
      </div>

      {/* Progress */}
      <div style={{ borderRadius:16, padding:'16px 24px', marginBottom:24,
        background:'linear-gradient(135deg,#fef9c3,#fef3c7)', border:'1px solid #fde68a',
        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <p style={{ fontWeight:700, fontSize:15, color:'#92400e' }}>
            🌟 {completedCount} of {surprises.length} completed today
          </p>
          <p style={{ fontSize:12, color:'#b45309', marginTop:2 }}>
            New surprises arrive tomorrow!
          </p>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {surprises.map((s,i) => (
            <div key={i} style={{ width:12, height:12, borderRadius:'50%',
              background: s.completed ? '#10b981' : s.opened ? '#fbbf24' : '#fde68a' }} />
          ))}
        </div>
      </div>

      {/* Surprise cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {surprises.map(s => {
          const meta = TYPE_META[s.type];
          const isFlipped = flipped[s.id] || s.opened;

          return (
            <div key={s.id} style={{ minHeight:240, position:'relative' }}>
              {!isFlipped ? (
                /* Closed gift */
                <div onClick={() => open(s)} style={{
                  height:240, borderRadius:20, cursor:'pointer',
                  background:'linear-gradient(135deg,#7c3aed,#a78bfa)',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  color:'white', transition:'transform 0.2s', boxShadow:'0 8px 24px rgba(124,58,237,0.3)'
                }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px) scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform='none'}>
                  <div style={{ fontSize:56, marginBottom:12, animation:'wiggle 2s ease-in-out infinite' }}>🎁</div>
                  <p style={{ fontWeight:700, fontSize:14 }}>{meta.label}</p>
                  <p style={{ fontSize:11, opacity:.8, marginTop:6 }}>Tap to open</p>
                </div>
              ) : (
                /* Opened card */
                <div style={{
                  height:240, borderRadius:20, padding:'24px',
                  background: meta.gradient, color:'white',
                  display:'flex', flexDirection:'column', justifyContent:'space-between',
                  animation:'flipIn 0.4s ease'
                }}>
                  <div>
                    <span style={{ padding:'4px 12px', borderRadius:99, fontSize:11, fontWeight:600,
                      background:'rgba(255,255,255,0.2)' }}>{meta.label}</span>
                    <div style={{ fontSize:36, margin:'14px 0 10px' }}>{s.icon}</div>
                    <p style={{ fontSize:14, lineHeight:1.6 }}>{s.content}</p>
                  </div>
                  {!s.completed ? (
                    <button onClick={() => complete(s)} style={{
                      padding:'8px 16px', borderRadius:10, border:'none', cursor:'pointer',
                      background:'rgba(255,255,255,0.9)', color: meta.color, fontWeight:700, fontSize:12,
                      alignSelf:'flex-start' }}>
                      ✓ {meta.actionLabel}
                    </button>
                  ) : (
                    <span style={{ fontSize:13, fontWeight:700, opacity:.9 }}>✅ Completed! +15 XP</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop:24, textAlign:'center',
        background:'linear-gradient(135deg,#f8f7ff,#ede9fe)', border:'1px solid #ddd6fe' }}>
        <p style={{ fontSize:13, color:'#5b21b6', lineHeight:1.7 }}>
          💜 No pressure to complete everything. These are gifts, not obligations.
          Open what calls to you today.
        </p>
      </div>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-5deg)} 75%{transform:rotate(5deg)} }
        @keyframes flipIn { from{opacity:0; transform:scale(0.9) rotateY(90deg)} to{opacity:1; transform:scale(1) rotateY(0)} }
      `}</style>
    </div>
  );
}
