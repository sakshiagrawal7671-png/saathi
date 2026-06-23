import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { dashboardApi, rpgApi, moodApi, habitApi, notificationApi } from '../services/api';
import toast from 'react-hot-toast';

const MOOD_EMOJI = { VERY_HAPPY:'😄', HAPPY:'😊', CALM:'😌', HOPEFUL:'🌟', NEUTRAL:'😐',
  TIRED:'😴', ANXIOUS:'😰', SAD:'😢', VERY_SAD:'😭', ANGRY:'😠' };
const MOOD_COLOR = { VERY_HAPPY:'#10b981', HAPPY:'#34d399', CALM:'#60a5fa', HOPEFUL:'#a78bfa',
  NEUTRAL:'#fbbf24', TIRED:'#94a3b8', ANXIOUS:'#fb923c', SAD:'#818cf8', VERY_SAD:'#f472b6', ANGRY:'#f87171' };

const QUICK_ACTIONS = [
  { label:'Mood',       icon:'😊', path:'/mood',       color:'#0ea5e9', desc:'How are you?' },
  { label:'Journal',    icon:'📓', path:'/journal',    color:'#10b981', desc:'Write freely' },
  { label:'SAATHI AI',  icon:'🤗', path:'/companion',  color:'#7c3aed', desc:'Talk to me' },
  { label:'Habits',     icon:'⚡', path:'/habits',     color:'#f59e0b', desc:'Stay consistent' },
  { label:'Goals',      icon:'🎯', path:'/goals',      color:'#ef4444', desc:'Aim higher' },
  { label:'Life RPG',   icon:'⚔️', path:'/rpg',        color:'#8b5cf6', desc:'Level up' },
  { label:'Gratitude',  icon:'🌱', path:'/gratitude',  color:'#84cc16', desc:'Find the good' },
  { label:'Family',     icon:'❤️', path:'/family',     color:'#f97316', desc:'Stay connected' },
  { label:'Surprise',   icon:'🎁', path:'/surprise',   color:'#ec4899', desc:'Daily gift' },
  { label:'Life Map',   icon:'🗺️', path:'/life-map',   color:'#06b6d4', desc:'Your journey' },
  { label:'Coloring',   icon:'🎨', path:'/coloring',   color:'#a855f7', desc:'Calm your mind' },
  { label:'Relax',      icon:'🎵', path:'/relax',      color:'#14b8a6', desc:'Ambient sounds' },
];

const DAILY_QUOTES = [
  { text:"Small steps every day lead to big results.", author:"Unknown" },
  { text:"You don't have to be perfect to be amazing.", author:"Unknown" },
  { text:"Growth is choosing discomfort over stagnation.", author:"Unknown" },
  { text:"Your feelings are valid. Your progress is real.", author:"SAATHI" },
  { text:"Rest is not giving up. It's gearing up.", author:"Unknown" },
  { text:"Every expert was once a beginner.", author:"Unknown" },
];

export default function DashboardPage() {
  const navigate  = useNavigate();
  const { user }  = useSelector(s => s.auth);
  const [data,    setData]    = useState(null);
  const [rpg,     setRpg]     = useState(null);
  const [moods,   setMoods]   = useState([]);
  const [habits,  setHabits]  = useState([]);
  const [unread,  setUnread]  = useState(0);
  const [loading, setLoading] = useState(true);

  const quote = DAILY_QUOTES[new Date().getDate() % DAILY_QUOTES.length];
  const hour  = new Date().getHours();
  const greeting = hour < 5 ? 'Still up, night owl' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night';
  const name  = user?.fullName?.split(' ')[0] || 'Friend';

  useEffect(() => {
    (async () => {
      try {
        const [d, r, m, h, n] = await Promise.allSettled([
          dashboardApi.get(), rpgApi.getProfile(), moodApi.getHistory(),
          habitApi.getAll(), notificationApi.getUnreadCount(),
        ]);
        if (d.status==='fulfilled') setData(d.value.data.data);
        if (r.status==='fulfilled') setRpg(r.value.data.data);
        if (m.status==='fulfilled') setMoods((m.value.data.data||[]).slice(0,7));
        if (h.status==='fulfilled') setHabits((h.value.data.data||[]).slice(0,4));
        if (n.status==='fulfilled') setUnread(n.value.data.data||0);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:64, marginBottom:12, animation:'float 2s ease-in-out infinite' }}>🌟</div>
          <p style={{ color:'var(--text-secondary)', fontFamily:'Poppins', fontWeight:600 }}>Loading your world...</p>
        </div>
      </div>
  );

  return (
      <div style={{ maxWidth:1100, margin:'0 auto', animation:'pageIn 0.4s ease' }}>

        {/* ── HERO BANNER ─────────────────────────── */}
        <div style={{
          borderRadius:24, padding:'32px 36px', marginBottom:24, position:'relative', overflow:'hidden',
          background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 70%,#7c3aed 100%)',
          boxShadow:'0 12px 40px rgba(124,58,237,0.35)',
        }}>
          {/* Stars */}
          {Array.from({length:25}).map((_,i)=>(
              <div key={i} style={{ position:'absolute',
                top:`${Math.random()*90}%`, left:`${Math.random()*95}%`,
                width: i%3===0?3:2, height: i%3===0?3:2,
                borderRadius:'50%', background:'white',
                opacity:Math.random()*0.6+0.2,
                animation:`pulseSlow ${2+Math.random()*3}s ease-in-out infinite`,
              }}/>
          ))}

          {/* Notification badge */}
          {unread > 0 && (
              <button onClick={() => navigate('/notifications')} style={{
                position:'absolute', top:20, right:20,
                padding:'6px 14px', borderRadius:99,
                background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
                color:'white', fontSize:12, fontWeight:700, cursor:'pointer',
                backdropFilter:'blur(8px)',
              }}>
                🔔 {unread} new
              </button>
          )}

          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ color:'rgba(196,181,253,0.85)', fontSize:14, marginBottom:4 }}>
              {greeting},
            </p>
            <h1 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:34, color:'white', marginBottom:8, lineHeight:1.2 }}>
              {name} ✨
            </h1>
            <p style={{ color:'rgba(196,181,253,0.7)', fontSize:14, fontStyle:'italic', marginBottom:24, maxWidth:500 }}>
              "{quote.text}"
            </p>

            {/* Stats row */}
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {[
                { label:'Level',  value:`${user?.level||1}`,           icon:'⚔️',  color:'#fbbf24' },
                { label:'XP',     value:`${user?.xpPoints||0}`,        icon:'⭐',  color:'#a78bfa' },
                { label:'Streak', value:`${user?.streakDays||0} days`, icon:'🔥',  color:'#fb923c' },
                { label:'Mood',   value:data?.todayMood?MOOD_EMOJI[data.todayMood]:'—', icon:'', color:'#34d399' },
              ].map(({label,value,icon,color})=>(
                  <div key={label} style={{
                    padding:'10px 18px', borderRadius:14,
                    background:'rgba(255,255,255,0.10)',
                    backdropFilter:'blur(8px)',
                    border:'1px solid rgba(255,255,255,0.15)',
                    minWidth:80, textAlign:'center',
                  }}>
                    <p style={{ fontSize:18, fontWeight:800, color, fontFamily:'Poppins' }}>{icon} {value}</p>
                    <p style={{ fontSize:10, color:'rgba(196,181,253,0.7)', marginTop:2 }}>{label}</p>
                  </div>
              ))}
            </div>

            {/* XP Progress */}
            {rpg && (
                <div style={{ marginTop:18, maxWidth:400 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:11, color:'rgba(196,181,253,0.7)' }}>
                  {rpg.title} — Level {rpg.level}
                </span>
                    <span style={{ fontSize:11, color:'#a78bfa', fontWeight:700 }}>{rpg.progressPercent}%</span>
                  </div>
                  <div style={{ height:6, background:'rgba(255,255,255,0.15)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{
                      height:'100%', borderRadius:99,
                      background:'linear-gradient(90deg,#a78bfa,#f97316)',
                      width:`${rpg.progressPercent}%`, transition:'width 1s ease',
                      boxShadow:'0 0 8px rgba(167,139,250,0.6)',
                    }}/>
                  </div>
                </div>
            )}
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ───────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, marginBottom:20 }}>

          {/* Quick Actions grid */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:17 }}>Quick Actions</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
              {QUICK_ACTIONS.map(({ label, icon, path, color, desc }) => (
                  <button key={path} onClick={() => navigate(path)} style={{
                    padding:'14px 10px', borderRadius:16, border:`1.5px solid ${color}22`,
                    background:`linear-gradient(135deg,${color}10,${color}06)`,
                    cursor:'pointer', textAlign:'center', transition:'all 0.2s',
                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                  }}
                          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 20px ${color}30`; e.currentTarget.style.borderColor=`${color}55`; }}
                          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=`${color}22`; }}
                  >
                    <span style={{ fontSize:26 }}>{icon}</span>
                    <span style={{ fontSize:11, fontWeight:700, color:'var(--text-primary)' }}>{label}</span>
                    <span style={{ fontSize:9, color:'var(--text-muted)' }}>{desc}</span>
                  </button>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Mood week */}
            <div className="card">
              <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:14, marginBottom:12 }}>
                This Week 🌈
              </h3>
              {moods.length === 0 ? (
                  <p style={{ fontSize:12, color:'var(--text-muted)', textAlign:'center', padding:'12px 0' }}>
                    No moods logged yet. Start today! 😊
                  </p>
              ) : (
                  <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap' }}>
                    {moods.map((m, i) => (
                        <div key={i} style={{ textAlign:'center' }}>
                          <div style={{
                            width:36, height:36, borderRadius:10, fontSize:18,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            background:`${MOOD_COLOR[m.mood]||'#e5e7eb'}22`,
                            border:`2px solid ${MOOD_COLOR[m.mood]||'#e5e7eb'}44`,
                            marginBottom:3,
                          }}>{MOOD_EMOJI[m.mood]||'😐'}</div>
                          <p style={{ fontSize:9, color:'var(--text-muted)' }}>
                            {new Date(m.entryDate||m.date).toLocaleDateString('en',{weekday:'short'})}
                          </p>
                        </div>
                    ))}
                  </div>
              )}
              <button onClick={() => navigate('/mood')} style={{
                marginTop:12, width:'100%', padding:'7px', borderRadius:10,
                border:'1.5px dashed var(--primary)', background:'transparent',
                color:'var(--primary)', fontSize:12, fontWeight:600, cursor:'pointer',
                transition:'all 0.15s',
              }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--primary-light)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                + Log today's mood
              </button>
            </div>

            {/* Daily challenge */}
            {data?.dailyChallenge && (
                <div style={{
                  padding:'16px 18px', borderRadius:16,
                  background:'linear-gradient(135deg,#fffbeb,#fef3c7)',
                  border:'1px solid #fde68a',
                }}>
                  <p style={{ fontSize:10, fontWeight:800, color:'#92400e', letterSpacing:1.5, marginBottom:6 }}>
                    TODAY'S CHALLENGE
                  </p>
                  <p style={{ fontSize:14, color:'#78350f', lineHeight:1.6 }}>{data.dailyChallenge}</p>
                </div>
            )}
          </div>
        </div>

        {/* ── HABITS ROW ──────────────────────────── */}
        {habits.length > 0 && (
            <div className="card" style={{ marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:16 }}>⚡ Today's Habits</h2>
                <button onClick={() => navigate('/habits')} style={{
                  fontSize:12, color:'var(--primary)', background:'none', border:'none', cursor:'pointer', fontWeight:600
                }}>View all →</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                {habits.map(habit => (
                    <div key={habit.id} style={{
                      padding:'12px 14px', borderRadius:12,
                      background:'var(--bg-soft)', border:'1px solid var(--border)',
                      display:'flex', alignItems:'center', gap:10,
                    }}>
                      <div style={{
                        width:32, height:32, borderRadius:8, fontSize:18,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        background:'var(--primary-light)',
                      }}>
                        {habit.emoji || '⚡'}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {habit.name}
                        </p>
                        <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:1 }}>
                          🔥 {habit.currentStreak||0} day streak
                        </p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* ── INSPIRATION FOOTER ──────────────────── */}
        <div style={{
          padding:'20px 24px', borderRadius:20, textAlign:'center',
          background:'linear-gradient(135deg,var(--primary-light),var(--bg-soft))',
          border:'1px solid var(--border)',
        }}>
          <p style={{ fontSize:14, color:'var(--primary)', fontWeight:600, lineHeight:1.7 }}>
            💜 Remember: showing up for yourself, even imperfectly, is still showing up.
            SAATHI is proud of you for being here today.
          </p>
        </div>

        <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulseSlow { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes pageIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      </div>
  );
}
