import React, { useState, useEffect } from 'react';
import { petApi } from '../services/api';
import toast from 'react-hot-toast';

const PET_TYPES = [
  { type: 'DOG',    emoji: '🐶', label: 'Dog',    desc: 'Loyal, energetic, always happy to see you' },
  { type: 'CAT',    emoji: '🐱', label: 'Cat',    desc: 'Calm, mysterious, independent yet loving' },
  { type: 'PANDA',  emoji: '🐼', label: 'Panda',  desc: 'Gentle, peaceful, loves bamboo and naps' },
  { type: 'RABBIT', emoji: '🐰', label: 'Rabbit', desc: 'Soft, curious, hops with joy' },
  { type: 'FOX',    emoji: '🦊', label: 'Fox',    desc: 'Smart, playful, full of surprises' },
];

const STAGE_META = {
  BABY:       { label: 'Baby',       stars: 1, color: '#10b981' },
  YOUNG:      { label: 'Young',      stars: 2, color: '#0ea5e9' },
  ADULT:      { label: 'Adult',      stars: 3, color: '#7c3aed' },
  WISE_ELDER: { label: 'Wise Elder', stars: 4, color: '#f59e0b' },
};

export default function VirtualPetPage() {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [acting, setActing]   = useState(null);
  const [form, setForm]       = useState({ name: '', petType: 'DOG' });

  const load = async () => {
    try {
      const res = await petApi.getStatus();
      setStatus(res.data.data);
    } catch { setStatus({ hasPet: false }); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createPet = async () => {
    if (!form.name.trim()) return toast.error('Give your pet a name!');
    setCreating(true);
    try {
      await petApi.create(form.name, form.petType);
      toast.success(`${form.name} is here! 🎉`);
      load();
    } catch (e) { toast.error(e?.message || 'Failed to create pet'); }
    setCreating(false);
  };

  const doAction = async (action, label) => {
    setActing(action);
    try {
      if (action === 'feed') await petApi.feed();
      else await petApi.play();
      toast.success(`${label} 🐾`);
      load();
    } catch { toast.error('Action failed'); }
    setActing(null);
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center', fontSize:56 }}>🐾</div>
    </div>
  );

  /* ── NO PET YET ─────────────────────────────────────────────────── */
  if (!status?.hasPet) return (
    <div style={{ maxWidth:640, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Virtual Pet 🐾</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Adopt a companion who grows with you. They never judge — only love.
        </p>
      </div>

      <div className="card" style={{ padding:32, textAlign:'center' }}>
        <div style={{ fontSize:72, marginBottom:16 }}>🥚</div>
        <h2 style={{ fontFamily:'Poppins', fontWeight:700, marginBottom:8 }}>Adopt Your Pet</h2>
        <p style={{ color:'var(--text-secondary)', marginBottom:28 }}>
          Choose a companion for your journey. They grow as you grow.
        </p>

        <div style={{ marginBottom:20 }}>
          <label className="label" style={{ textAlign:'left', display:'block' }}>Pet Name</label>
          <input className="input" placeholder="What will you call them?"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ maxWidth:320, margin:'0 auto', display:'block' }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:28 }}>
          {PET_TYPES.map(({ type, emoji, label, desc }) => (
            <button key={type} onClick={() => setForm({ ...form, petType: type })} style={{
              padding:'14px 8px', borderRadius:16,
              border:`2px solid ${form.petType===type ? '#7c3aed' : 'var(--border)'}`,
              background: form.petType===type ? '#f5f3ff' : 'white',
              cursor:'pointer', transition:'all 0.15s',
              transform: form.petType===type ? 'scale(1.06)' : 'scale(1)'
            }}>
              <div style={{ fontSize:32, marginBottom:6 }}>{emoji}</div>
              <div style={{ fontSize:12, fontWeight:600, color: form.petType===type ? '#7c3aed' : 'var(--text-primary)' }}>{label}</div>
            </button>
          ))}
        </div>

        {form.petType && (
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20, fontStyle:'italic' }}>
            "{PET_TYPES.find(p => p.type===form.petType)?.desc}"
          </p>
        )}

        <button onClick={createPet} disabled={creating || !form.name.trim()}
          className="btn btn-primary" style={{ padding:'12px 36px', fontSize:15 }}>
          {creating ? 'Hatching...' : `🥚 Adopt ${form.name || 'your pet'}`}
        </button>
      </div>
    </div>
  );

  /* ── PET EXISTS ──────────────────────────────────────────────────── */
  const { pet, emoji, message, stageLabel } = status;
  const stage = STAGE_META[pet?.stage] || STAGE_META.BABY;

  const happiness = pet?.happiness ?? 80;
  const energy    = pet?.energy    ?? 80;
  const totalXp   = pet?.totalXp   ?? 0;

  const nextStageXp = { BABY:50, YOUNG:200, ADULT:500, WISE_ELDER:Infinity }[pet?.stage] ?? 50;
  const prevStageXp = { BABY:0, YOUNG:50, ADULT:200, WISE_ELDER:500 }[pet?.stage] ?? 0;
  const stagePct    = Math.min(100, ((totalXp - prevStageXp) / (nextStageXp - prevStageXp)) * 100);

  return (
    <div style={{ maxWidth:720, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Virtual Pet 🐾</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Your companion grows when you journal, focus, and practice gratitude.
        </p>
      </div>

      {/* Main Pet Card */}
      <div className="card" style={{
        textAlign:'center', padding:'40px 32px', marginBottom:20,
        background:'linear-gradient(135deg,#fdf4ff,#f0fdf4,#eff6ff)',
        position:'relative', overflow:'hidden'
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160,
          borderRadius:'50%', background:'rgba(124,58,237,0.06)' }} />

        {/* Pet emoji */}
        <div style={{
          fontSize:96, lineHeight:1, marginBottom:8,
          animation:'float 3s ease-in-out infinite',
          filter:`drop-shadow(0 8px 16px rgba(0,0,0,0.15))`
        }}>{emoji}</div>

        <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:24, marginBottom:4 }}>{pet?.name}</h2>

        {/* Stage badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:6,
          padding:'4px 14px', borderRadius:99, background:`${stage.color}18`,
          border:`1px solid ${stage.color}44`, marginBottom:16 }}>
          <span style={{ color:stage.color, fontWeight:700, fontSize:13 }}>{stageLabel}</span>
          <span>{Array(stage.stars).fill('⭐').join('')}</span>
        </div>

        <p style={{ fontSize:15, color:'var(--text-secondary)', fontStyle:'italic', marginBottom:24 }}>
          "{message}"
        </p>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:360, margin:'0 auto 24px' }}>
          {[
            { label:'Happiness', value:happiness, color:'#ec4899', emoji:'😊' },
            { label:'Energy',    value:energy,    color:'#f59e0b', emoji:'⚡' },
          ].map(({ label, value, color, emoji: e }) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.8)', borderRadius:14, padding:'14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{e} {label}</span>
                <span style={{ fontWeight:700, color, fontSize:16 }}>{value}%</span>
              </div>
              <div style={{ background:'rgba(0,0,0,0.08)', borderRadius:99, height:8, overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:99, background:color,
                  width:`${value}%`, transition:'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Stage progress */}
        <div style={{ maxWidth:360, margin:'0 auto 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-secondary)', marginBottom:6 }}>
            <span>Stage Progress ({stageLabel})</span>
            <span style={{ fontWeight:600, color:stage.color }}>{totalXp} XP</span>
          </div>
          <div style={{ background:'var(--soft-gray)', borderRadius:99, height:8, overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:99, background:stage.color,
              width:`${pet?.stage==='WISE_ELDER' ? 100 : stagePct}%`, transition:'width 0.6s' }} />
          </div>
          {pet?.stage !== 'WISE_ELDER' && (
            <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:4, textAlign:'right' }}>
              {nextStageXp - totalXp} XP to next stage
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          {[
            { action:'feed', label:'Feed', emoji:'🍎', color:'#10b981', bg:'#dcfce7' },
            { action:'play', label:'Play', emoji:'🎾', color:'#7c3aed', bg:'#ede9fe' },
          ].map(({ action, label, emoji: e, color, bg }) => (
            <button key={action} onClick={() => doAction(action, `${e} ${label}!`)}
              disabled={acting === action}
              style={{ padding:'12px 28px', borderRadius:14, border:`2px solid ${color}44`,
                background:bg, color, fontWeight:600, fontSize:15, cursor:'pointer',
                display:'flex', alignItems:'center', gap:8, transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              <span style={{ fontSize:22 }}>{e}</span>
              {acting === action ? 'Loading...' : label}
            </button>
          ))}
        </div>
      </div>

      {/* How to grow */}
      <div className="card">
        <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14 }}>🌱 How to grow {pet?.name}</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { icon:'📓', action:'Write in journal', xp:'+10 XP + 😊 happiness' },
            { icon:'⚡', action:'Complete a habit',  xp:'+8 XP + ⚡ energy' },
            { icon:'🌱', action:'Add gratitude',     xp:'+5 XP + 😊 happiness' },
            { icon:'🌳', action:'Focus session',     xp:'+15 XP + ⚡ energy' },
            { icon:'😊', action:'Log your mood',     xp:'+5 XP' },
            { icon:'🤗', action:'Talk to SAATHI',    xp:'+5 XP + 😊 happiness' },
          ].map(({ icon, action, xp }) => (
            <div key={action} style={{ display:'flex', gap:10, padding:'10px 12px',
              background:'var(--soft-gray)', borderRadius:12, alignItems:'center' }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <div>
                <p style={{ fontSize:13, fontWeight:500 }}>{action}</p>
                <p style={{ fontSize:11, color:'var(--text-muted)' }}>{xp}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop:14, fontSize:12, color:'var(--text-secondary)', textAlign:'center', fontStyle:'italic' }}>
          💜 Your pet never punishes you for being away. They're just happy when you return.
        </p>
      </div>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>
    </div>
  );
}
