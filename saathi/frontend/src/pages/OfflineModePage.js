import React, { useState, useEffect } from 'react';
import { moodApi, journalApi, gratitudeApi } from '../services/api';
import toast from 'react-hot-toast';

const OFFLINE_KEY = 'saathi_offline_queue';
const oq = {
  add: (item) => { const q = JSON.parse(localStorage.getItem(OFFLINE_KEY)||'[]'); q.push({...item,id:Date.now(),timestamp:new Date().toISOString()}); localStorage.setItem(OFFLINE_KEY,JSON.stringify(q)); },
  get: () => JSON.parse(localStorage.getItem(OFFLINE_KEY)||'[]'),
  clear: () => localStorage.setItem(OFFLINE_KEY,'[]'),
};

export default function OfflineModePage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pending, setPending] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [tab, setTab] = useState('status');
  const [qf, setQf] = useState({ type:'MOOD', content:'', mood:'NEUTRAL' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const on = () => { setIsOnline(true); toast.success('Back online! 🌐'); };
    const off = () => { setIsOnline(false); toast.error('Offline — data saved locally.'); };
    window.addEventListener('online', on); window.addEventListener('offline', off);
    setPending(oq.get());
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const saveLocal = () => { oq.add(qf); setPending(oq.get()); setQf({type:'MOOD',content:'',mood:'NEUTRAL'}); toast.success('Saved offline 📦'); };

  const saveOnline = async () => {
    setSaving(true);
    try {
      if (qf.type === 'MOOD') {
        await moodApi.log({ mood:qf.mood, stressLevel:5, anxietyLevel:5, sleepHours:7, energyLevel:5, motivationLevel:5, focusLevel:5, entryDate:new Date().toISOString().split('T')[0] });
        toast.success('Mood logged! 😊');
      } else if (qf.type === 'JOURNAL') {
        await journalApi.create({ title:'Quick Note', content:qf.content, mood:'NEUTRAL', isPrivate:true });
        toast.success('Journal saved! 📓');
      } else if (qf.type === 'GRATITUDE') {
        await gratitudeApi.add({ content:qf.content, category:'Quick' });
        toast.success('Gratitude added! 🌱');
      }
      setQf({ type:'MOOD', content:'', mood:'NEUTRAL' });
    } catch { toast.error('Failed — saving offline instead'); saveLocal(); }
    setSaving(false);
  };

  const syncNow = async () => {
    const queue = oq.get();
    if (!queue.length) return toast('Nothing to sync!');
    setSyncing(true);
    let ok = 0, fail = 0;
    for (const item of queue) {
      try {
        if (item.type==='MOOD') await moodApi.log({mood:item.mood||'NEUTRAL',stressLevel:5,anxietyLevel:5,sleepHours:7,energyLevel:5,motivationLevel:5,focusLevel:5,entryDate:item.timestamp?.split('T')[0]||new Date().toISOString().split('T')[0]});
        else if (item.type==='JOURNAL') await journalApi.create({title:'Offline Note',content:item.content,isPrivate:true});
        else if (item.type==='GRATITUDE') await gratitudeApi.add({content:item.content,category:'Offline'});
        ok++;
      } catch { fail++; }
    }
    oq.clear(); setPending([]); setSyncResult({ok,fail,total:queue.length});
    toast.success(`Synced ${ok}/${queue.length} items!`);
    setSyncing(false);
  };

  return (
    <div style={{ maxWidth:800, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Offline Mode 🔄</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>SAATHI works offline. Log anything — it syncs when you reconnect.</p>
      </div>

      <div style={{ borderRadius:16, padding:'16px 22px', marginBottom:20,
        background:isOnline?'#f0fdf4':'#fef2f2', border:`1px solid ${isOnline?'#bbf7d0':'#fecaca'}`,
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:12, height:12, borderRadius:'50%', background:isOnline?'#10b981':'#ef4444' }} />
          <div>
            <p style={{ fontWeight:700, fontSize:14, color:isOnline?'#15803d':'#dc2626' }}>{isOnline?'Online — Sync active':'Offline — Saving locally'}</p>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:1 }}>{pending.length>0?`${pending.length} item(s) pending sync`:'All synced'}</p>
          </div>
        </div>
        {isOnline && pending.length>0 && <button onClick={syncNow} disabled={syncing} className="btn btn-primary" style={{ fontSize:13 }}>{syncing?'Syncing...':'🔄 Sync Now'}</button>}
      </div>

      {syncResult && (
        <div style={{ borderRadius:12, padding:'12px 16px', marginBottom:16, background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
          <p style={{ fontWeight:600, color:'#15803d' }}>✅ Sync complete: {syncResult.ok} succeeded, {syncResult.fail} failed</p>
        </div>
      )}

      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[{id:'status',label:'📊 Status'},{id:'capture',label:'✏️ Quick Capture'},{id:'queue',label:`📦 Queue (${pending.length})`}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`btn ${tab===t.id?'btn-primary':'btn-ghost'}`}>{t.label}</button>
        ))}
      </div>

      {tab==='status' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {[{label:'Connection',value:isOnline?'Online':'Offline',icon:isOnline?'🟢':'🔴',c:isOnline?'#10b981':'#ef4444',bg:isOnline?'#f0fdf4':'#fef2f2'},{label:'Pending Items',value:pending.length,icon:'📦',c:'#7c3aed',bg:'#f5f3ff'}].map(({label,value,icon,c,bg}) => (
            <div key={label} className="card" style={{ background:bg }}>
              <div style={{ fontSize:36, marginBottom:8 }}>{icon}</div>
              <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:28, color:c }}>{value}</p>
              <p style={{ fontSize:13, color:'var(--text-secondary)' }}>{label}</p>
            </div>
          ))}
          <div className="card" style={{ gridColumn:'1/-1' }}>
            <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:12 }}>How Offline Mode Works</h3>
            {[{icon:'📱',text:'Use Quick Capture to log moods, journal, and gratitude offline'},
              {icon:'💾',text:'Data is saved in your browser until you reconnect'},
              {icon:'🔄',text:'Tap "Sync Now" when online to upload everything'},
              {icon:'✅',text:'Your streak and XP are preserved — nothing is lost'}].map(({icon,text},i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'10px 12px', borderRadius:10, background:'var(--soft-gray)', marginBottom:8 }}>
                <span>{icon}</span><p style={{ fontSize:13, color:'var(--text-secondary)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='capture' && (
        <div className="card">
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14 }}>✏️ Quick Capture</h3>
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {['MOOD','JOURNAL','GRATITUDE'].map(t => (
              <button key={t} onClick={() => setQf(f=>({...f,type:t}))} style={{ padding:'8px 16px', borderRadius:99, fontSize:13, cursor:'pointer',
                border:`1.5px solid ${qf.type===t?'#7c3aed':'var(--border)'}`, background:qf.type===t?'#ede9fe':'transparent',
                color:qf.type===t?'#7c3aed':'var(--text-secondary)', fontWeight:qf.type===t?600:400 }}>
                {t==='MOOD'?'😊 Mood':t==='JOURNAL'?'📓 Journal':'🌱 Gratitude'}
              </button>
            ))}
          </div>
          {qf.type==='MOOD' ? (
            <div style={{ marginBottom:14 }}>
              <label className="label">How are you feeling?</label>
              <select className="input" value={qf.mood} onChange={e => setQf(f=>({...f,mood:e.target.value}))}>
                {['VERY_HAPPY','HAPPY','HOPEFUL','CALM','NEUTRAL','TIRED','ANXIOUS','SAD','VERY_SAD','ANGRY'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          ) : (
            <div style={{ marginBottom:14 }}>
              <label className="label">{qf.type==='JOURNAL'?'What\'s on your mind?':'What are you grateful for?'}</label>
              <textarea className="input" rows={4} style={{ resize:'none' }}
                placeholder={qf.type==='JOURNAL'?'Write freely...':'I am grateful for...'}
                value={qf.content} onChange={e => setQf(f=>({...f,content:e.target.value}))} />
            </div>
          )}
          <button onClick={isOnline?saveOnline:saveLocal} disabled={saving} className="btn btn-primary">
            {saving?'Saving...':isOnline?'💾 Save':'📦 Save Offline'}
          </button>
        </div>
      )}

      {tab==='queue' && (
        <div>
          {pending.length===0 ? (
            <div className="card" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
              <p style={{ fontWeight:600 }}>Queue is empty — all synced!</p>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginBottom:12 }}>
                {isOnline && <button onClick={syncNow} disabled={syncing} className="btn btn-primary" style={{ fontSize:13 }}>{syncing?'Syncing...':'🔄 Sync All'}</button>}
                <button onClick={() => { oq.clear(); setPending([]); toast.success('Cleared'); }} className="btn btn-ghost" style={{ fontSize:13, color:'#ef4444' }}>🗑️ Clear</button>
              </div>
              {pending.map((item,i) => (
                <div key={i} className="card" style={{ padding:'12px 16px', marginBottom:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                      <span style={{ fontSize:20 }}>{item.type==='MOOD'?'😊':item.type==='JOURNAL'?'📓':'🌱'}</span>
                      <div><p style={{ fontWeight:500, fontSize:13 }}>{item.type}</p><p style={{ fontSize:11, color:'var(--text-muted)' }}>{item.content?.slice(0,40)||item.mood||'—'}</p></div>
                    </div>
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
