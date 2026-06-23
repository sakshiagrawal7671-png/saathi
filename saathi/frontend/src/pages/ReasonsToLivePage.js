import React, { useState, useEffect } from 'react';
import { vaultApi } from '../services/api';
import { FiPlus, FiTrash2, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value:'DREAM',          label:'Dreams',           emoji:'🌟', color:'#7c3aed', bg:'#f5f3ff' },
  { value:'GOAL',           label:'Goals',            emoji:'🎯', color:'#0ea5e9', bg:'#eff6ff' },
  { value:'FAMILY_MEMORY',  label:'Family Memories',  emoji:'❤️', color:'#ef4444', bg:'#fef2f2' },
  { value:'FUTURE_PLAN',    label:'Future Plans',     emoji:'🗺️', color:'#10b981', bg:'#f0fdf4' },
  { value:'PERSON_I_LOVE',  label:'People I Love',    emoji:'👥', color:'#f97316', bg:'#fff7ed' },
  { value:'EXPERIENCE',     label:'Experiences',      emoji:'✈️', color:'#06b6d4', bg:'#ecfeff' },
  { value:'PROMISE_TO_SELF',label:'Promises to Myself',emoji:'🤝', color:'#8b5cf6', bg:'#faf5ff' },
  { value:'PLACE',          label:'Places',           emoji:'🌍', color:'#f59e0b', bg:'#fffbeb' },
  { value:'OTHER',          label:'Other',            emoji:'💜', color:'#ec4899', bg:'#fdf4ff' },
];

const PROMPTS = [
  "A place I still want to visit...",
  "Someone who needs me...",
  "A dream I haven't given up on...",
  "A meal I love...",
  "A season I want to experience again...",
  "A memory that makes me smile...",
  "Someone I want to hug again...",
  "Something I want to create...",
  "A promise I made to myself...",
  "A feeling I want to feel again...",
];

export default function ReasonsToLivePage() {
  const [reasons, setReasons] = useState([]);
  const [status,  setStatus]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form,    setForm]    = useState({ category:'DREAM', content:'', emoji:'💜' });
  const [saving,  setSaving]  = useState(false);
  const [filter,  setFilter]  = useState(null);
  const [tab,     setTab]     = useState('vault');

  const load = async () => {
    try {
      const [r, s] = await Promise.all([vaultApi.getReasons(), vaultApi.getStatus()]);
      setReasons(r.data.data || []);
      setStatus(s.data.data);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addReason = async () => {
    if (!form.content.trim()) return toast.error('Write something first');
    setSaving(true);
    try {
      await vaultApi.addReason(form);
      toast.success('Added to your vault 💜');
      setForm({ category:'DREAM', content:'', emoji:'💜' });
      setShowAdd(false);
      load();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const del = async (id) => {
    await vaultApi.deleteReason(id);
    toast.success('Removed');
    load();
  };

  const filtered = filter ? reasons.filter(r => r.category === filter) : reasons;
  const todayPrompt = PROMPTS[new Date().getDayOfYear ? new Date().getDayOfYear() % PROMPTS.length : new Date().getDate() % PROMPTS.length];
  const vaultLevel = status?.vaultLevel || 'STARTING';
  const LEVEL_META = {
    STARTING: { emoji:'🌱', label:'Just Starting', color:'#10b981' },
    GROWING:  { emoji:'🌿', label:'Growing',       color:'#0ea5e9' },
    STRONG:   { emoji:'🌳', label:'Strong Vault',  color:'#7c3aed' },
    THRIVING: { emoji:'🌟', label:'Thriving',      color:'#f59e0b' },
  };
  const lm = LEVEL_META[vaultLevel];

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>💜</div>
        <p style={{ color:'var(--text-secondary)' }}>Opening your vault...</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:960, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Reasons to Live Vault 💜</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          A private, beautiful collection of everything that makes your life worth living.
        </p>
      </div>

      {/* Vault Hero */}
      <div style={{
        borderRadius:24, padding:'32px', marginBottom:24, textAlign:'center',
        background:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', color:'white',
        position:'relative', overflow:'hidden'
      }}>
        {Array.from({length:20}).map((_,i) => (
          <div key={i} style={{ position:'absolute', top:`${Math.random()*90}%`, left:`${Math.random()*95}%`,
            width:2, height:2, borderRadius:'50%', background:'white', opacity:Math.random()*0.7+0.3 }} />
        ))}
        <div style={{ fontSize:64, marginBottom:12, position:'relative', zIndex:1 }}>🏛️</div>
        <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:24, marginBottom:4, position:'relative', zIndex:1 }}>
          {lm.emoji} {lm.label}
        </h2>
        <p style={{ opacity:.8, fontSize:15, marginBottom:20, position:'relative', zIndex:1 }}>
          {reasons.length} reason{reasons.length !== 1 ? 's' : ''} in your vault
        </p>
        <button onClick={() => setShowAdd(true)} style={{
          padding:'12px 32px', borderRadius:14, background:'rgba(255,255,255,0.15)',
          border:'2px solid rgba(255,255,255,0.4)', color:'white', fontWeight:700, fontSize:15, cursor:'pointer',
          backdropFilter:'blur(8px)', position:'relative', zIndex:1
        }}>
          <FiPlus style={{ marginRight:6, verticalAlign:'middle' }} />
          Add a Reason
        </button>
      </div>

      {/* Daily Prompt */}
      <div style={{ borderRadius:16, padding:'16px 22px', marginBottom:20,
        background:'linear-gradient(135deg,#fdf4ff,#fae8ff)', border:'1px solid #e9d5ff' }}>
        <p style={{ fontWeight:700, fontSize:11, color:'#7e22ce', letterSpacing:1, marginBottom:4 }}>TODAY'S PROMPT</p>
        <p style={{ fontSize:15, color:'#4c1d95', fontStyle:'italic' }}>"{todayPrompt}"</p>
        <button onClick={() => { setForm(f=>({...f,content:todayPrompt.replace('...','')+'...'})); setShowAdd(true); }}
          style={{ marginTop:10, padding:'6px 14px', borderRadius:99, border:'1px solid #c4b5fd',
            background:'#ede9fe', color:'#7c3aed', fontSize:12, cursor:'pointer', fontWeight:600 }}>
          ✏️ Answer this
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        <button onClick={() => setTab('vault')} className={`btn ${tab==='vault'?'btn-primary':'btn-ghost'}`}>💜 My Vault</button>
        <button onClick={() => setTab('why')} className={`btn ${tab==='why'?'btn-primary':'btn-ghost'}`}>🌟 Why I Matter</button>
      </div>

      {tab === 'vault' && (
        <div>
          {/* Category filter */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
            <button onClick={() => setFilter(null)} className={`btn ${!filter?'btn-primary':'btn-ghost'}`} style={{ fontSize:12 }}>All ({reasons.length})</button>
            {CATEGORIES.filter(c => reasons.some(r => r.category===c.value)).map(c => (
              <button key={c.value} onClick={() => setFilter(filter===c.value?null:c.value)} style={{
                padding:'5px 12px', borderRadius:99, fontSize:12, cursor:'pointer',
                border:`1.5px solid ${filter===c.value?c.color:'var(--border)'}`,
                background:filter===c.value?c.bg:'transparent', color:filter===c.value?c.color:'var(--text-secondary)'
              }}>{c.emoji} {c.label}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign:'center', padding:56 }}>
              <div style={{ fontSize:64, marginBottom:16 }}>💜</div>
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>Your vault awaits</h3>
              <p style={{ color:'var(--text-secondary)', maxWidth:340, margin:'0 auto 20px' }}>
                What makes your life worth living? Even one small thing counts.
              </p>
              <button onClick={() => setShowAdd(true)} className="btn btn-primary">
                <FiPlus /> Add First Reason
              </button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
              {filtered.map(r => {
                const cat = CATEGORIES.find(c => c.value===r.category) || CATEGORIES[8];
                return (
                  <div key={r.id} className="card" style={{ borderLeft:`4px solid ${cat.color}`, padding:'18px 20px',
                    background:`${cat.bg}`, transition:'transform 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                          <span style={{ fontSize:22 }}>{r.emoji}</span>
                          <span style={{ fontSize:11, fontWeight:700, color:cat.color, letterSpacing:.5 }}>{cat.label.toUpperCase()}</span>
                        </div>
                        <p style={{ fontSize:15, color:'#1c1917', lineHeight:1.6, fontStyle:'italic' }}>"{r.content}"</p>
                        <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:6 }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button onClick={() => del(r.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', marginLeft:8, padding:'4px' }}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'why' && <WhyIMatterTab />}

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div className="card" style={{ width:'100%', maxWidth:520 }}>
            <h2 style={{ fontFamily:'Poppins', fontWeight:700, marginBottom:6 }}>Add to Your Vault 💜</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:13, marginBottom:20 }}>
              Even the smallest reason matters.
            </p>

            <div style={{ marginBottom:14 }}>
              <label className="label">Category</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.value} onClick={() => setForm(f=>({...f,category:c.value,emoji:c.emoji}))} style={{
                    padding:'8px', borderRadius:10, textAlign:'center', cursor:'pointer',
                    border:`2px solid ${form.category===c.value?c.color:'var(--border)'}`,
                    background:form.category===c.value?c.bg:'white', transition:'all 0.12s'
                  }}>
                    <div style={{ fontSize:20 }}>{c.emoji}</div>
                    <div style={{ fontSize:10, fontWeight:600, color:form.category===c.value?c.color:'var(--text-secondary)', marginTop:2 }}>{c.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              <label className="label">Your reason</label>
              <textarea className="input" rows={4} style={{ resize:'none', lineHeight:1.7 }}
                placeholder="Write anything — a dream, a person, a place, a feeling..."
                value={form.content} onChange={e => setForm(f=>({...f,content:e.target.value}))} />
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={addReason} disabled={saving||!form.content.trim()} className="btn btn-primary">
                {saving?'Saving...':'💜 Add to Vault'}
              </button>
              <button onClick={() => setShowAdd(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WhyIMatterTab() {
  const [data,   setData]   = useState(null);
  const [saving, setSaving] = useState(false);
  const [form,   setForm]   = useState({});

  useEffect(() => {
    vaultApi.getWhyIMatter().then(r => { const d=r.data.data; setData(d);
      setForm({ peopleWhoLoveMe:d?.peopleWhoLoveMe||'', peopleILove:d?.peopleILove||'',
        myDreams:d?.myDreams||'', myAchievements:d?.myAchievements||'',
        happyMemories:d?.happyMemories||'', futureGoals:d?.futureGoals||'', myStrengths:d?.myStrengths||'' });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try { await vaultApi.updateWhyIMatter(form); toast.success('Saved 💜'); }
    catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const FIELDS = [
    { key:'peopleWhoLoveMe',  label:'People who love me',    placeholder:'My mom, my best friend, my dog...',     emoji:'❤️' },
    { key:'peopleILove',      label:'People I love',         placeholder:'Everyone I care about deeply...',        emoji:'💗' },
    { key:'myDreams',         label:'My dreams',             placeholder:'Things I still want to do and become...', emoji:'🌟' },
    { key:'myAchievements',   label:'Things I am proud of',  placeholder:'Small or big — they all count...',       emoji:'🏆' },
    { key:'happyMemories',    label:'Happy memories',        placeholder:'Moments that made me genuinely happy...', emoji:'😊' },
    { key:'futureGoals',      label:'My future goals',       placeholder:'What I am working toward...',             emoji:'🎯' },
    { key:'myStrengths',      label:'My strengths',          placeholder:'Things I do well, qualities I have...',   emoji:'💪' },
  ];

  return (
    <div>
      <div style={{ borderRadius:16, padding:'20px 24px', marginBottom:20,
        background:'linear-gradient(135deg,#fef2f2,#fff7ed)', border:'1px solid #fecdd3' }}>
        <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:16, color:'#9a3412', marginBottom:6 }}>
          🌟 Why You Matter
        </p>
        <p style={{ fontSize:13, color:'#c2410c', lineHeight:1.7 }}>
          This page is for hard days. Fill it now so your future self can read it when they need to remember.
          You are more important than you know.
        </p>
        {data && <div style={{ marginTop:10, background:'rgba(255,255,255,0.7)', borderRadius:10, padding:'8px 12px', display:'inline-block' }}>
          <span style={{ fontSize:13, fontWeight:600, color:'#7c3aed' }}>{data.completionPercent}% complete</span>
        </div>}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {FIELDS.map(({ key, label, placeholder, emoji }) => (
          <div key={key} className="card" style={{ padding:'18px 20px' }}>
            <label className="label" style={{ fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:20 }}>{emoji}</span> {label}
            </label>
            <textarea className="input" rows={3} style={{ resize:'vertical', lineHeight:1.7 }}
              placeholder={placeholder} value={form[key]||''}
              onChange={e => setForm(f=>({...f,[key]:e.target.value}))} />
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="btn btn-primary" style={{ marginTop:16, padding:'12px 32px' }}>
        {saving?'Saving...':'💜 Save My Why'}
      </button>

      <div className="card" style={{ marginTop:16, background:'linear-gradient(135deg,#f8f7ff,#ede9fe)', border:'1px solid #ddd6fe', textAlign:'center' }}>
        <p style={{ fontSize:14, color:'#5b21b6', lineHeight:1.8 }}>
          💜 If you are in a dark moment right now — please open the Comfort Room.
          The people who love you need you here. Your story is not finished.
        </p>
      </div>
    </div>
  );
}
