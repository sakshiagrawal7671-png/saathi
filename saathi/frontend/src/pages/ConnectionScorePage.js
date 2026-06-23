import React, { useState, useEffect } from 'react';
import { connectionApi } from '../services/api';
import toast from 'react-hot-toast';

const TYPE_META = {
  FAMILY_CONTACT:           { label:'Family Contact',          icon:'❤️', color:'#ef4444', desc:'Called, messaged, or visited family' },
  MEANINGFUL_CONVERSATION:  { label:'Meaningful Conversation',  icon:'💬', color:'#0ea5e9', desc:'A real, deep conversation with someone' },
  KINDNESS_ACT:             { label:'Act of Kindness',          icon:'🤝', color:'#10b981', desc:'Did something kind for someone' },
  COMMUNITY_SUPPORT:        { label:'Community Support',        icon:'🌍', color:'#06b6d4', desc:'Supported someone in the community' },
  FRIEND_CONNECTION:        { label:'Friend Connection',        icon:'👫', color:'#f97316', desc:'Connected with a friend' },
  GRATITUDE_SHARED:         { label:'Shared Gratitude',         icon:'🙏', color:'#f59e0b', desc:'Expressed thanks to someone directly' },
  COMPANION_CHAT:           { label:'SAATHI Chat',              icon:'🤗', color:'#7c3aed', desc:'Talked to your AI companion' },
};

const LEVEL_META = {
  'Deeply Connected':    { color:'#10b981', emoji:'🌟' },
  'Well Connected':      { color:'#0ea5e9', emoji:'😊' },
  'Building Connections':{ color:'#f59e0b', emoji:'🌱' },
  'Room to Grow':        { color:'#94a3b8', emoji:'🌤️' },
};

export default function ConnectionScorePage() {
  const [score,  setScore]  = useState(null);
  const [logs,   setLogs]   = useState([]);
  const [loading,setLoading]= useState(true);
  const [logging,setLogging]= useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('MEANINGFUL_CONVERSATION');
  const [description, setDescription] = useState('');

  const load = async () => {
    const [s, l] = await Promise.all([connectionApi.getScore(), connectionApi.getLogs()]);
    setScore(s.data.data);
    setLogs(l.data.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const quickLog = async (type) => {
    setLogging(type);
    try {
      await connectionApi.log(type, '');
      toast.success(`${TYPE_META[type].label} logged! ${TYPE_META[type].icon}`);
      load();
    } catch { toast.error('Failed to log'); }
    setLogging(null);
  };

  const logWithDesc = async () => {
    try {
      await connectionApi.log(selectedType, description);
      toast.success('Connection logged! 💜');
      setShowForm(false); setDescription('');
      load();
    } catch { toast.error('Failed to log'); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>❤️</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading your connections...</p>
      </div>
    </div>
  );

  const levelMeta = LEVEL_META[score?.level] || LEVEL_META['Room to Grow'];

  return (
    <div style={{ maxWidth:900, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Human Connection Score ❤️</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          No followers. No likes. Just real connection — measured in moments that matter.
        </p>
      </div>

      {/* Score hero */}
      <div style={{ borderRadius:24, padding:'36px', marginBottom:24, textAlign:'center',
        background:`linear-gradient(135deg, ${levelMeta.color}15, ${levelMeta.color}30)`,
        border:`1px solid ${levelMeta.color}44`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-50, right:-50, width:180, height:180,
          borderRadius:'50%', background:`${levelMeta.color}15` }} />

        {/* Circular score */}
        <div style={{ position:'relative', width:160, height:160, margin:'0 auto 16px' }}>
          <svg width="160" height="160" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="68" fill="none" stroke="var(--soft-gray)" strokeWidth="14" />
            <circle cx="80" cy="80" r="68" fill="none" stroke={levelMeta.color} strokeWidth="14"
              strokeDasharray={`${2*Math.PI*68}`}
              strokeDashoffset={`${2*Math.PI*68*(1-(score?.weeklyScore||0)/100)}`}
              strokeLinecap="round" style={{ transition:'stroke-dashoffset 1s ease' }} />
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:36, fontWeight:700, fontFamily:'Poppins', color:levelMeta.color }}>
              {score?.weeklyScore || 0}
            </span>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>/ 100</span>
          </div>
        </div>

        <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:22, color:levelMeta.color, marginBottom:6 }}>
          {levelMeta.emoji} {score?.level}
        </h2>
        <p style={{ color:'var(--text-secondary)', fontSize:14, maxWidth:400, margin:'0 auto' }}>
          {score?.message}
        </p>

        <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:20, flexWrap:'wrap' }}>
          {[
            { label:'This Week', value:score?.weekConnections || 0, icon:'📅' },
            { label:'This Month', value:score?.monthConnections || 0, icon:'🗓️' },
            { label:'Family This Week', value:score?.familyContactsThisWeek || 0, icon:'❤️' },
            { label:'In Your Circle', value:score?.familyMembersCount || 0, icon:'👥' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.6)', borderRadius:12, padding:'10px 16px' }}>
              <p style={{ fontSize:20, fontWeight:700, fontFamily:'Poppins', color:levelMeta.color }}>{icon} {value}</p>
              <p style={{ fontSize:11, color:'var(--text-secondary)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick log buttons */}
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, fontSize:15 }}>Log a Connection</h3>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-ghost" style={{ fontSize:12 }}>
            {showForm ? 'Hide note' : '+ Add note'}
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom: showForm ? 16 : 0 }}>
          {Object.entries(TYPE_META).map(([type, meta]) => (
            <button key={type} onClick={() => showForm ? setSelectedType(type) : quickLog(type)}
              disabled={logging === type}
              style={{
                padding:'14px 10px', borderRadius:14, textAlign:'center', cursor:'pointer',
                border:`2px solid ${selectedType===type && showForm ? meta.color : 'var(--border)'}`,
                background: selectedType===type && showForm ? `${meta.color}18` : 'white',
                transition:'all 0.15s'
              }}
              onMouseEnter={e => !showForm && (e.currentTarget.style.transform='translateY(-2px)')}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              <div style={{ fontSize:26, marginBottom:4 }}>{meta.icon}</div>
              <p style={{ fontSize:11, fontWeight:600, color: selectedType===type && showForm ? meta.color : 'var(--text-primary)' }}>
                {logging===type ? '...' : meta.label}
              </p>
              <p style={{ fontSize:9, color:'var(--text-muted)', marginTop:2 }}>+{
                {FAMILY_CONTACT:15,MEANINGFUL_CONVERSATION:12,KINDNESS_ACT:10,COMMUNITY_SUPPORT:10,
                 FRIEND_CONNECTION:12,GRATITUDE_SHARED:8,COMPANION_CHAT:5}[type]
              } XP</p>
            </button>
          ))}
        </div>

        {showForm && (
          <div>
            <textarea className="input" rows={2} style={{ resize:'none', marginBottom:10 }}
              placeholder={`Optional note about your ${TYPE_META[selectedType].label.toLowerCase()}...`}
              value={description} onChange={e => setDescription(e.target.value)} />
            <button onClick={logWithDesc} className="btn btn-primary"
              style={{ background:TYPE_META[selectedType].color, borderColor:TYPE_META[selectedType].color }}>
              {TYPE_META[selectedType].icon} Log {TYPE_META[selectedType].label}
            </button>
          </div>
        )}
      </div>

      {/* Breakdown */}
      {score?.breakdown && (
        <div className="card" style={{ marginBottom:20 }}>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14, fontSize:15 }}>This Week's Breakdown</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {Object.entries(score.breakdown).map(([type, count]) => {
              const meta = TYPE_META[type];
              const max = Math.max(1, ...Object.values(score.breakdown));
              return (
                <div key={type} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:18, width:24 }}>{meta.icon}</span>
                  <span style={{ fontSize:12, width:160, color:'var(--text-secondary)' }}>{meta.label}</span>
                  <div style={{ flex:1, background:'var(--soft-gray)', borderRadius:99, height:8, overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:99, background:meta.color,
                      width:`${(count/max)*100}%`, transition:'width 0.6s' }} />
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:meta.color, width:24, textAlign:'right' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="card">
        <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14, fontSize:15 }}>Recent Connections</h3>
        {logs.length === 0 ? (
          <div style={{ textAlign:'center', padding:32 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🌱</div>
            <p style={{ color:'var(--text-secondary)', fontSize:13 }}>Start logging connections to build your score</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {logs.slice(0,10).map((log,i) => {
              const meta = TYPE_META[log.type];
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
                  borderRadius:10, background:'var(--soft-gray)' }}>
                  <span style={{ fontSize:20 }}>{meta?.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:500 }}>{meta?.label}</p>
                    {log.description && <p style={{ fontSize:11, color:'var(--text-muted)' }}>{log.description}</p>}
                  </div>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>
                    {new Date(log.createdAt).toLocaleDateString('en',{month:'short',day:'numeric'})}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop:20, textAlign:'center',
        background:'linear-gradient(135deg,#fef2f2,#fff7ed)', border:'1px solid #fecdd3' }}>
        <p style={{ fontSize:13, color:'#9a3412', lineHeight:1.7 }}>
          💜 This score is for YOU — a gentle reminder to nurture relationships, not a competition.
          There's no "perfect" score. Connection looks different for everyone.
        </p>
      </div>
    </div>
  );
}
