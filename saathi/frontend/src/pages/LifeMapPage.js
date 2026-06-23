import React, { useState, useEffect } from 'react';
import { lifeMapApi } from '../services/api';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SECTIONS = [
  {
    key: 'CURRENT_POSITION',
    label: 'Where I Am Now',
    icon: '📍',
    color: '#0ea5e9',
    bg: '#eff6ff',
    border: '#bfdbfe',
    description: 'Your honest current reality — work, relationships, mindset',
    prompt: 'Describe where you are right now in life...',
  },
  {
    key: 'SHORT_TERM_GOAL',
    label: 'Next 3–6 Months',
    icon: '🎯',
    color: '#10b981',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    description: 'Achievable goals in the near future',
    prompt: 'What do you want to achieve in the next few months?',
  },
  {
    key: 'LONG_TERM_GOAL',
    label: 'Next 1–3 Years',
    icon: '🌟',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    description: 'Bigger milestones you\'re working toward',
    prompt: 'What does your life look like 1-3 years from now?',
  },
  {
    key: 'DREAM_LIFE_VISION',
    label: 'Dream Life Vision',
    icon: '🌈',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
    description: 'Your ultimate vision — no limits, just dreams',
    prompt: 'In your ideal life, what does a typical day look like?',
  },
];

export default function LifeMapPage() {
  const [mapData,  setMapData]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(null); // section key
  const [form,     setForm]     = useState({ title:'', description:'', targetDate:'' });
  const [saving,   setSaving]   = useState(false);

  const load = async () => {
    try {
      const res = await lifeMapApi.getMap();
      setMapData(res.data.data);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addEntry = async () => {
    if (!form.title.trim()) return toast.error('Give this a title');
    setSaving(true);
    try {
      await lifeMapApi.add({ ...form, section: showForm });
      toast.success('Added to your Life Map 🗺️');
      setShowForm(null);
      setForm({ title:'', description:'', targetDate:'' });
      load();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const toggleComplete = async (id) => {
    await lifeMapApi.complete(id);
    load();
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Remove this from your Life Map?')) return;
    await lifeMapApi.delete(id);
    load();
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🗺️</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading your Life Map...</p>
      </div>
    </div>
  );

  const pct = mapData?.progressPercent || 0;
  const total = mapData?.total || 0;
  const completed = mapData?.completed || 0;
  const bySection = mapData?.bySection || {};

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Life Map 🗺️</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          A visual journey from where you are to where you dream of being.
        </p>
      </div>

      {/* Journey progress */}
      <div style={{ borderRadius:20, padding:'24px 28px', marginBottom:28,
        background:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', color:'white' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <p style={{ fontSize:14, opacity:.8, marginBottom:4 }}>Your Journey Progress</p>
            <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:28 }}>
              {completed} / {total} milestones
            </p>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:36 }}>{pct}%</p>
            <p style={{ fontSize:12, opacity:.7 }}>complete</p>
          </div>
        </div>

        {/* Progress track */}
        <div style={{ position:'relative', marginBottom:16 }}>
          <div style={{ height:8, background:'rgba(255,255,255,0.2)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#a78bfa,#f97316)',
              borderRadius:99, transition:'width 0.8s ease' }} />
          </div>
          {/* Section markers */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
            {SECTIONS.map(s => (
              <div key={s.key} style={{ textAlign:'center' }}>
                <span style={{ fontSize:16 }}>{s.icon}</span>
                <p style={{ fontSize:9, opacity:.7, marginTop:2 }}>{s.label.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {total === 0 && (
          <p style={{ fontSize:13, opacity:.7, fontStyle:'italic' }}>
            Start mapping your journey — even one milestone changes everything.
          </p>
        )}
      </div>

      {/* 4 section columns */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}>
        {SECTIONS.map((section, sIdx) => {
          const entries = bySection[section.key] || [];
          const doneCount = entries.filter(e => e.completed).length;

          return (
            <div key={section.key} style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {/* Section header */}
              <div style={{ borderRadius:'16px 16px 0 0', padding:'16px 20px',
                background:section.gradient || section.bg, border:`1px solid ${section.border}`,
                borderBottom:'none' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:section.color,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:15, color:section.color }}>
                        {section.label}
                      </h3>
                      <p style={{ fontSize:11, color:'var(--text-secondary)' }}>{section.description}</p>
                    </div>
                  </div>
                  {entries.length > 0 && (
                    <span style={{ fontSize:11, fontWeight:600, color:section.color,
                      background:`${section.color}18`, padding:'3px 10px', borderRadius:99 }}>
                      {doneCount}/{entries.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Section body */}
              <div style={{ border:`1px solid ${section.border}`, borderTop:'none',
                borderRadius:'0 0 16px 16px', padding:'14px', background:'white',
                minHeight:140, display:'flex', flexDirection:'column', gap:10 }}>

                {entries.length === 0 ? (
                  <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
                    justifyContent:'center', padding:'16px 0' }}>
                    <p style={{ fontSize:13, color:'var(--text-muted)', fontStyle:'italic', textAlign:'center', marginBottom:10 }}>
                      {section.prompt}
                    </p>
                    <button onClick={() => setShowForm(section.key)}
                      style={{ padding:'6px 14px', borderRadius:99, fontSize:12, cursor:'pointer',
                        border:`1.5px solid ${section.color}`, color:section.color,
                        background:`${section.color}10` }}>
                      <FiPlus style={{ marginRight:4, verticalAlign:'middle' }} />
                      Add
                    </button>
                  </div>
                ) : (
                  <>
                    {entries.map(entry => (
                      <div key={entry.id} style={{
                        padding:'10px 12px', borderRadius:10,
                        background: entry.completed ? `${section.color}10` : 'var(--soft-gray)',
                        borderLeft:`3px solid ${entry.completed?section.color:'#e5e7eb'}`,
                        display:'flex', gap:10, alignItems:'flex-start'
                      }}>
                        <button onClick={() => toggleComplete(entry.id)} style={{
                          width:22, height:22, borderRadius:6, border:`2px solid ${section.color}`,
                          background: entry.completed ? section.color : 'white',
                          cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                          marginTop:1
                        }}>
                          {entry.completed && <FiCheck size={12} color="white" />}
                        </button>
                        <div style={{ flex:1 }}>
                          <p style={{ fontWeight:600, fontSize:13,
                            textDecoration:entry.completed?'line-through':'none',
                            color:entry.completed?'var(--text-muted)':'var(--text-primary)' }}>
                            {entry.title}
                          </p>
                          {entry.description && (
                            <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2, lineHeight:1.5 }}>
                              {entry.description}
                            </p>
                          )}
                          {entry.targetDate && (
                            <p style={{ fontSize:10, color:section.color, marginTop:3, fontWeight:600 }}>
                              🗓 {new Date(entry.targetDate).toLocaleDateString('en',{month:'short',year:'numeric'})}
                            </p>
                          )}
                        </div>
                        <button onClick={() => deleteEntry(entry.id)} style={{
                          background:'none', border:'none', cursor:'pointer', color:'#d1d5db',
                          padding:'2px', flexShrink:0 }}>
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => setShowForm(section.key)} style={{
                      padding:'7px', borderRadius:10, border:`1.5px dashed ${section.color}`,
                      background:'transparent', color:section.color, cursor:'pointer',
                      fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', gap:4
                    }}>
                      <FiPlus size={12} /> Add milestone
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspiration footer */}
      <div className="card" style={{ marginTop:24, textAlign:'center',
        background:'linear-gradient(135deg,#fef9c3,#fef3c7)', border:'1px solid #fde68a' }}>
        <p style={{ fontSize:14, color:'#92400e', lineHeight:1.8, maxWidth:560, margin:'0 auto' }}>
          🗺️ A Life Map is not a rigid plan — it's a living document. Change it as you grow.
          The act of mapping your dreams makes them 42% more likely to happen.
          (Brian Tracy, Goals!)
        </p>
      </div>

      {/* Add entry modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div className="card" style={{ width:'100%', maxWidth:520 }}>
            {(() => {
              const s = SECTIONS.find(x => x.key===showForm);
              return (
                <>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:s.color,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
                      {s.icon}
                    </div>
                    <div>
                      <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:18 }}>Add to {s.label}</h2>
                      <p style={{ fontSize:12, color:'var(--text-secondary)' }}>{s.description}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom:14 }}>
                    <label className="label">Milestone / Goal</label>
                    <input className="input" placeholder={s.prompt.replace('?','')}
                      value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))}
                      autoFocus />
                  </div>

                  <div style={{ marginBottom:14 }}>
                    <label className="label">Description (optional)</label>
                    <textarea className="input" rows={3} style={{ resize:'none' }}
                      placeholder="Why does this matter to you? What will it look like when you get there?"
                      value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
                  </div>

                  <div style={{ marginBottom:20 }}>
                    <label className="label">Target Date (optional)</label>
                    <input className="input" type="date" value={form.targetDate}
                      onChange={e => setForm(f=>({...f,targetDate:e.target.value}))} />
                  </div>

                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={addEntry} disabled={saving||!form.title.trim()} className="btn btn-primary"
                      style={{ background:s.color, borderColor:s.color }}>
                      {saving ? 'Saving...' : `${s.icon} Add to Map`}
                    </button>
                    <button onClick={() => setShowForm(null)} className="btn btn-ghost">Cancel</button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
