import React, { useState, useEffect } from 'react';
import { moodApi } from '../services/api';
import toast from 'react-hot-toast';

const MOODS = [
  { type: 'VERY_HAPPY', emoji: '😄', label: 'Amazing', color: '#10b981' },
  { type: 'HAPPY', emoji: '😊', label: 'Good', color: '#34d399' },
  { type: 'CALM', emoji: '😌', label: 'Calm', color: '#60a5fa' },
  { type: 'HOPEFUL', emoji: '🌟', label: 'Hopeful', color: '#a78bfa' },
  { type: 'NEUTRAL', emoji: '😐', label: 'Okay', color: '#fbbf24' },
  { type: 'TIRED', emoji: '😴', label: 'Tired', color: '#94a3b8' },
  { type: 'ANXIOUS', emoji: '😰', label: 'Anxious', color: '#fb923c' },
  { type: 'SAD', emoji: '😢', label: 'Sad', color: '#60a5fa' },
  { type: 'ANGRY', emoji: '😠', label: 'Angry', color: '#f87171' },
  { type: 'VERY_SAD', emoji: '😭', label: 'Very Sad', color: '#818cf8' },
];

const Slider = ({ label, value, onChange, color = '#7c3aed', max = 10 }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <label className="label" style={{ margin: 0 }}>{label}</label>
      <span style={{ fontWeight: 700, color, fontSize: 18 }}>{value}</span>
    </div>
    <input type="range" min="1" max={max} value={value} onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: color, height: 6, cursor: 'pointer' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
      <span>Low</span><span>High</span>
    </div>
  </div>
);

export default function MoodPage() {
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ stressLevel: 5, anxietyLevel: 5, sleepHours: 7, energyLevel: 5, motivationLevel: 5, focusLevel: 5, note: '' });
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('log');

  useEffect(() => {
    moodApi.getHistory().then(r => setHistory(r.data.data || [])).catch(() => {});
    moodApi.getToday().then(r => {
      if (r.data.data) {
        const t = r.data.data;
        setSelected(t.mood);
        setForm({ stressLevel: t.stressLevel, anxietyLevel: t.anxietyLevel, sleepHours: t.sleepHours,
          energyLevel: t.energyLevel, motivationLevel: t.motivationLevel, focusLevel: t.focusLevel, note: t.note || '' });
      }
    }).catch(() => {});
  }, []);

  const save = async () => {
    if (!selected) return toast.error('Please select a mood');
    setSaving(true);
    try {
      await moodApi.log({ mood: selected, ...form, entryDate: new Date().toISOString().split('T')[0] });
      toast.success("Today's mood saved! 🌟");
      moodApi.getHistory().then(r => setHistory(r.data.data || []));
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26 }}>Mood Tracker 😊</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>How are you feeling today? No judgment here.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['log', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'}`}>
            {t === 'log' ? '📝 Log Mood' : '📊 History'}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 20 }}>How are you feeling right now?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 28 }}>
            {MOODS.map(({ type, emoji, label, color }) => (
              <button key={type} onClick={() => setSelected(type)} style={{
                padding: '14px 8px', borderRadius: 14, border: `2px solid ${selected === type ? color : 'var(--border)'}`,
                background: selected === type ? `${color}18` : 'white', cursor: 'pointer',
                textAlign: 'center', transition: 'all 0.15s',
                transform: selected === type ? 'scale(1.05)' : 'scale(1)'
              }}>
                <div style={{ fontSize: 28 }}>{emoji}</div>
                <div style={{ fontSize: 11, fontWeight: selected === type ? 600 : 400, color: selected === type ? color : 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <Slider label="😤 Stress Level" value={form.stressLevel} onChange={v => setForm({...form, stressLevel: v})} color="#ef4444" />
            <Slider label="😰 Anxiety Level" value={form.anxietyLevel} onChange={v => setForm({...form, anxietyLevel: v})} color="#f97316" />
            <Slider label="💤 Sleep Hours" value={form.sleepHours} onChange={v => setForm({...form, sleepHours: v})} max={12} color="#8b5cf6" />
            <Slider label="⚡ Energy Level" value={form.energyLevel} onChange={v => setForm({...form, energyLevel: v})} color="#f59e0b" />
            <Slider label="🎯 Motivation" value={form.motivationLevel} onChange={v => setForm({...form, motivationLevel: v})} color="#10b981" />
            <Slider label="🧠 Focus Level" value={form.focusLevel} onChange={v => setForm({...form, focusLevel: v})} color="#0ea5e9" />
          </div>

          <div style={{ marginTop: 8 }}>
            <label className="label">Any notes?</label>
            <textarea className="input" rows={3} placeholder="What's on your mind? Anything specific today?"
              value={form.note} onChange={e => setForm({...form, note: e.target.value})}
              style={{ resize: 'vertical' }} />
          </div>

          <button onClick={save} disabled={saving || !selected} className="btn btn-primary" style={{ marginTop: 20, padding: '12px 32px', fontSize: 15 }}>
            {saving ? 'Saving...' : 'Save Today\'s Mood 🌟'}
          </button>
        </div>
      )}

      {tab === 'history' && (
        <div>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 16 }}>Your Mood History</h2>
          {history.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
              <p style={{ color: 'var(--text-secondary)' }}>Start logging moods to see your patterns here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.slice(0, 30).map((entry, i) => {
                const mood = MOODS.find(m => m.type === entry.mood) || MOODS[4];
                return (
                  <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 32 }}>{mood.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: mood.color }}>{mood.label}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(entry.entryDate).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                        <span>😤 Stress: {entry.stressLevel}/10</span>
                        <span>⚡ Energy: {entry.energyLevel}/10</span>
                        <span>💤 Sleep: {entry.sleepHours}h</span>
                        <span>🧠 Focus: {entry.focusLevel}/10</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
