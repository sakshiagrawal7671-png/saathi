import React, { useState, useEffect, useRef } from 'react';

const SOUNDS = [
  { id:'rain',       name:'Gentle Rain',    emoji:'🌧️', description:'Soft rainfall on leaves',         color:'#0ea5e9', gradient:'linear-gradient(135deg,#0c4a6e,#0ea5e9)' },
  { id:'ocean',      name:'Ocean Waves',    emoji:'🌊', description:'Rhythmic waves on the shore',    color:'#06b6d4', gradient:'linear-gradient(135deg,#164e63,#06b6d4)' },
  { id:'forest',     name:'Forest Birds',   emoji:'🌿', description:'Birds singing in the trees',     color:'#16a34a', gradient:'linear-gradient(135deg,#14532d,#16a34a)' },
  { id:'river',      name:'Flowing River',  emoji:'💧', description:'A peaceful mountain stream',     color:'#2563eb', gradient:'linear-gradient(135deg,#1e3a5f,#2563eb)' },
  { id:'fire',       name:'Crackling Fire', emoji:'🔥', description:'Warm fireside crackles',        color:'#ea580c', gradient:'linear-gradient(135deg,#431407,#ea580c)' },
  { id:'white_noise',name:'White Noise',    emoji:'☁️', description:'Steady calming static',          color:'#94a3b8', gradient:'linear-gradient(135deg,#334155,#94a3b8)' },
  { id:'thunder',    name:'Distant Thunder',emoji:'⛈️', description:'Rumbling thunder, far away',     color:'#7c3aed', gradient:'linear-gradient(135deg,#2e1065,#7c3aed)' },
  { id:'wind',       name:'Gentle Wind',    emoji:'💨', description:'Soft breeze through the trees',  color:'#a3e635', gradient:'linear-gradient(135deg,#1a2e05,#84cc16)' },
];

const PRESETS = [
  { name:'Deep Focus',   sounds:['rain','white_noise'],           description:'For studying or deep work' },
  { name:'Sleep Aid',    sounds:['ocean','rain'],                 description:'Drift into peaceful sleep' },
  { name:'Calm Anxiety', sounds:['forest','river'],              description:'Soothe a restless mind' },
  { name:'Meditation',   sounds:['wind','forest'],               description:'Ground yourself in nature' },
];

// Web Audio API tone generator — no external files needed
function createSoundPlayer(audioCtx, soundId) {
  let source = null, gainNode = null, intervalRef = null;

  const createNoise = (type) => {
    const bufferSize = audioCtx.sampleRate * 4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    return src;
  };

  const createOscillator = (freq, type='sine') => {
    const osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    return osc;
  };

  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

  switch(soundId) {
    case 'rain':
    case 'white_noise':
    case 'river': {
      const noise = createNoise();
      const filter = audioCtx.createBiquadFilter();
      filter.type = soundId === 'rain' ? 'bandpass' : soundId === 'river' ? 'lowpass' : 'allpass';
      filter.frequency.setValueAtTime(soundId === 'rain' ? 1200 : soundId === 'river' ? 800 : 2000, audioCtx.currentTime);
      noise.connect(filter);
      filter.connect(gainNode);
      source = noise;
      break;
    }
    case 'ocean': {
      const noise = createNoise();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, audioCtx.currentTime);
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.1, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(300, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      noise.connect(filter);
      filter.connect(gainNode);
      source = noise;
      break;
    }
    case 'forest': {
      const osc1 = createOscillator(440, 'sine');
      const osc2 = createOscillator(660, 'sine');
      const osc3 = createOscillator(880, 'sine');
      const g1 = audioCtx.createGain(); g1.gain.setValueAtTime(0.2, audioCtx.currentTime);
      const g2 = audioCtx.createGain(); g2.gain.setValueAtTime(0.15, audioCtx.currentTime);
      const g3 = audioCtx.createGain(); g3.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc1.connect(g1); osc2.connect(g2); osc3.connect(g3);
      g1.connect(gainNode); g2.connect(gainNode); g3.connect(gainNode);
      source = osc1;
      [osc1, osc2, osc3].forEach(o => o.start());
      break;
    }
    case 'fire': {
      const noise = createNoise();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, audioCtx.currentTime);
      filter.Q.setValueAtTime(0.5, audioCtx.currentTime);
      noise.connect(filter);
      filter.connect(gainNode);
      source = noise;
      break;
    }
    default: {
      const noise = createNoise();
      noise.connect(gainNode);
      source = noise;
    }
  }

  gainNode.connect(audioCtx.destination);

  return {
    play: (vol=0.5) => {
      try { source.start(); } catch(e) {}
      gainNode.gain.linearRampToValueAtTime(vol * 0.4, audioCtx.currentTime + 1);
    },
    stop: () => {
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      setTimeout(() => { try { source.stop(); } catch(e) {} }, 600);
    },
    setVolume: (vol) => {
      gainNode.gain.linearRampToValueAtTime(vol * 0.4, audioCtx.currentTime + 0.3);
    }
  };
}

export default function RelaxationHubPage() {
  const [playing,  setPlaying]  = useState({});   // { soundId: volume 0-1 }
  const [timer,    setTimer]    = useState(0);     // seconds elapsed
  const [timerLimit, setTimerLimit] = useState(0); // 0 = off
  const audioCtxRef = useRef(null);
  const playersRef  = useRef({});
  const timerRef    = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      Object.values(playersRef.current).forEach(p => { try { p.stop(); } catch(e) {} });
      if (audioCtxRef.current) audioCtxRef.current.close();
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (Object.keys(playing).length > 0 && timerLimit === 0) {
      timerRef.current = setInterval(() => setTimer(t => t+1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (Object.keys(playing).length === 0) setTimer(0);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, timerLimit]);

  useEffect(() => {
    if (timerLimit > 0 && timer >= timerLimit) {
      stopAll();
    }
  }, [timer, timerLimit]);

  const getCtx = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const toggleSound = (soundId) => {
    if (playing[soundId] !== undefined) {
      // stop it
      if (playersRef.current[soundId]) playersRef.current[soundId].stop();
      delete playersRef.current[soundId];
      setPlaying(prev => { const next = {...prev}; delete next[soundId]; return next; });
    } else {
      // start it
      const ctx = getCtx();
      const player = createSoundPlayer(ctx, soundId);
      player.play(0.6);
      playersRef.current[soundId] = player;
      setPlaying(prev => ({ ...prev, [soundId]: 0.6 }));
    }
  };

  const setVolume = (soundId, vol) => {
    if (playersRef.current[soundId]) playersRef.current[soundId].setVolume(vol);
    setPlaying(prev => ({ ...prev, [soundId]: vol }));
  };

  const stopAll = () => {
    Object.values(playersRef.current).forEach(p => { try { p.stop(); } catch(e) {} });
    playersRef.current = {};
    setPlaying({});
  };

  const applyPreset = (preset) => {
    stopAll();
    setTimeout(() => {
      preset.sounds.forEach(sid => toggleSound(sid));
    }, 200);
  };

  const formatTime = (s) => {
    const m = Math.floor(s/60);
    return `${m}:${(s%60).toString().padStart(2,'0')}`;
  };

  const anyPlaying = Object.keys(playing).length > 0;

  return (
    <div style={{ maxWidth:900, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Relaxation Hub 🎵</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Mix ambient sounds to create your perfect calming environment.
        </p>
      </div>

      {/* Now playing bar */}
      {anyPlaying && (
        <div style={{ borderRadius:16, padding:'14px 22px', marginBottom:20,
          background:'linear-gradient(135deg,#1e1b4b,#312e81)', color:'white',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ display:'flex', gap:4, alignItems:'flex-end' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width:3, borderRadius:2, background:'#a78bfa',
                  animation:`wave ${0.5+i*0.1}s ease-in-out infinite alternate`,
                  height:`${8+i*4}px` }} />
              ))}
            </div>
            <div>
              <p style={{ fontWeight:700, fontSize:14 }}>
                {Object.keys(playing).map(id => SOUNDS.find(s => s.id===id)?.emoji).join(' ')} Now Playing
              </p>
              <p style={{ fontSize:11, opacity:.7 }}>{formatTime(timer)}</p>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <select value={timerLimit} onChange={e => setTimerLimit(Number(e.target.value))} style={{
              padding:'4px 10px', borderRadius:8, background:'rgba(255,255,255,0.1)',
              border:'1px solid rgba(255,255,255,0.2)', color:'white', fontSize:12, cursor:'pointer'
            }}>
              <option value={0}>No timer</option>
              <option value={300}>5 min</option>
              <option value={600}>10 min</option>
              <option value={900}>15 min</option>
              <option value={1800}>30 min</option>
              <option value={3600}>1 hour</option>
            </select>
            <button onClick={stopAll} style={{ padding:'6px 14px', borderRadius:8, background:'rgba(255,255,255,0.15)',
              border:'1px solid rgba(255,255,255,0.3)', color:'white', cursor:'pointer', fontSize:12 }}>
              ⏹ Stop All
            </button>
          </div>
        </div>
      )}

      {/* Presets */}
      <div style={{ marginBottom:24 }}>
        <p style={{ fontWeight:700, fontSize:13, color:'var(--text-secondary)', marginBottom:10, letterSpacing:.5 }}>PRESETS</p>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {PRESETS.map(preset => (
            <button key={preset.name} onClick={() => applyPreset(preset)} style={{
              padding:'10px 18px', borderRadius:12, cursor:'pointer',
              border:'1.5px solid var(--border)', background:'white',
              transition:'all 0.2s', textAlign:'left'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#7c3aed'; e.currentTarget.style.background='#f5f3ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='white'; }}>
              <p style={{ fontWeight:600, fontSize:13 }}>
                {preset.sounds.map(id => SOUNDS.find(s=>s.id===id)?.emoji).join(' ')} {preset.name}
              </p>
              <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sound grid */}
      <p style={{ fontWeight:700, fontSize:13, color:'var(--text-secondary)', marginBottom:10, letterSpacing:.5 }}>SOUNDS</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
        {SOUNDS.map(sound => {
          const isPlaying = playing[sound.id] !== undefined;
          return (
            <div key={sound.id} className="card" style={{
              padding:'18px 20px',
              border:`2px solid ${isPlaying?sound.color:'var(--border)'}`,
              transition:'all 0.2s',
              background:isPlaying?`${sound.color}08`:'white'
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:isPlaying?12:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <button onClick={() => toggleSound(sound.id)} style={{
                    width:48, height:48, borderRadius:'50%', border:'none', cursor:'pointer',
                    background:isPlaying?`linear-gradient(135deg,${sound.color},${sound.color}aa)`:'var(--soft-gray)',
                    fontSize:24, display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all 0.2s',
                    boxShadow:isPlaying?`0 4px 16px ${sound.color}44`:'none'
                  }}>
                    {sound.emoji}
                  </button>
                  <div>
                    <p style={{ fontWeight:700, fontSize:14 }}>{sound.name}</p>
                    <p style={{ fontSize:12, color:'var(--text-secondary)' }}>{sound.description}</p>
                  </div>
                </div>
                <button onClick={() => toggleSound(sound.id)} style={{
                  width:32, height:32, borderRadius:'50%', border:`2px solid ${isPlaying?sound.color:'var(--border)'}`,
                  background:isPlaying?sound.color:'white', color:isPlaying?'white':sound.color,
                  cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:700, transition:'all 0.2s'
                }}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
              </div>

              {isPlaying && (
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:11, color:'var(--text-muted)', flexShrink:0 }}>🔊</span>
                  <input type="range" min="0.05" max="1" step="0.05"
                    value={playing[sound.id] || 0.6}
                    onChange={e => setVolume(sound.id, Number(e.target.value))}
                    style={{ flex:1, accentColor:sound.color, height:4 }} />
                  <span style={{ fontSize:11, color:'var(--text-muted)', flexShrink:0, width:28 }}>
                    {Math.round((playing[sound.id]||0.6)*100)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop:20, textAlign:'center',
        background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0' }}>
        <p style={{ fontSize:14, color:'#15803d', lineHeight:1.7 }}>
          💚 Sound therapy can lower cortisol, reduce anxiety, and ease you into rest.
          Mix sounds freely. There's no perfect combination — just what feels right for you today.
        </p>
      </div>

      <style>{`
        @keyframes wave { from{transform:scaleY(0.6)} to{transform:scaleY(1.4)} }
      `}</style>
    </div>
  );
}
