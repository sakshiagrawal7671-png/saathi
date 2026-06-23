import React, { useState, useEffect } from 'react';
import { memoriesApi } from '../services/api';
import { FiPlus, FiTrash2, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value:'ACHIEVEMENT',       label:'Achievement',       emoji:'🏆', color:'#f59e0b', bg:'#fffbeb' },
  { value:'FAMILY_MOMENT',     label:'Family Moment',     emoji:'❤️', color:'#ef4444', bg:'#fef2f2' },
  { value:'FRIENDSHIP',        label:'Friendship',        emoji:'🤝', color:'#10b981', bg:'#f0fdf4' },
  { value:'ADVENTURE',         label:'Adventure',         emoji:'✈️', color:'#06b6d4', bg:'#ecfeff' },
  { value:'MILESTONE',         label:'Milestone',         emoji:'🎯', color:'#7c3aed', bg:'#f5f3ff' },
  { value:'KINDNESS_RECEIVED', label:'Kindness Received', emoji:'🌸', color:'#ec4899', bg:'#fdf4ff' },
  { value:'LOVE',              label:'Love',              emoji:'💗', color:'#e11d48', bg:'#fff1f2' },
  { value:'PERSONAL_GROWTH',   label:'Personal Growth',   emoji:'🌱', color:'#84cc16', bg:'#f7fee7' },
  { value:'NATURE',            label:'Nature',            emoji:'🌿', color:'#16a34a', bg:'#f0fdf4' },
  { value:'CELEBRATION',       label:'Celebration',       emoji:'🎉', color:'#f97316', bg:'#fff7ed' },
  { value:'OTHER',             label:'Other',             emoji:'😊', color:'#8b5cf6', bg:'#faf5ff' },
];

const BG_COLORS = ['#fef9c3','#fce7f3','#dbeafe','#dcfce7','#ede9fe','#fff7ed','#fdf4ff','#ecfeff'];

export default function PositiveMemoryVaultPage() {
  const [memories, setMemories] = useState([]);
  const [stats,    setStats]    = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ title:'', description:'', category:'ACHIEVEMENT', emoji:'😊', memoryDate:'' });
  const [saving,   setSaving]   = useState(false);
  const [filter,   setFilter]   = useState(null);
  const [view,     setView]     = useState('timeline'); // timeline | grid
  const [loading,  setLoading]  = useState(true);

  const load = async () => {
    try {
      const [m, s] = await Promise.all([memoriesApi.getAll(), memoriesApi.getStats()]);
      setMemories(m.data.data || []);
      setStats(s.data.data);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const addMemory = async () => {
    if (!form.title.trim()) return toast.error('Give your memory a title');
    setSaving(true);
    try {
      await memoriesApi.add(form);
      toast.success('Memory saved! 😊');
      setShowForm(false);
      setForm({ title:'', description:'', category:'ACHIEVEMENT', emoji:'😊', memoryDate:'' });
      load();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const pin = async (id) => {
    await memoriesApi.togglePin(id);
    load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this memory?')) return;
    await memoriesApi.delete(id);
    toast.success('Memory removed');
    load();
  };

  const pinned   = memories.filter(m => m.pinned);
  const unpinned = memories.filter(m => !m.pinned);
  const filtered = filter
    ? memories.filter(m => m.category === filter)
    : [...pinned, ...unpinned];

  const LEVEL_META = {
    BEGINNING: { emoji:'🌱', color:'#10b981' },
    GROWING:   { emoji:'🌿', color:'#0ea5e9' },
    RICH:      { emoji:'🌳', color:'#7c3aed' },
    ABUNDANT:  { emoji:'🌟', color:'#f59e0b' },
  };
  const lm = LEVEL_META[stats?.vaultLevel] || LEVEL_META.BEGINNING;

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>😊</div>
        <p style={{ color:'var(--text-secondary)' }}>Opening your memory vault...</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Positive Memory Vault 😊</h1>
          <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
            A collection of your happiest moments. Return here whenever you need a reminder of the good.
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <FiPlus /> Add Memory
        </button>
      </div>

      {/* Stats banner */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {[
          { label:'Total Memories',   value:stats?.totalMemories || 0,  icon:lm.emoji,  color:lm.color },
          { label:'Pinned',           value:stats?.pinnedCount   || 0,  icon:'📌',      color:'#f59e0b' },
          { label:'Categories Used',  value:Object.keys(stats?.byCategory || {}).length, icon:'🌈', color:'#7c3aed' },
          { label:'Vault Level',      value:stats?.vaultLevel    || 'BEGINNING', icon:'🏛️', color:'#10b981' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card" style={{ padding:'16px 18px', textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
            <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:20, color }}>{value}</p>
            <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          <button onClick={() => setFilter(null)} className={`btn ${!filter?'btn-primary':'btn-ghost'}`} style={{ fontSize:11 }}>
            All ({memories.length})
          </button>
          {CATEGORIES.filter(c => memories.some(m => m.category===c.value)).map(c => (
            <button key={c.value} onClick={() => setFilter(filter===c.value?null:c.value)} style={{
              padding:'5px 10px', borderRadius:99, fontSize:11, cursor:'pointer',
              border:`1.5px solid ${filter===c.value?c.color:'var(--border)'}`,
              background:filter===c.value?c.bg:'transparent', color:filter===c.value?c.color:'var(--text-secondary)'
            }}>{c.emoji}</button>
          ))}
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['timeline','grid'].map(v => (
            <button key={v} onClick={() => setView(v)} className={`btn ${view===v?'btn-primary':'btn-ghost'}`} style={{ padding:'6px 12px', fontSize:12 }}>
              {v==='timeline'?'📅 Timeline':'⊞ Grid'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:56 }}>
          <div style={{ fontSize:64, marginBottom:16 }}>💝</div>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>Your vault is waiting</h3>
          <p style={{ color:'var(--text-secondary)', maxWidth:360, margin:'0 auto 24px', fontSize:14, lineHeight:1.7 }}>
            Every good moment in your life deserves to be remembered. Start building your collection.
          </p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> First Memory</button>
        </div>
      ) : view === 'timeline' ? (
        /* Timeline view */
        <div style={{ position:'relative' }}>
          {/* Timeline line */}
          <div style={{ position:'absolute', left:28, top:0, bottom:0, width:2, background:'linear-gradient(180deg,#7c3aed,#a78bfa,#f97316)', borderRadius:99 }} />

          {filtered.map((memory, i) => {
            const cat = CATEGORIES.find(c => c.value===memory.category) || CATEGORIES[10];
            return (
              <div key={memory.id} style={{ display:'flex', gap:20, marginBottom:20, paddingLeft:4 }}>
                {/* Node */}
                <div style={{ width:48, height:48, borderRadius:'50%', background:`linear-gradient(135deg,${cat.color},${cat.color}aa)`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
                  flexShrink:0, zIndex:1, boxShadow:`0 4px 12px ${cat.color}44` }}>
                  {memory.emoji || cat.emoji}
                </div>

                {/* Card */}
                <div className="card" style={{ flex:1, padding:'16px 20px',
                  background:BG_COLORS[i % BG_COLORS.length],
                  borderLeft:`3px solid ${cat.color}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                        <h3 style={{ fontWeight:700, fontSize:15 }}>{memory.title}</h3>
                        {memory.pinned && <span style={{ fontSize:14 }}>📌</span>}
                      </div>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        <span style={{ fontSize:11, fontWeight:600, color:cat.color, padding:'2px 8px', borderRadius:99, background:`${cat.color}18` }}>
                          {cat.label}
                        </span>
                        {memory.memoryDate && (
                          <span style={{ fontSize:11, color:'var(--text-muted)' }}>
                            📅 {new Date(memory.memoryDate).toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'})}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => pin(memory.id)} style={{ background:'none', border:'none', cursor:'pointer',
                        fontSize:16, opacity: memory.pinned ? 1 : 0.4 }}>⭐</button>
                      <button onClick={() => del(memory.id)} style={{ background:'none', border:'none', cursor:'pointer',
                        color:'var(--text-muted)', fontSize:14 }}><FiTrash2 size={13} /></button>
                    </div>
                  </div>
                  {memory.description && (
                    <p style={{ fontSize:14, color:'var(--text-primary)', lineHeight:1.7, marginTop:6, fontStyle:'italic' }}>
                      "{memory.description}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid view */
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {filtered.map((memory, i) => {
            const cat = CATEGORIES.find(c => c.value===memory.category) || CATEGORIES[10];
            return (
              <div key={memory.id} className="card" style={{ padding:'18px', cursor:'default',
                background:BG_COLORS[i % BG_COLORS.length], borderTop:`4px solid ${cat.color}`,
                transition:'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform='none'}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:32 }}>{memory.emoji || cat.emoji}</span>
                  <div style={{ display:'flex', gap:4 }}>
                    <button onClick={() => pin(memory.id)} style={{ background:'none', border:'none', cursor:'pointer',
                      fontSize:14, opacity:memory.pinned?1:0.3 }}>⭐</button>
                    <button onClick={() => del(memory.id)} style={{ background:'none', border:'none', cursor:'pointer',
                      color:'var(--text-muted)' }}><FiTrash2 size={12}/></button>
                  </div>
                </div>
                <p style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{memory.title}</p>
                {memory.description && (
                  <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.5, marginBottom:6 }}>
                    {memory.description.slice(0,80)}{memory.description.length>80?'...':''}
                  </p>
                )}
                <span style={{ fontSize:10, fontWeight:600, color:cat.color }}>{cat.emoji} {cat.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Add form modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div className="card" style={{ width:'100%', maxWidth:540, maxHeight:'90vh', overflowY:'auto' }}>
            <h2 style={{ fontFamily:'Poppins', fontWeight:700, marginBottom:20 }}>Add a Happy Memory 😊</h2>

            <div style={{ marginBottom:14 }}>
              <label className="label">Title</label>
              <input className="input" placeholder="What happened?" value={form.title}
                onChange={e => setForm(f=>({...f,title:e.target.value}))} />
            </div>

            <div style={{ marginBottom:14 }}>
              <label className="label">Category</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.value} onClick={() => setForm(f=>({...f,category:c.value,emoji:c.emoji}))} style={{
                    padding:'8px 4px', borderRadius:10, textAlign:'center', cursor:'pointer',
                    border:`2px solid ${form.category===c.value?c.color:'var(--border)'}`,
                    background:form.category===c.value?c.bg:'white'
                  }}>
                    <div style={{ fontSize:18 }}>{c.emoji}</div>
                    <div style={{ fontSize:9, fontWeight:600, color:form.category===c.value?c.color:'var(--text-secondary)', marginTop:2 }}>{c.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:14 }}>
              <label className="label">When did this happen?</label>
              <input className="input" type="date" value={form.memoryDate}
                onChange={e => setForm(f=>({...f,memoryDate:e.target.value}))} />
            </div>

            <div style={{ marginBottom:20 }}>
              <label className="label">Describe the memory</label>
              <textarea className="input" rows={4} style={{ resize:'none', lineHeight:1.7 }}
                placeholder="Paint the picture. What made it special? How did you feel?"
                value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={addMemory} disabled={saving||!form.title.trim()} className="btn btn-primary">
                {saving?'Saving...':'😊 Save Memory'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
