import React, { useState, useEffect } from 'react';
import { innerCircleApi } from '../services/api';
import { FiPlus, FiTrash2, FiPhone, FiMessageCircle, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AVATARS = ['🧑','👩','👨','👧','👦','👵','👴','🧔','👩‍🦱','👨‍🦳'];
const RELATIONSHIPS = ['Best Friend','Close Friend','Partner','Mom','Dad','Sister','Brother','Mentor','Colleague','Other'];

export default function InnerCirclePage() {
  const [members, setMembers] = useState([]);
  const [showForm,setShowForm]= useState(false);
  const [form,    setForm]    = useState({ name:'', relationship:'Best Friend', avatarEmoji:'🧑', phone:'', sharedMemories:'', importantDate:'', importantDateLabel:'' });
  const [saving,  setSaving]  = useState(false);
  const [selected,setSelected]= useState(null);

  const load = () => innerCircleApi.get().then(r => setMembers(r.data.data||[])).catch(()=>{});
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name.trim()) return toast.error('Enter a name');
    setSaving(true);
    try {
      await innerCircleApi.add(form);
      toast.success(`${form.name} added to your inner circle 💜`);
      setShowForm(false); setForm({ name:'', relationship:'Best Friend', avatarEmoji:'🧑', phone:'', sharedMemories:'', importantDate:'', importantDateLabel:'' });
      load();
    } catch (e) { toast.error(e?.message || 'Failed'); }
    setSaving(false);
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Remove ${name} from your circle?`)) return;
    await innerCircleApi.remove(id);
    toast.success('Removed');
    load();
    if (selected?.id === id) setSelected(null);
  };

  const recordInteraction = async (id, name) => {
    await innerCircleApi.recordInteraction(id);
    toast.success(`Marked as interacted with ${name} 💜`);
    load();
  };

  const daysSince = (dt) => {
    if (!dt) return null;
    return Math.floor((Date.now() - new Date(dt)) / 86400000);
  };

  return (
    <div style={{ maxWidth:960, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Inner Circle 💜</h1>
          <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
            Your 5-10 most trusted people. Nurture these relationships intentionally.
          </p>
        </div>
        {members.length < 10 && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> Add Person</button>
        )}
      </div>

      {/* Circle stats */}
      <div style={{ borderRadius:20, padding:'22px 28px', marginBottom:24,
        background:'linear-gradient(135deg,#fef2f2,#fff7ed,#fdf4ff)', border:'1px solid #fecdd3' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
          <span style={{ fontSize:32 }}>❤️</span>
          <div>
            <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:18, color:'#9a3412' }}>Your Trusted Circle</h2>
            <p style={{ fontSize:13, color:'#c2410c' }}>{members.length}/10 people — these are your anchors</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {members.map(m => (
            <div key={m.id} onClick={() => setSelected(m)} style={{
              width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#fce7f3,#ede9fe)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:26,
              cursor:'pointer', border:`3px solid ${selected?.id===m.id?'#7c3aed':'transparent'}`,
              transition:'transform 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}
              title={m.name}>
              {m.avatarEmoji}
            </div>
          ))}
          {members.length < 10 && (
            <button onClick={() => setShowForm(true)} style={{
              width:52, height:52, borderRadius:'50%', border:'2px dashed #fca5a5',
              background:'transparent', cursor:'pointer', fontSize:22, color:'#ef4444'
            }}>+</button>
          )}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:selected?'1fr 1.5fr':'1fr', gap:20 }}>
        {/* Members list */}
        <div>
          {members.length === 0 ? (
            <div className="card" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:56, marginBottom:16 }}>❤️</div>
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>Build your circle</h3>
              <p style={{ color:'var(--text-secondary)', maxWidth:320, margin:'0 auto 20px', fontSize:14 }}>
                Add the people you trust most. 5-10 is the ideal size for genuine connection.
              </p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> Add First Person</button>
            </div>
          ) : members.map(m => {
            const ds = daysSince(m.lastInteractionAt);
            const needsContact = ds === null || ds > 7;
            return (
              <div key={m.id} className="card" style={{
                marginBottom:10, cursor:'pointer',
                borderColor:selected?.id===m.id?'#7c3aed':'var(--border)',
                background:selected?.id===m.id?'#faf5ff':'white'
              }} onClick={() => setSelected(selected?.id===m.id?null:m)}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#fce7f3,#ede9fe)',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>
                    {m.avatarEmoji}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:15 }}>{m.name}</p>
                    <p style={{ fontSize:12, color:'var(--text-secondary)' }}>{m.relationship}</p>
                    {needsContact ? (
                      <p style={{ fontSize:11, color:'#dc2626', marginTop:2 }}>
                        {ds===null?'Never recorded — reach out!':ds > 7?`${ds} days ago — time to reconnect!`:''}
                      </p>
                    ) : (
                      <p style={{ fontSize:11, color:'#10b981', marginTop:2 }}>✓ {ds}d ago</p>
                    )}
                  </div>
                  <button onClick={e=>{e.stopPropagation();remove(m.id,m.name);}}
                    className="btn btn-ghost" style={{ padding:'4px 6px', color:'#ef4444' }}>
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card" style={{ position:'sticky', top:0, height:'fit-content' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
              <div style={{ width:64, height:64, borderRadius:18, background:'linear-gradient(135deg,#fce7f3,#ede9fe)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>
                {selected.avatarEmoji}
              </div>
              <div>
                <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:20 }}>{selected.name}</h2>
                <p style={{ color:'var(--text-secondary)', fontSize:13 }}>{selected.relationship}</p>
              </div>
            </div>

            {selected.sharedMemories && (
              <div style={{ padding:'12px 14px', borderRadius:12, background:'#fdf4ff', marginBottom:14 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#7e22ce', marginBottom:4 }}>SHARED MEMORIES</p>
                <p style={{ fontSize:13, color:'#4c1d95', lineHeight:1.6 }}>{selected.sharedMemories}</p>
              </div>
            )}

            {selected.importantDate && (
              <div style={{ padding:'10px 14px', borderRadius:12, background:'#fffbeb', marginBottom:14, border:'1px solid #fde68a' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#92400e', marginBottom:2 }}>
                  {selected.importantDateLabel || 'IMPORTANT DATE'}
                </p>
                <p style={{ fontSize:13, color:'#78350f', fontWeight:600 }}>{selected.importantDate}</p>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <button onClick={() => recordInteraction(selected.id, selected.name)} className="btn btn-primary" style={{ justifyContent:'center', gap:8 }}>
                <FiHeart size={14} /> Record Interaction
              </button>
              {selected.phone && (
                <>
                  <button onClick={() => window.open(`tel:${selected.phone}`)} className="btn btn-ghost" style={{ gap:8 }}>
                    <FiPhone size={14} /> Call {selected.name}
                  </button>
                  <button onClick={() => {
                    window.open(`https://wa.me/${selected.phone.replace(/[^0-9]/g,'')}?text=Hey ${selected.name}! Just thinking of you 💜`);
                    recordInteraction(selected.id, selected.name);
                  }} style={{ padding:'10px 16px', borderRadius:12, border:'1px solid #86efac', background:'#dcfce7', color:'#16a34a', cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontWeight:500 }}>
                    <FiMessageCircle size={14} /> WhatsApp
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div className="card" style={{ width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto' }}>
            <h2 style={{ fontFamily:'Poppins', fontWeight:700, marginBottom:20 }}>Add to Inner Circle 💜</h2>

            <div style={{ marginBottom:14 }}>
              <label className="label">Avatar</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setForm(f=>({...f,avatarEmoji:a}))} style={{
                    padding:'8px 10px', borderRadius:10, fontSize:22, cursor:'pointer',
                    border:`2px solid ${form.avatarEmoji===a?'#7c3aed':'var(--border)'}`,
                    background:form.avatarEmoji===a?'#ede9fe':'white'
                  }}>{a}</button>
                ))}
              </div>
            </div>

            {[{k:'name',l:'Name *',p:'Their name',required:true},{k:'phone',l:'Phone',p:'+91...'},{k:'importantDate',l:'Important Date',p:'',t:'date'},{k:'importantDateLabel',l:'Date Label',p:'e.g. Birthday'}].map(({k,l,p,t,required}) => (
              <div key={k} style={{ marginBottom:12 }}>
                <label className="label">{l}</label>
                <input className="input" type={t||'text'} placeholder={p} value={form[k]}
                  onChange={e => setForm(f=>({...f,[k]:e.target.value}))} required={required} />
              </div>
            ))}

            <div style={{ marginBottom:12 }}>
              <label className="label">Relationship</label>
              <select className="input" value={form.relationship} onChange={e=>setForm(f=>({...f,relationship:e.target.value}))}>
                {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:20 }}>
              <label className="label">Shared Memories / Notes</label>
              <textarea className="input" rows={3} style={{ resize:'none' }}
                placeholder="A memory you share, why they matter to you..."
                value={form.sharedMemories} onChange={e => setForm(f=>({...f,sharedMemories:e.target.value}))} />
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={add} disabled={saving||!form.name.trim()} className="btn btn-primary">
                {saving?'Adding...':'💜 Add to Circle'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
