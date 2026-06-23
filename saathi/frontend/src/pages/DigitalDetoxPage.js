import React, { useState, useEffect, useRef } from 'react';
import { detoxApi } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_META = {
  HEALTHY:  { color:'#10b981', bg:'#f0fdf4', emoji:'🌿', label:'Healthy' },
  MODERATE: { color:'#f59e0b', bg:'#fffbeb', emoji:'🌤️', label:'Moderate' },
  HIGH:     { color:'#f97316', bg:'#fff7ed', emoji:'⚠️', label:'High Usage' },
  OVER:     { color:'#ef4444', bg:'#fef2f2', emoji:'🔴', label:'Limit Reached' },
};

export default function DigitalDetoxPage() {
  const [usage, setUsage] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [goal, setGoal] = useState(null);
  const [tab, setTab] = useState('today');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [goalForm, setGoalForm] = useState({ dailyLimitMinutes:60, breakIntervalMinutes:25, breakRemindersEnabled:true, weekendDetoxEnabled:false });
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionMins, setSessionMins] = useState(0);
  const timerRef = useRef(null);

  const load = async () => {
    try {
      const [u, w, g] = await Promise.all([detoxApi.getTodayUsage(), detoxApi.getWeeklyReport(), detoxApi.getGoal()]);
      setUsage(u.data.data); setWeekly(w.data.data);
      const g2 = g.data.data; setGoal(g2);
      setGoalForm({ dailyLimitMinutes:g2?.dailyLimitMinutes||60, breakIntervalMinutes:g2?.breakIntervalMinutes||25,
        breakRemindersEnabled:g2?.breakRemindersEnabled??true, weekendDetoxEnabled:g2?.weekendDetoxEnabled||false });
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); return () => clearInterval(timerRef.current); }, []);

  const startSess = async () => { await detoxApi.startSession(); setSessionActive(true); setSessionMins(0);
    timerRef.current = setInterval(() => setSessionMins(m => m+1), 60000); toast.success('Session started 🌿'); };
  const endSess = async () => { await detoxApi.endSession(); clearInterval(timerRef.current); setSessionActive(false); setSessionMins(0); load(); toast.success('Session logged ✓'); };
  const saveGoal = async () => { await detoxApi.updateGoal(goalForm); toast.success('Goal updated! 🌿'); setEditing(false); load(); };

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}><div style={{textAlign:'center'}}><div style={{fontSize:56}}>🌿</div><p style={{color:'var(--text-secondary)',marginTop:12}}>Loading...</p></div></div>;

  const s = STATUS_META[usage?.status] || STATUS_META.HEALTHY;
  const pct = usage?.percentUsed || 0;
  const days = weekly?.weeklyData || [];
  const maxDay = Math.max(...days.map(d => d.minutes), 1);

  return (
    <div style={{ maxWidth:860, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Digital Detox 🌿</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>SAATHI encourages mindful use. Real life matters more than any app.</p>
      </div>

      <div style={{ borderRadius:16, padding:'16px 22px', marginBottom:20, background:'#f0fdf4', border:'1px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontWeight:700, fontSize:14, color:'#15803d' }}>{sessionActive ? `🟢 Session Active — ${sessionMins} min` : '⚫ No Active Session'}</p>
          <p style={{ fontSize:12, color:'#6b7280', marginTop:2 }}>Track your SAATHI usage to stay mindful</p>
        </div>
        <button onClick={sessionActive ? endSess : startSess} className={`btn ${sessionActive ? 'btn-ghost' : 'btn-primary'}`} style={{ color:sessionActive?'#10b981':undefined, borderColor:sessionActive?'#10b981':undefined, fontSize:13 }}>
          {sessionActive ? '⏹ End Session' : '▶ Start Session'}
        </button>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[{id:'today',label:'📊 Today'},{id:'weekly',label:'📅 This Week'},{id:'settings',label:'⚙️ My Goal'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`btn ${tab===t.id?'btn-primary':'btn-ghost'}`}>{t.label}</button>
        ))}
      </div>

      {tab==='today' && usage && (
        <div>
          <div style={{ borderRadius:20, padding:'28px 32px', marginBottom:20, textAlign:'center', background:s.bg, border:`1px solid ${s.color}30` }}>
            <div style={{ fontSize:56, marginBottom:8 }}>{s.emoji}</div>
            <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:22, color:s.color, marginBottom:6 }}>{s.label}</h2>
            <p style={{ color:'#374151', fontSize:14, marginBottom:20 }}>{usage.message}</p>
            <div style={{ position:'relative', width:160, height:160, margin:'0 auto 20px' }}>
              <svg width="160" height="160" style={{ transform:'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="65" fill="none" stroke="#e5e7eb" strokeWidth="14" />
                <circle cx="80" cy="80" r="65" fill="none" stroke={s.color} strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*65}`} strokeDashoffset={`${2*Math.PI*65*(1-Math.min(pct,100)/100)}`}
                  style={{ transition:'stroke-dashoffset 1s' }} />
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:28, fontWeight:700, fontFamily:'Poppins', color:s.color }}>{usage.todayMinutes}</span>
                <span style={{ fontSize:11, color:'var(--text-muted)' }}>/ {usage.limitMinutes} min</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:16, justifyContent:'center' }}>
              {[{label:'Minutes today',value:usage.todayMinutes,c:s.color},{label:'Remaining',value:usage.remainingMinutes,c:'#10b981'}].map(({label,value,c}) => (
                <div key={label} style={{ background:'rgba(255,255,255,0.7)', borderRadius:12, padding:'10px 18px' }}>
                  <p style={{ fontSize:20, fontWeight:700, color:c }}>{value}</p>
                  <p style={{ fontSize:11, color:'#6b7280' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ background:'linear-gradient(135deg,#fef9c3,#fef3c7)', border:'1px solid #fde68a' }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <span style={{ fontSize:28 }}>🌍</span>
              <div><p style={{ fontWeight:700, fontSize:11, color:'#92400e' }}>INSTEAD, TRY THIS</p><p style={{ fontSize:15, color:'#78350f' }}>{usage.suggestedActivity}</p></div>
            </div>
          </div>
        </div>
      )}

      {tab==='weekly' && weekly && (
        <div className="card">
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:6 }}>7-Day Usage</h3>
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>{weekly.insight}</p>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:120, marginBottom:12 }}>
            {days.map((d,i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:10, color:d.overLimit?'#ef4444':'#10b981', fontWeight:700 }}>{d.minutes}m</span>
                <div style={{ width:'100%', borderRadius:'5px 5px 0 0', background:d.overLimit?'#ef4444':'#10b981',
                  height:`${Math.max(4,(d.minutes/maxDay)*80)}px`, opacity:d.minutes===0?0.3:1 }} />
                <span style={{ fontSize:10, color:'var(--text-muted)' }}>{d.dayName}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:8 }}>
            {[{label:'Total',value:`${weekly.totalMinutes}m`,icon:'⏱️',c:'#7c3aed'},{label:'Daily Avg',value:`${weekly.avgDailyMinutes}m`,icon:'📊',c:'#0ea5e9'},{label:'Days Over',value:weekly.daysOverLimit,icon:'⚠️',c:weekly.daysOverLimit>3?'#ef4444':'#10b981'}].map(({label,value,icon,c})=>(
              <div key={label} style={{ padding:'12px', borderRadius:12, background:'var(--soft-gray)', textAlign:'center' }}>
                <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:20, color:c }}>{icon} {value}</p>
                <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='settings' && (
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontFamily:'Poppins', fontWeight:600 }}>⚙️ My Detox Goal</h3>
            {!editing && <button onClick={() => setEditing(true)} className="btn btn-ghost" style={{ fontSize:13 }}>✏️ Edit</button>}
          </div>
          {editing ? (
            <div>
              <div style={{ marginBottom:16 }}>
                <label className="label">Daily Limit: <strong>{goalForm.dailyLimitMinutes} min</strong></label>
                <input type="range" min="15" max="240" step="15" value={goalForm.dailyLimitMinutes}
                  onChange={e => setGoalForm(f=>({...f,dailyLimitMinutes:Number(e.target.value)}))}
                  style={{ width:'100%', accentColor:'#7c3aed', marginTop:8 }} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label className="label">Break Interval: <strong>{goalForm.breakIntervalMinutes} min</strong></label>
                <input type="range" min="10" max="60" step="5" value={goalForm.breakIntervalMinutes}
                  onChange={e => setGoalForm(f=>({...f,breakIntervalMinutes:Number(e.target.value)}))}
                  style={{ width:'100%', accentColor:'#10b981', marginTop:8 }} />
              </div>
              {[{key:'breakRemindersEnabled',label:'Break reminders'},{key:'weekendDetoxEnabled',label:'Weekend detox mode'}].map(({key,label}) => (
                <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', borderRadius:12, background:'var(--soft-gray)', marginBottom:10 }}>
                  <span style={{ fontSize:14, fontWeight:500 }}>{label}</span>
                  <input type="checkbox" checked={goalForm[key]} onChange={e => setGoalForm(f=>({...f,[key]:e.target.checked}))} style={{ width:20, height:20, accentColor:'#7c3aed', cursor:'pointer' }} />
                </div>
              ))}
              <div style={{ display:'flex', gap:10, marginTop:16 }}>
                <button onClick={saveGoal} className="btn btn-primary">Save Goal</button>
                <button onClick={() => setEditing(false)} className="btn btn-ghost">Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[{l:'Daily Limit',v:`${goal?.dailyLimitMinutes||60} minutes`},{l:'Break Interval',v:`Every ${goal?.breakIntervalMinutes||25} minutes`},{l:'Break Reminders',v:goal?.breakRemindersEnabled?'On':'Off'},{l:'Weekend Detox',v:goal?.weekendDetoxEnabled?'On':'Off'}].map(({l,v}) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'12px 14px', borderRadius:12, background:'var(--soft-gray)' }}>
                  <span style={{ color:'var(--text-secondary)', fontSize:14 }}>{l}</span>
                  <span style={{ fontWeight:600, fontSize:14 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop:16, padding:'12px 16px', borderRadius:12, background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
            <p style={{ fontSize:13, color:'#15803d', lineHeight:1.7 }}>💜 No guilt if you go over. This is for awareness, not punishment. Mindful use — not restriction.</p>
          </div>
        </div>
      )}
    </div>
  );
}
