import React, { useState, useEffect } from 'react';
import { dreamApi } from '../services/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value:'CAREER',       label:'Career',       icon:'💼', color:'#0ea5e9' },
  { value:'HOME',         label:'Dream Home',   icon:'🏠', color:'#10b981' },
  { value:'TRAVEL',       label:'Travel',       icon:'✈️', color:'#f97316' },
  { value:'LIFESTYLE',    label:'Lifestyle',    icon:'🌟', color:'#7c3aed' },
  { value:'RELATIONSHIP', label:'Relationship', icon:'❤️', color:'#ef4444' },
  { value:'HEALTH',       label:'Health',       icon:'💪', color:'#84cc16' },
  { value:'EDUCATION',    label:'Education',    icon:'📚', color:'#8b5cf6' },
  { value:'CREATIVE',     label:'Creative',     icon:'🎨', color:'#ec4899' },
  { value:'FINANCIAL',    label:'Financial',    icon:'💰', color:'#f59e0b' },
  { value:'OTHER',        label:'Other',        icon:'⭐', color:'#a78bfa' },
];

const TOWER_STAGES = {
  FOUNDATION:   { emoji:'🪨', label:'Foundation',  desc:'Add your first dream to start building' },
  GROUND_FLOOR: { emoji:'🏗️', label:'Ground Floor', desc:'Your tower is taking shape' },
  RISING:       { emoji:'🏢', label:'Rising',       desc:'Your dreams are stacking up!' },
  TALL:         { emoji:'🏙️', label:'Tall Tower',   desc:'You dream big — keep going!' },
  SKY_HIGH:     { emoji:'🗼', label:'Sky-High',     desc:'Your tower touches the clouds!' },
};

export default function DreamTowerPage() {
  const [dreams, setDreams]   = useState([]);
  const [tower,  setTower]    = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', category:'LIFESTYLE' });
  const [saving, setSaving]   = useState(false);
  const [filter, setFilter]   = useState(null);

  const load = async () => {
    const [d, t] = await Promise.all([dreamApi.getAll(), dreamApi.getTower()]);
    setDreams(d.data.data || []);
    setTower(t.data.data);
  };
  useEffect(() => { load(); }, []);

  const addDream = async () => {
    if (!form.title.trim()) return toast.error('Give your dream a title');
    setSaving(true);
    try {
      await dreamApi.add(form);
      toast.success('Dream added to your tower! 🏰');
      setShowForm(false);
      setForm({ title:'', description:'', category:'LIFESTYLE' });
      load();
    } catch { toast.error('Failed to add dream'); }
    setSaving(false);
  };

  const updateProgress = async (id, progress) => {
    await dreamApi.updateProgress(id, progress);
    load();
  };

  const del = async (id) => {
    if (!window.confirm('Remove this dream?')) return;
    await dreamApi.delete(id);
    toast.success('Dream removed');
    load();
  };

  const stage = TOWER_STAGES[tower?.towerStage] || TOWER_STAGES.FOUNDATION;
  const filtered = filter ? dreams.filter(d => d.category === filter) : dreams;

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Dream Tower 🏰</h1>
          <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
            Every dream is a floor. Build your tower to the sky.
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <FiPlus /> Add Dream
        </button>
      </div>

      {/* Tower Visual */}
      <div style={{
        borderRadius:24, padding:'32px', marginBottom:24, textAlign:'center',
        background:'linear-gradient(160deg,#0f0c29,#302b63,#24243e)',
        color:'white', position:'relative', overflow:'hidden'
      }}>
        {/* Stars */}
        {Array.from({ length:20 }).map((_, i) => (
          <div key={i} style={{
            position:'absolute',
            top:`${Math.random()*80+5}%`, left:`${Math.random()*90+5}%`,
            width:2, height:2, borderRadius:'50%', background:'white',
            opacity:Math.random()*0.8+0.2,
            animation:`twinkle ${Math.random()*3+2}s ease-in-out infinite ${Math.random()*2}s`
          }} />
        ))}

        <div style={{ fontSize:80, marginBottom:8, position:'relative', zIndex:1 }}>
          {stage.emoji}
        </div>
        <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:22, marginBottom:4 }}>
          {stage.label}
        </h2>
        <p style={{ opacity:.8, fontSize:14, marginBottom:24 }}>{stage.desc}</p>

        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', position:'relative', zIndex:1 }}>
          {[
            { label:'Dreams',    value:tower?.totalDreams ?? 0,    icon:'🌟' },
            { label:'Completed', value:tower?.completedDreams ?? 0, icon:'🏆' },
            { label:'Avg Progress', value:`${tower?.avgProgress ?? 0}%`, icon:'📈' },
            { label:'Floors',    value:tower?.towerFloors ?? 0,    icon:'🏢' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.12)', borderRadius:14,
              padding:'12px 20px', backdropFilter:'blur(8px)' }}>
              <p style={{ fontSize:11, opacity:.7, marginBottom:2 }}>{label}</p>
              <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:20 }}>{icon} {value}</p>
            </div>
          ))}
        </div>

        {/* Tower floors visualization */}
        {dreams.length > 0 && (
          <div style={{ marginTop:24, display:'flex', justifyContent:'center', gap:4,
            flexWrap:'wrap', maxWidth:500, margin:'24px auto 0' }}>
            {dreams.map((d, i) => {
              const cat = CATEGORIES.find(c => c.value===d.category) || CATEGORIES[9];
              return (
                <div key={d.id} title={d.title} style={{
                  width:40, height:40, borderRadius:10,
                  background:`${cat.color}cc`, border:`2px solid ${cat.color}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:18, cursor:'default', position:'relative'
                }}>
                  {cat.icon}
                  {d.progressPercent === 100 && (
                    <div style={{ position:'absolute', top:-6, right:-6, width:16, height:16,
                      borderRadius:'50%', background:'#10b981', fontSize:10,
                      display:'flex', alignItems:'center', justifyContent:'center' }}>✓</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        <button onClick={() => setFilter(null)}
          className={`btn ${!filter ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize:12 }}>
          All ({dreams.length})
        </button>
        {CATEGORIES.filter(c => dreams.some(d => d.category===c.value)).map(c => (
          <button key={c.value} onClick={() => setFilter(filter===c.value ? null : c.value)}
            style={{ padding:'6px 14px', borderRadius:99,
              border:`1.5px solid ${filter===c.value ? c.color : 'var(--border)'}`,
              background: filter===c.value ? `${c.color}18` : 'transparent',
              color: filter===c.value ? c.color : 'var(--text-secondary)',
              cursor:'pointer', fontSize:12 }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Dreams Grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:56 }}>
          <div style={{ fontSize:64, marginBottom:16 }}>🌌</div>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>Your tower awaits</h3>
          <p style={{ color:'var(--text-secondary)', maxWidth:340, margin:'0 auto 20px' }}>
            What do you dream of? A home, a journey, a career, a life? Add it here.
          </p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <FiPlus /> Add First Dream
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {filtered.map(dream => {
            const cat = CATEGORIES.find(c => c.value===dream.category) || CATEGORIES[9];
            return (
              <div key={dream.id} className="card" style={{
                borderTop:`4px solid ${cat.color}`,
                padding:'20px 22px'
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <span style={{ fontSize:28 }}>{cat.icon}</span>
                    <div>
                      <h3 style={{ fontWeight:700, fontSize:15 }}>{dream.title}</h3>
                      <span style={{ fontSize:11, color:cat.color, fontWeight:500 }}>{cat.label}</span>
                    </div>
                  </div>
                  <button onClick={() => del(dream.id)} className="btn btn-ghost"
                    style={{ padding:'4px 6px', color:'#ef4444' }}>
                    <FiTrash2 size={13} />
                  </button>
                </div>

                {dream.description && (
                  <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:12, lineHeight:1.6 }}>
                    {dream.description}
                  </p>
                )}

                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                    <span style={{ color:'var(--text-secondary)' }}>Progress</span>
                    <span style={{ fontWeight:700, color:cat.color }}>{dream.progressPercent}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={dream.progressPercent}
                    onChange={e => updateProgress(dream.id, Number(e.target.value))}
                    style={{ width:'100%', accentColor:cat.color, cursor:'pointer' }} />
                </div>

                {dream.progressPercent === 100 && (
                  <div style={{ marginTop:10, padding:'8px 12px', background:'#f0fdf4',
                    borderRadius:10, display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:18 }}>🏆</span>
                    <p style={{ fontSize:13, color:'#15803d', fontWeight:500 }}>Dream achieved!</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Form Modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div className="card" style={{ width:'100%', maxWidth:520 }}>
            <h2 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:20 }}>Add a Dream 🌌</h2>
            <div style={{ marginBottom:14 }}>
              <label className="label">What do you dream of?</label>
              <input className="input" placeholder="e.g. Live in a house by the sea..."
                value={form.title} onChange={e => setForm({ ...form, title:e.target.value })} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label className="label">Describe it vividly</label>
              <textarea className="input" rows={3} style={{ resize:'none' }}
                placeholder="Paint the picture of this dream in your mind..."
                value={form.description} onChange={e => setForm({ ...form, description:e.target.value })} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label className="label">Category</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.value} onClick={() => setForm({ ...form, category:c.value })} style={{
                    padding:'10px 6px', borderRadius:12, textAlign:'center',
                    border:`2px solid ${form.category===c.value ? c.color : 'var(--border)'}`,
                    background: form.category===c.value ? `${c.color}18` : 'white',
                    cursor:'pointer', fontSize:20, transition:'all 0.15s'
                  }} title={c.label}>{c.icon}</button>
                ))}
              </div>
              <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:6 }}>
                Selected: {CATEGORIES.find(c => c.value===form.category)?.label}
              </p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={addDream} disabled={saving} className="btn btn-primary">
                {saving ? 'Adding...' : '🌌 Add to Tower'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.2} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
