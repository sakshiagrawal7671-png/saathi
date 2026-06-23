import React, { useState, useEffect, useRef } from 'react';
import { focusApi } from '../services/api';
import toast from 'react-hot-toast';

const DURATIONS = [{ label: '25 min', value: 25, icon: '🌱', type: 'Pomodoro' },
  { label: '50 min', value: 50, icon: '🌳', type: 'Deep Work' },
  { label: '15 min', value: 15, icon: '🌿', type: 'Quick Focus' },
  { label: '90 min', value: 90, icon: '🌲', type: 'Flow State' }];

export default function FocusPage() {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [task, setTask] = useState('');
  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [forest, setForest] = useState(null);
  const [sessions, setSessions] = useState([]);
  const timerRef = useRef(null);

  const load = async () => {
    const [f, s] = await Promise.all([focusApi.getForest(), focusApi.getSessions()]);
    setForest(f.data.data); setSessions(s.data.data || []);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (running && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (running && timeLeft === 0 && session) {
      handleComplete();
    }
    return () => clearTimeout(timerRef.current);
  }, [running, timeLeft]);

  const startSession = async () => {
    const res = await focusApi.start({ durationMinutes: selectedDuration, taskDescription: task });
    setSession(res.data.data);
    setTimeLeft(selectedDuration * 60);
    setRunning(true);
    toast.success(`Focus session started! 🌱 Plant a tree!`);
  };

  const handleComplete = async () => {
    setRunning(false);
    if (session) {
      await focusApi.complete(session.id);
      toast.success(`🌳 Amazing! You completed ${selectedDuration} minutes of focus!`);
      setSession(null); load();
    }
  };

  const cancelSession = () => {
    setRunning(false); setSession(null); setTimeLeft(0);
    clearTimeout(timerRef.current);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = session ? 1 - (timeLeft / (selectedDuration * 60)) : 0;
  const badgeMeta = { SEEDLING: { emoji: '🌱', color: '#84cc16' }, GARDENER: { emoji: '🌿', color: '#16a34a' },
    FORESTER: { emoji: '🌳', color: '#15803d' }, NATURE_GUARDIAN: { emoji: '🌲', color: '#14532d' } };
  const badge = badgeMeta[forest?.badge] || badgeMeta.SEEDLING;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26 }}>Focus Forest 🌳</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Focus and grow your forest. Every session plants a tree.</p>
      </div>

      {/* Forest Stats */}
      <div style={{
        borderRadius: 20, padding: '24px 28px', marginBottom: 24,
        background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
        border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap'
      }}>
        <div style={{ fontSize: 56 }}>{badge.emoji}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, color: badge.color }}>{forest?.badge?.replace('_', ' ') || 'SEEDLING'}</h2>
          <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap' }}>
            <div><p style={{ fontSize: 22, fontWeight: 700, color: '#15803d' }}>{forest?.totalFocusMinutes || 0}</p><p style={{ fontSize: 11, color: '#6b7280' }}>Focus Minutes</p></div>
            <div><p style={{ fontSize: 22, fontWeight: 700, color: '#15803d' }}>{forest?.plantsGrown || 0}</p><p style={{ fontSize: 11, color: '#6b7280' }}>Plants Grown</p></div>
            <div><p style={{ fontSize: 22, fontWeight: 700, color: '#15803d' }}>{forest?.forestsCreated || 0}</p><p style={{ fontSize: 11, color: '#6b7280' }}>Forests Created</p></div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="card" style={{ textAlign: 'center', padding: '40px 32px', marginBottom: 24 }}>
        {!running && !session ? (
          <>
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 20, fontSize: 18 }}>Choose your focus time</h3>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              {DURATIONS.map(({ label, value, icon, type }) => (
                <button key={value} onClick={() => setSelectedDuration(value)} style={{
                  padding: '16px 20px', borderRadius: 16, border: `2px solid ${selectedDuration === value ? '#7c3aed' : 'var(--border)'}`,
                  background: selectedDuration === value ? '#f5f3ff' : 'white', cursor: 'pointer', minWidth: 110,
                  transform: selectedDuration === value ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.15s'
                }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontWeight: 700, color: selectedDuration === value ? '#7c3aed' : 'var(--text-primary)' }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{type}</div>
                </button>
              ))}
            </div>
            <input className="input" placeholder="What will you focus on? (optional)" value={task}
              onChange={e => setTask(e.target.value)} style={{ maxWidth: 400, margin: '0 auto 20px', display: 'block' }} />
            <button onClick={startSession} className="btn btn-primary" style={{ padding: '12px 36px', fontSize: 16 }}>
              🌱 Start Growing
            </button>
          </>
        ) : (
          <>
            {/* Circular Timer */}
            <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 24px' }}>
              <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="110" cy="110" r="95" fill="none" stroke="#f0fdf4" strokeWidth="12" />
                <circle cx="110" cy="110" r="95" fill="none" stroke="#10b981" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 95}`}
                  strokeDashoffset={`${2 * Math.PI * 95 * (1 - progress)}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 48, fontFamily: 'Poppins', fontWeight: 700, color: '#15803d' }}>
                  {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                </div>
                {task && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, maxWidth: 140, textAlign: 'center' }}>{task}</div>}
              </div>
            </div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>
              {running ? (progress > 0.5 ? '🌳' : '🌱') : '⏸️'}
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              {running ? 'Stay focused. Your tree is growing...' : 'Session paused'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setRunning(!running)} className="btn btn-primary" style={{ padding: '10px 28px' }}>
                {running ? '⏸ Pause' : '▶ Resume'}
              </button>
              <button onClick={handleComplete} className="btn btn-secondary">✅ Complete</button>
              <button onClick={cancelSession} className="btn btn-ghost" style={{ color: '#ef4444' }}>✕ Cancel</button>
            </div>
          </>
        )}
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="card">
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 14 }}>Recent Sessions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sessions.slice(0, 5).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: s.completed ? '#f0fdf4' : 'var(--soft-gray)' }}>
                <span style={{ fontSize: 20 }}>{s.completed ? '🌳' : '🌱'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{s.taskDescription || 'Focus session'}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.durationMinutes} minutes • {new Date(s.startedAt).toLocaleDateString()}</p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.completed ? '#15803d' : '#6b7280' }}>
                  {s.completed ? 'Completed ✓' : 'Incomplete'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
