import React, { useState, useEffect } from 'react';
import { libraryApi } from '../services/api';
import toast from 'react-hot-toast';

const THEME_META = {
  COURAGE:              { label:'Courage',              icon:'🦁' },
  HOPE:                 { label:'Hope',                 icon:'🌟' },
  COMPASSION:           { label:'Compassion',          icon:'💗' },
  PATIENCE:             { label:'Patience',            icon:'🌱' },
  GRATITUDE:            { label:'Gratitude',           icon:'🙏' },
  PURPOSE:              { label:'Purpose',             icon:'🧭' },
  PSYCHOLOGY:           { label:'Psychology',          icon:'🧠' },
  HUMAN_BEHAVIOUR:      { label:'Human Behaviour',     icon:'👥' },
  EMOTIONAL_INTELLIGENCE:{ label:'Emotional Intelligence', icon:'💭' },
  LIFE_SKILLS:          { label:'Life Skills',         icon:'🚧' },
  PERSONAL_GROWTH:      { label:'Personal Growth',     icon:'📈' },
};

export default function LifeLibraryPage() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [interactions, setInteractions] = useState({});

  const load = async () => {
    try {
      const res = await libraryApi.getArticles('LIFE', filter);
      setArticles(res.data.data || []);
    } catch { toast.error('Failed to load library'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [filter]);

  const openArticle = async (article) => {
    setSelected(article);
    try {
      await libraryApi.markRead(article.id);
    } catch {}
  };

  const toggleBookmark = async (e, id) => {
    e.stopPropagation();
    await libraryApi.toggleBookmark(id);
    setInteractions(prev => ({ ...prev, [id]: { ...prev[id], bookmarked: !prev[id]?.bookmarked } }));
    toast.success('Saved! 📌');
  };

  const themes = [...new Set(articles.map(a => a.theme))];

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>📚</div>
        <p style={{ color:'var(--text-secondary)' }}>Opening the library...</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Life Library 📚</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Wisdom from psychology, human behaviour, and personal growth — in bite-sized reads.
        </p>
      </div>

      {/* Theme filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
        <button onClick={() => setFilter(null)}
          className={`btn ${!filter ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize:12 }}>All</button>
        {Object.entries(THEME_META).map(([key, meta]) => (
          <button key={key} onClick={() => setFilter(filter===key ? null : key)} style={{
            padding:'6px 14px', borderRadius:99, fontSize:12, cursor:'pointer',
            border:`1.5px solid ${filter===key ? '#7c3aed' : 'var(--border)'}`,
            background: filter===key ? '#ede9fe' : 'transparent',
            color: filter===key ? '#7c3aed' : 'var(--text-secondary)' }}>
            {meta.icon} {meta.label}
          </button>
        ))}
      </div>

      {selected ? (
        /* Article detail */
        <div className="card" style={{ padding:'36px' }}>
          <button onClick={() => setSelected(null)} className="btn btn-ghost" style={{ marginBottom:20, fontSize:13 }}>
            ← Back to Library
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <span style={{ fontSize:40 }}>{selected.icon}</span>
            <div>
              <span className="badge badge-lavender" style={{ marginBottom:4, display:'inline-block' }}>
                {THEME_META[selected.theme]?.label}
              </span>
              <p style={{ fontSize:12, color:'var(--text-muted)' }}>{selected.readMinutes} min read</p>
            </div>
          </div>
          <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26, margin:'16px 0' }}>{selected.title}</h2>
          <p style={{ fontSize:15, color:'var(--text-secondary)', fontStyle:'italic', marginBottom:24, lineHeight:1.6 }}>
            {selected.summary}
          </p>
          <p style={{ fontSize:16, lineHeight:1.9, color:'var(--text-primary)', whiteSpace:'pre-wrap' }}>
            {selected.content}
          </p>
          <div style={{ display:'flex', gap:10, marginTop:28 }}>
            <button onClick={(e) => toggleBookmark(e, selected.id)} className="btn btn-secondary">
              {interactions[selected.id]?.bookmarked ? '📌 Saved' : '📍 Save for later'}
            </button>
            <button onClick={() => { libraryApi.markHelpful(selected.id); toast.success('Thanks for the feedback! 💜'); }}
              className="btn btn-ghost">👍 This helped me</button>
          </div>
        </div>
      ) : (
        /* Article grid */
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {articles.map(a => (
            <div key={a.id} onClick={() => openArticle(a)} className="card"
              style={{ cursor:'pointer', transition:'transform 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ fontSize:36 }}>{a.icon}</div>
                <button onClick={(e) => toggleBookmark(e, a.id)} style={{
                  background:'none', border:'none', cursor:'pointer', fontSize:18 }}>
                  {interactions[a.id]?.bookmarked ? '📌' : '📍'}
                </button>
              </div>
              <span className="badge badge-lavender" style={{ marginBottom:8, display:'inline-block' }}>
                {THEME_META[a.theme]?.label}
              </span>
              <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:16, marginBottom:6 }}>{a.title}</h3>
              <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:10 }}>{a.summary}</p>
              <p style={{ fontSize:11, color:'var(--text-muted)' }}>📖 {a.readMinutes} min read</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
