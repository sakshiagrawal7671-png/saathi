import React, { useState, useEffect } from 'react';
import { purposeApi } from '../services/api';
import toast from 'react-hot-toast';

const PREDEFINED_VALUES = [
  'Family','Creativity','Integrity','Growth','Compassion','Freedom',
  'Excellence','Service','Adventure','Health','Wisdom','Courage',
  'Community','Spirituality','Loyalty','Justice','Learning','Joy',
  'Authenticity','Resilience','Balance','Leadership','Connection','Peace'
];

const SECTIONS = [
  { key:'coreValues',       icon:'💎', title:'Core Values',       label:'What matters most to you in life?',
    placeholder:'e.g. Family, Creativity, Integrity, Growth, Service...' },
  { key:'topStrengths',     icon:'💪', title:'Top Strengths',     label:'What do you do naturally well?',
    placeholder:'e.g. Empathy, Problem-solving, Communication, Leadership...' },
  { key:'passions',         icon:'🔥', title:'Passions',          label:'What lights you up? What could you do for hours?',
    placeholder:'e.g. Helping people, Building things, Writing, Teaching...' },
  { key:'impactStatement',  icon:'🌍', title:'Impact Statement',  label:'Finish the sentence: "I want to make the world better by..."',
    placeholder:'e.g. inspiring young people to believe in themselves...' },
  { key:'futureSelfVision', icon:'🔭', title:'Future Self Vision',label:'Describe yourself 5 years from now (vividly!)',
    placeholder:'e.g. I am living in a city I love, doing work that matters, surrounded by people who...' },
  { key:'legacyStatement',  icon:'🏛️', title:'Legacy Statement',  label:'What do you want to be remembered for?',
    placeholder:'e.g. I want to be remembered as someone who always lifted others up...' },
];

export default function PurposePage() {
  const [profile,    setProfile]    = useState(null);
  const [values,     setValues]     = useState([]);
  const [form,       setForm]       = useState({});
  const [tab,        setTab]        = useState('discover');
  const [saving,     setSaving]     = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [selectedVals, setSelectedVals] = useState([]);

  const load = async () => {
    try {
      const res = await purposeApi.getProfile();
      const { profile: p, values: v } = res.data.data;
      setProfile(p);
      setValues(v || []);
      if (p) setForm({
        coreValues:       p.coreValues       || '',
        topStrengths:     p.topStrengths     || '',
        passions:         p.passions         || '',
        impactStatement:  p.impactStatement  || '',
        futureSelfVision: p.futureSelfVision || '',
        legacyStatement:  p.legacyStatement  || '',
      });
      if (v?.length) setSelectedVals(v.map(vc => vc.value));
    } catch { /* start fresh */ }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await purposeApi.update(form);
      setProfile(res.data.data);
      toast.success('Saved! ✨');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await purposeApi.generate();
      setProfile(res.data.data);
      setTab('statement');
      toast.success('Your purpose statement is ready! 💜');
    } catch { toast.error('Failed to generate'); }
    setGenerating(false);
  };

  const toggleValue = (v) => {
    setSelectedVals(prev => prev.includes(v) ? prev.filter(x=>x!==v) : [...prev, v]);
  };

  const saveValues = async () => {
    const payload = selectedVals.map((v,i) => ({ value:v, priority:i+1 }));
    await purposeApi.saveValues(payload);
    toast.success('Values saved! 💎');
    load();
  };

  const completionPct = profile?.completionPercent || 0;

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🧭</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading your purpose profile...</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:920, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Purpose Discovery Center 🧭</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Discover your values, strengths, and the reason you're here.
        </p>
      </div>

      {/* Completion banner */}
      <div style={{ borderRadius:16, padding:'16px 24px', marginBottom:24,
        background:'linear-gradient(135deg,#f5f3ff,#ede9fe)', border:'1px solid #ddd6fe',
        display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontWeight:600, fontSize:14, color:'#7c3aed' }}>Profile Completion</span>
            <span style={{ fontWeight:700, color:'#7c3aed', fontSize:18 }}>{completionPct}%</span>
          </div>
          <div style={{ background:'rgba(124,58,237,0.15)', borderRadius:99, height:10, overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:99, background:'#7c3aed',
              width:`${completionPct}%`, transition:'width 0.8s ease' }} />
          </div>
        </div>
        {completionPct >= 50 && (
          <button onClick={generate} disabled={generating} className="btn btn-primary" style={{ flexShrink:0 }}>
            {generating ? '✨ Crafting...' : '✨ Generate My Purpose'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {[
          { id:'values',    label:'💎 Values' },
          { id:'discover',  label:'🔍 Discovery' },
          { id:'statement', label:'🌟 My Purpose' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`btn ${tab===t.id ? 'btn-primary' : 'btn-ghost'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* VALUES TAB */}
      {tab === 'values' && (
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>💎 What do you value most?</h3>
            <p style={{ color:'var(--text-secondary)', fontSize:13, marginBottom:20 }}>
              Select your top values. These are the principles that guide your decisions.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:20 }}>
              {PREDEFINED_VALUES.map(v => {
                const sel = selectedVals.includes(v);
                return (
                  <button key={v} onClick={() => toggleValue(v)} style={{
                    padding:'8px 16px', borderRadius:99, cursor:'pointer', fontSize:13,
                    border:`2px solid ${sel ? '#7c3aed' : 'var(--border)'}`,
                    background: sel ? '#7c3aed' : 'white',
                    color: sel ? 'white' : 'var(--text-primary)',
                    fontWeight: sel ? 600 : 400, transition:'all 0.15s'
                  }}>{v}</button>
                );
              })}
            </div>
            {selectedVals.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:13, fontWeight:600, color:'#7c3aed', marginBottom:8 }}>
                  Your selected values ({selectedVals.length}):
                </p>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {selectedVals.map((v,i) => (
                    <div key={v} style={{ display:'flex', alignItems:'center', gap:6,
                      padding:'6px 14px', borderRadius:99, background:'#ede9fe', color:'#7c3aed',
                      fontSize:12, fontWeight:600 }}>
                      <span style={{ opacity:.6 }}>#{i+1}</span> {v}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={saveValues} disabled={selectedVals.length === 0} className="btn btn-primary">
              💎 Save My Values
            </button>
          </div>

          {values.length > 0 && (
            <div className="card" style={{ background:'linear-gradient(135deg,#f8f7ff,#ede9fe)', border:'1px solid #ddd6fe' }}>
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:12, color:'#7c3aed' }}>Your Value Compass</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                {values.map(vc => (
                  <div key={vc.id} style={{ background:'white', borderRadius:12, padding:'12px 16px',
                    border:'1px solid #ddd6fe', display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:24, opacity:.8 }}>💎</span>
                    <div>
                      <p style={{ fontWeight:700, color:'#7c3aed', fontSize:14 }}>{vc.value}</p>
                      <p style={{ fontSize:10, color:'var(--text-muted)' }}>Priority #{vc.priority}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DISCOVERY TAB */}
      {tab === 'discover' && (
        <div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {SECTIONS.map(({ key, icon, title, label, placeholder }) => (
              <div key={key} className="card">
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <span style={{ fontSize:24 }}>{icon}</span>
                  <div>
                    <h3 style={{ fontFamily:'Poppins', fontWeight:600, fontSize:15 }}>{title}</h3>
                    <p style={{ fontSize:13, color:'var(--text-secondary)' }}>{label}</p>
                  </div>
                  {form[key] && <span style={{ marginLeft:'auto', fontSize:18 }}>✅</span>}
                </div>
                <textarea className="input" rows={3} style={{ resize:'vertical', lineHeight:1.7 }}
                  placeholder={placeholder}
                  value={form[key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            <button onClick={save} disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : '💾 Save Progress'}
            </button>
            {completionPct >= 50 && (
              <button onClick={generate} disabled={generating} className="btn btn-secondary">
                {generating ? '✨ Crafting...' : '✨ Generate My Purpose'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* PURPOSE STATEMENT TAB */}
      {tab === 'statement' && (
        <div>
          {!profile?.purposeStatement ? (
            <div className="card" style={{ textAlign:'center', padding:56 }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🌟</div>
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>Your purpose statement awaits</h3>
              <p style={{ color:'var(--text-secondary)', maxWidth:380, margin:'0 auto 24px', fontSize:14 }}>
                Complete at least 3 discovery sections, then click "Generate My Purpose" to craft your personal purpose statement.
              </p>
              <button onClick={() => setTab('discover')} className="btn btn-primary">
                Start Discovery →
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Purpose statement hero */}
              <div style={{ borderRadius:24, padding:'40px 36px', textAlign:'center',
                background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', color:'white' }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🌟</div>
                <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:20, marginBottom:20, opacity:.8 }}>
                  MY PURPOSE
                </h2>
                <p style={{ fontSize:17, lineHeight:1.9, maxWidth:600, margin:'0 auto', fontStyle:'italic' }}>
                  "{profile.purposeStatement}"
                </p>
              </div>

              {/* Next steps */}
              {profile.nextSteps && (
                <div className="card" style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0' }}>
                  <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:12, color:'#15803d' }}>
                    🚀 Your Next Steps
                  </h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {profile.nextSteps.split('|').map((step, i) => (
                      <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                        <div style={{ width:26, height:26, borderRadius:'50%', background:'#10b981',
                          color:'white', display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:12, fontWeight:700, flexShrink:0 }}>{i+1}</div>
                        <p style={{ fontSize:14, color:'#166534', paddingTop:3 }}>{step.trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display:'flex', gap:10 }}>
                <button onClick={generate} disabled={generating} className="btn btn-secondary">
                  {generating ? 'Regenerating...' : '🔄 Regenerate'}
                </button>
                <button onClick={() => setTab('discover')} className="btn btn-ghost">
                  ✏️ Edit Answers
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
