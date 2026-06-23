import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setComfortRoom } from '../store/slices/uiSlice';

const BREATHING_MODES = [
  { label: '1 min', seconds: 60, icon: '🌬️' },
  { label: '2 min', seconds: 120, icon: '💨' },
  { label: '5 min', seconds: 300, icon: '🌊' },
];

const WISDOM = [
  { quote: "You are stronger than you think.", author: "Unknown", emoji: "💪" },
  { quote: "This too shall pass.", author: "Ancient Proverb", emoji: "🌅" },
  { quote: "You are worthy of love and belonging.", author: "Brené Brown", emoji: "❤️" },
  { quote: "Progress, not perfection.", author: "Unknown", emoji: "🌱" },
  { quote: "Be gentle with yourself.", author: "Unknown", emoji: "🕊️" },
];

const SOUNDS = [
  { name: 'Rain', icon: '🌧️', color: '#60a5fa' },
  { name: 'Ocean', icon: '🌊', color: '#0ea5e9' },
  { name: 'Forest', icon: '🌲', color: '#10b981' },
  { name: 'River', icon: '💧', color: '#06b6d4' },
  { name: 'White Noise', icon: '🌫️', color: '#8b5cf6' },
];

export default function WellnessPage() {
  const dispatch = useDispatch();
  const [breathPhase, setBreathPhase] = useState('idle');
  const [breathTimer, setBreathTimer] = useState(null);
  const [activeSound, setActiveSound] = useState(null);
  const [tab, setTab] = useState('breathing');

  const startBreathing = (mode) => {
    const phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
    let i = 0;
    setBreathPhase(phases[0]);
    const interval = setInterval(() => {
      i = (i + 1) % phases.length;
      setBreathPhase(phases[i]);
    }, 4000);
    setTimeout(() => { clearInterval(interval); setBreathPhase('Done ✓'); }, mode.seconds * 1000);
    setBreathTimer(interval);
  };

  const stopBreathing = () => { if (breathTimer) clearInterval(breathTimer); setBreathPhase('idle'); };

  const TABS = [
    { id: 'breathing', icon: '🌬️', label: 'Breathing' },
    { id: 'wisdom', icon: '📖', label: 'Life Library' },
    { id: 'sounds', icon: '🎵', label: 'Calm Sounds' },
    { id: 'grounding', icon: '🌿', label: 'Grounding' },
  ];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26 }}>Wellness Center 🌿</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Tools for calm, clarity, and inner peace.</p>
      </div>

      {/* Comfort Room */}
      <div style={{ borderRadius: 20, padding: '20px 24px', marginBottom: 24,
        background: 'linear-gradient(135deg,#fef2f2,#fff7ed)', border: '1px solid #fca5a5',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#9a3412' }}>🫂 Need immediate support?</h3>
          <p style={{ fontSize: 13, color: '#c2410c', marginTop: 2 }}>Open the Comfort Room for instant help.</p>
        </div>
        <button onClick={() => dispatch(setComfortRoom(true))} style={{
          padding: '10px 20px', borderRadius: 12, background: '#ef4444', color: 'white',
          border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14
        }}>Open Now</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`btn ${tab === t.id ? 'btn-primary' : 'btn-ghost'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'breathing' && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 8 }}>Breathing Bubble</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Follow the bubble. Breathe. Be calm.</p>

          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 32px' }}>
            <div style={{
              width: breathPhase === 'Breathe In' ? 200 : breathPhase === 'Breathe Out' ? 120 : 160,
              height: breathPhase === 'Breathe In' ? 200 : breathPhase === 'Breathe Out' ? 120 : 160,
              borderRadius: '50%', margin: 'auto',
              background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(14,165,233,0.3))',
              border: '3px solid #7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 4s ease-in-out', position: 'absolute', inset: 0, margin: 'auto'
            }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 16, color: '#7c3aed' }}>
                {breathPhase === 'idle' ? '🫁' : breathPhase}
              </p>
            </div>
          </div>

          {breathPhase === 'idle' ? (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {BREATHING_MODES.map(m => (
                <button key={m.label} onClick={() => startBreathing(m)} className="btn btn-secondary" style={{ gap: 6 }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          ) : (
            <button onClick={stopBreathing} className="btn btn-ghost">Stop</button>
          )}
        </div>
      )}

      {tab === 'wisdom' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {WISDOM.map((w, i) => (
            <div key={i} className="card" style={{ background: ['#fdf4ff','#f0fdf4','#fff7ed','#eff6ff','#fef9c3'][i % 5], padding: '24px' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{w.emoji}</div>
              <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic', color: '#1c1917' }}>"{w.quote}"</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>— {w.author}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'sounds' && (
        <div className="card">
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 16 }}>Calming Sounds</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {SOUNDS.map(s => (
              <button key={s.name} onClick={() => setActiveSound(activeSound === s.name ? null : s.name)} style={{
                padding: '20px', borderRadius: 16, border: `2px solid ${activeSound === s.name ? s.color : 'var(--border)'}`,
                background: activeSound === s.name ? `${s.color}18` : 'var(--soft-gray)',
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                <p style={{ fontWeight: 600, color: activeSound === s.name ? s.color : 'var(--text-primary)', fontSize: 14 }}>{s.name}</p>
                {activeSound === s.name && <p style={{ fontSize: 11, color: s.color, marginTop: 4 }}>♪ Playing</p>}
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            (Connect speakers for ambient sounds — integrate with Web Audio API for actual playback)
          </p>
        </div>
      )}

      {tab === 'grounding' && (
        <div className="card">
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 8 }}>5-4-3-2-1 Grounding Exercise</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>When anxiety strikes, ground yourself with your senses.</p>
          {[
            { num: 5, sense: 'SEE', prompt: 'Name 5 things you can see right now', icon: '👁️', color: '#7c3aed' },
            { num: 4, sense: 'TOUCH', prompt: 'Notice 4 things you can physically feel', icon: '✋', color: '#0ea5e9' },
            { num: 3, sense: 'HEAR', prompt: 'Listen for 3 sounds around you', icon: '👂', color: '#10b981' },
            { num: 2, sense: 'SMELL', prompt: 'Find 2 things you can smell', icon: '👃', color: '#f59e0b' },
            { num: 1, sense: 'TASTE', prompt: 'Notice 1 thing you can taste', icon: '👅', color: '#ef4444' },
          ].map(({ num, sense, prompt, icon, color }) => (
            <div key={num} style={{ display: 'flex', gap: 16, padding: '16px', marginBottom: 10,
              borderRadius: 14, background: `${color}08`, border: `1px solid ${color}20` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
              <div>
                <p style={{ fontWeight: 700, color, fontSize: 18 }}>{num} — {sense}</p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>{prompt}</p>
              </div>
            </div>
          ))}
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
            Take slow, deep breaths as you go through each step. 💜
          </p>
        </div>
      )}
    </div>
  );
}
