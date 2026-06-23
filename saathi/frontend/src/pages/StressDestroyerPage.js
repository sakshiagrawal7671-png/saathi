import React, { useState, useEffect, useCallback } from 'react';
import { rpgApi } from '../services/api';
import toast from 'react-hot-toast';

const NEGATIVE_THOUGHTS = [
  { text:"I'm not good enough",    positive:"I am growing every day" },
  { text:"Nobody cares about me",  positive:"People love me even when they don't show it" },
  { text:"I always mess up",       positive:"I learn and improve from every mistake" },
  { text:"It's hopeless",          positive:"This feeling will pass — it always does" },
  { text:"I'm so stupid",          positive:"I am capable of learning anything I put my mind to" },
  { text:"I'll never succeed",     positive:"Success is built from many small tries" },
  { text:"I'm worthless",          positive:"My worth is not tied to my productivity" },
  { text:"No one understands me",  positive:"I am unique and that is a strength" },
  { text:"I'm falling behind",     positive:"Everyone moves at their own pace" },
  { text:"I can't do this",        positive:"I can try, and trying is enough" },
  { text:"I'm too anxious",        positive:"My sensitivity is a gift, not a flaw" },
  { text:"I'm unlovable",          positive:"I am worthy of love exactly as I am" },
];

export default function StressDestroyerPage() {
  const [phase,   setPhase]   = useState('intro');  // intro | playing | result
  const [thoughts, setThoughts] = useState([]);
  const [score,   setScore]   = useState(0);
  const [level,   setLevel]   = useState(1);
  const [time,    setTime]    = useState(30);
  const [showing, setShowing] = useState(null);
  const [positive,setPositive]= useState(null);
  const [combo,   setCombo]   = useState(0);
  const [missed,  setMissed]  = useState(0);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (time <= 0) { setPhase('result'); return; }
    const t = setInterval(() => setTime(s => s-1), 1000);
    return () => clearInterval(t);
  }, [phase, time]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const spawnThought = () => {
      const thought = NEGATIVE_THOUGHTS[Math.floor(Math.random()*NEGATIVE_THOUGHTS.length)];
      const id = Date.now();
      const x = 10 + Math.random() * 70;
      const y = 10 + Math.random() * 70;
      setThoughts(prev => [...prev, { id, ...thought, x, y, alive:true }]);
      setTimeout(() => {
        setThoughts(prev => prev.map(t => t.id===id && t.alive ? {...t,alive:false} : t));
        setThoughts(prev => { const missed = prev.find(t=>t.id===id&&!t.alive); if(missed) setMissed(m=>m+1); return prev.filter(t=>t.id!==id); });
      }, 3500 - level*200);
    };
    const interval = setInterval(spawnThought, 1200 - level*100);
    return () => clearInterval(interval);
  }, [phase, level]);

  useEffect(() => {
    if (score > 0 && score % 5 === 0) setLevel(l => Math.min(l+1, 5));
  }, [score]);

  const destroyThought = (thought) => {
    setThoughts(prev => prev.filter(t => t.id !== thought.id));
    setScore(s => s+1);
    setCombo(c => c+1);
    setPositive(thought.positive);
    setShowing(thought.id);
    setTimeout(() => setPositive(null), 1800);
  };

  const startGame = () => {
    setPhase('playing'); setScore(0); setLevel(1); setTime(30);
    setThoughts([]); setCombo(0); setMissed(0);
  };

  const claimXP = async () => {
    try { await rpgApi.completeQuest && toast.success(`+${score*2} XP earned! 🌟`); } catch {}
    toast.success(`Great game! ${score} thoughts destroyed! 🌟`);
  };

  return (
    <div style={{ maxWidth:800, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Stress Destroyer 💥</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Tap negative thoughts to destroy them. Positive truths replace them.
        </p>
      </div>

      {phase === 'intro' && (
        <div className="card" style={{ textAlign:'center', padding:'48px 36px' }}>
          <div style={{ fontSize:72, marginBottom:16 }}>🎯</div>
          <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:24, marginBottom:12 }}>Challenge Your Inner Critic</h2>
          <p style={{ color:'var(--text-secondary)', maxWidth:400, margin:'0 auto 32px', fontSize:15, lineHeight:1.7 }}>
            Negative thoughts will float across the screen. Tap them to destroy them.
            A positive truth appears in their place. This is how we rewire our thinking.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', marginBottom:32, flexWrap:'wrap' }}>
            {[{icon:'💭',label:'Spot the thought'},{icon:'👆',label:'Tap to destroy'},{icon:'✨',label:'Positive truth appears'},{icon:'🔥',label:'Build your combo'}].map(({icon,label}) => (
              <div key={label} style={{ textAlign:'center', padding:'12px 16px', borderRadius:12, background:'var(--soft-gray)' }}>
                <div style={{ fontSize:28, marginBottom:4 }}>{icon}</div>
                <p style={{ fontSize:12, color:'var(--text-secondary)' }}>{label}</p>
              </div>
            ))}
          </div>
          <button onClick={startGame} className="btn btn-primary" style={{ padding:'14px 48px', fontSize:17 }}>
            🎯 Start Game
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          {/* HUD */}
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
            {[{label:'Score',value:score,color:'#7c3aed'},{label:'Level',value:level,color:'#f97316'},{label:'Combo',value:`${combo}x`,color:'#10b981'},{label:'Time',value:`${time}s`,color:time<10?'#ef4444':'#0ea5e9'}].map(({label,value,color}) => (
              <div key={label} style={{ padding:'10px 18px', borderRadius:12, background:'white',
                border:`2px solid ${color}30`, textAlign:'center', flex:1, minWidth:80 }}>
                <p style={{ fontSize:20, fontWeight:700, fontFamily:'Poppins', color }}>{value}</p>
                <p style={{ fontSize:11, color:'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Game Area */}
          <div style={{ position:'relative', height:400, borderRadius:20, overflow:'hidden',
            background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', border:'1px solid #312e81' }}>
            {/* Stars */}
            {Array.from({length:30}).map((_,i) => (
              <div key={i} style={{ position:'absolute', top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
                width:1.5, height:1.5, borderRadius:'50%', background:'white', opacity:Math.random()*0.6+0.2 }} />
            ))}

            {/* Time bar */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'rgba(255,255,255,0.2)' }}>
              <div style={{ height:'100%', background:time<10?'#ef4444':'#7c3aed', width:`${(time/30)*100}%`, transition:'width 1s linear' }} />
            </div>

            {/* Thoughts */}
            {thoughts.filter(t => t.alive).map(thought => (
              <button key={thought.id} onClick={() => destroyThought(thought)} style={{
                position:'absolute', left:`${thought.x}%`, top:`${thought.y}%`,
                transform:'translate(-50%,-50%)',
                padding:'10px 16px', borderRadius:14,
                background:'rgba(239,68,68,0.85)', color:'white', border:'none', cursor:'pointer',
                fontSize:13, fontWeight:600, maxWidth:180, textAlign:'center',
                backdropFilter:'blur(4px)', boxShadow:'0 4px 16px rgba(0,0,0,0.4)',
                animation:'fadeIn 0.3s ease',
                transition:'transform 0.15s',
                zIndex:2
              }}
                onMouseEnter={e => e.currentTarget.style.transform='translate(-50%,-50%) scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform='translate(-50%,-50%) scale(1)'}>
                💭 {thought.text}
              </button>
            ))}

            {/* Positive replacement */}
            {positive && (
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                background:'rgba(16,185,129,0.95)', color:'white', padding:'16px 24px', borderRadius:16,
                fontSize:15, fontWeight:700, textAlign:'center', maxWidth:280, zIndex:10,
                backdropFilter:'blur(8px)', animation:'popIn 0.4s ease',
                boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
                ✨ {positive}
              </div>
            )}

            <div style={{ position:'absolute', bottom:16, left:0, right:0, textAlign:'center', color:'rgba(255,255,255,0.5)', fontSize:12 }}>
              Tap the negative thoughts to destroy them
            </div>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="card" style={{ textAlign:'center', padding:'48px 36px' }}>
          <div style={{ fontSize:72, marginBottom:16 }}>{score >= 15 ? '🏆' : score >= 8 ? '⭐' : '💜'}</div>
          <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26, marginBottom:8 }}>
            {score >= 15 ? 'Outstanding!' : score >= 8 ? 'Great job!' : 'Well done!'}
          </h2>
          <p style={{ color:'var(--text-secondary)', marginBottom:24, fontSize:15 }}>
            You destroyed {score} negative thoughts. Every thought you challenged made room for truth.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', marginBottom:28 }}>
            {[{label:'Destroyed',value:score,color:'#10b981'},{label:'Max Combo',value:`${combo}x`,color:'#f59e0b'},{label:'Level Reached',value:level,color:'#7c3aed'}].map(({label,value,color}) => (
              <div key={label} style={{ padding:'14px 20px', borderRadius:14, background:`${color}10`, border:`1px solid ${color}30` }}>
                <p style={{ fontFamily:'Poppins', fontWeight:700, fontSize:24, color }}>{value}</p>
                <p style={{ fontSize:12, color:'var(--text-secondary)' }}>{label}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
            <button onClick={startGame} className="btn btn-primary" style={{ padding:'12px 28px' }}>🎯 Play Again</button>
            <button onClick={claimXP} className="btn btn-secondary">⭐ Claim XP</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translate(-50%,-50%) scale(0.8)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes popIn { from{opacity:0;transform:translate(-50%,-50%) scale(0.5)} 60%{transform:translate(-50%,-50%) scale(1.1)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
      `}</style>
    </div>
  );
}
