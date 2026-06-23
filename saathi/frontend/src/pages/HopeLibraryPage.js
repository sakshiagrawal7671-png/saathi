import React, { useState, useEffect } from 'react';
import { libraryApi } from '../services/api';
import toast from 'react-hot-toast';

const THEME_META = {
  OVERCOMING_FAILURE:   { label:'Overcoming Failure',  icon:'📖', color:'#f59e0b' },
  OVERCOMING_LOSS:      { label:'Overcoming Loss',     icon:'🕊️', color:'#8b5cf6' },
  OVERCOMING_ADVERSITY: { label:'Overcoming Adversity',icon:'🔥', color:'#ef4444' },
  OVERCOMING_REJECTION: { label:'Overcoming Rejection',icon:'🚪', color:'#0ea5e9' },
  RESILIENCE:           { label:'Resilience',          icon:'💪', color:'#10b981' },
  HOPE:                 { label:'Hope',                icon:'🌟', color:'#f59e0b' },
  PERSONAL_GROWTH:      { label:'Personal Growth',     icon:'🔄', color:'#7c3aed' },
};

export default function HopeLibraryPage() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState(null);
  const [loading,  setLoading]  = useState(true);

  const load = async () => {
    try {
      const res = await libraryApi.getArticles('HOPE', filter);
      setArticles(res.data.data || []);
    } catch { toast.error('Failed to load'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [filter]);

  const openArticle = async (article) => {
    setSelected(article);
    try { await libraryApi.markRead(article.id); } catch {}
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🌟</div>
        <p style={{ color:'var(--text-secondary)' }}>Lighting the way...</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Hope Library 🌟</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Stories of resilience. People who overcame what you're facing now — and made it through.
        </p>
      </div>

      {/* Hero intro */}
      {!selected && (
        <div style={{ borderRadius:20, padding:'28px 32px', marginBottom:24, textAlign:'center',
          background:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', color:'white' }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🕯️</div>
          <p style={{ fontSize:15, lineHeight:1.8, maxWidth:560, margin:'0 auto', opacity:.9 }}>
            Whatever you're going through — failure, loss, rejection, or adversity —
            someone else has walked through it and found their way to the other side.
            These stories aren't meant to minimize your pain. They're here to remind you: <strong>you're not alone, and this isn't the end.</strong>
          </p>
        </div>
      )}

      {/* Theme filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
        <button onClick={() => setFilter(null)}
          className={`btn ${!filter ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize:12 }}>All Stories</button>
        {Object.entries(THEME_META).map(([key, meta]) => (
          <button key={key} onClick={() => setFilter(filter===key ? null : key)} style={{
            padding:'6px 14px', borderRadius:99, fontSize:12, cursor:'pointer',
            border:`1.5px solid ${filter===key ? meta.color : 'var(--border)'}`,
            background: filter===key ? `${meta.color}18` : 'transparent',
            color: filter===key ? meta.color : 'var(--text-secondary)' }}>
            {meta.icon} {meta.label}
          </button>
        ))}
      </div>

      {selected ? (
        <div className="card" style={{ padding:'36px' }}>
          <button onClick={() => setSelected(null)} className="btn btn-ghost" style={{ marginBottom:20, fontSize:13 }}>
            ← Back to Hope Library
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <span style={{ fontSize:40 }}>{selected.icon}</span>
            <div>
              <span style={{ padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:600,
                background:`${THEME_META[selected.theme]?.color}18`, color:THEME_META[selected.theme]?.color }}>
                {THEME_META[selected.theme]?.label}
              </span>
              <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{selected.readMinutes} min read</p>
            </div>
          </div>
          <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26, margin:'16px 0' }}>{selected.title}</h2>
          <p style={{ fontSize:15, color:'var(--text-secondary)', fontStyle:'italic', marginBottom:24, lineHeight:1.6 }}>
            {selected.summary}
          </p>
          <p style={{ fontSize:16, lineHeight:1.9, color:'var(--text-primary)', whiteSpace:'pre-wrap' }}>
            {selected.content}
          </p>
          <div style={{ marginTop:28, padding:'16px 20px', borderRadius:14,
            background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0', textAlign:'center' }}>
            <p style={{ fontSize:14, color:'#15803d', fontWeight:500 }}>
              💜 If this resonated with you, you're not alone. Consider sharing how you're feeling in the Comfort Room.
            </p>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <button onClick={() => { libraryApi.markHelpful(selected.id); toast.success('Thank you for sharing 💜'); }}
              className="btn btn-secondary">💪 This gave me hope</button>
          </div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {articles.map(a => {
            const meta = THEME_META[a.theme];
            return (
              <div key={a.id} onClick={() => openArticle(a)} className="card"
                style={{ cursor:'pointer', transition:'transform 0.15s', borderTop:`3px solid ${meta?.color}` }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform='none'}>
                <div style={{ fontSize:36, marginBottom:10 }}>{a.icon}</div>
                <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600,
                  background:`${meta?.color}18`, color:meta?.color, marginBottom:8, display:'inline-block' }}>
                  {meta?.label}
                </span>
                <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:16, marginBottom:6 }}>{a.title}</h3>
                <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:10 }}>{a.summary}</p>
                <p style={{ fontSize:11, color:'var(--text-muted)' }}>📖 {a.readMinutes} min read</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
