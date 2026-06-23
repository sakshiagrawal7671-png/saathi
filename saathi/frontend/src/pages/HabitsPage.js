import React, { useState, useEffect } from 'react';
import { habitApi } from '../services/api';
import { FiPlus, FiTrash2, FiCheck, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ICONS = ['💧', '🏃', '📚', '🧘', '😴', '🥗', '📝', '📞', '🎯', '💪', '🌿', '🙏', '🎨', '🎵', '⚡'];
const COLORS = ['#7c3aed', '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#ec4899', '#f59e0b', '#84cc16'];

const DEFAULT_HABITS = [
  { name: 'Drink 8 glasses of water', icon: '💧', color: '#0ea5e9', description: 'Stay hydrated' },
  { name: 'Exercise for 30 mins', icon: '🏃', color: '#10b981', description: 'Move your body' },
  { name: 'Read for 20 mins', icon: '📚', color: '#7c3aed', description: 'Feed your mind' },
  { name: 'Meditate', icon: '🧘', color: '#f97316', description: 'Find your calm' },
  { name: 'Journal', icon: '📝', color: '#f59e0b', description: 'Reflect and grow' },
  { name: 'Call family', icon: '📞', color: '#ef4444', description: 'Stay connected' },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [completedToday, setCompletedToday] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', icon: '⚡', color: '#7c3aed', frequency: 'DAILY' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [h, t] = await Promise.all([habitApi.getAll(), habitApi.getTodayProgress()]);
    setHabits(h.data.data || []);
    // Load today's logs to mark completed
    const todayLogs = t.data.data;
  };

  useEffect(() => { load(); }, []);

  const createHabit = async () => {
    if (!form.name.trim()) return toast.error('Enter a habit name');
    setSaving(true);
    try {
      await habitApi.create(form);
      toast.success('Habit created! 🌱');
      setShowForm(false); setForm({ name: '', description: '', icon: '⚡', color: '#7c3aed', frequency: 'DAILY' });
      load();
    } catch { toast.error('Failed to create'); }
    setSaving(false);
  };

  const logHabit = async (id) => {
    try {
      await habitApi.log(id);
      setCompletedToday(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
      toast.success(completedToday.has(id) ? 'Habit unmarked' : '✅ Habit completed!');
      load();
    } catch { toast.error('Failed to log'); }
  };

  const deleteHabit = async (id) => {
    if (!window.confirm('Remove this habit?')) return;
    await habitApi.delete(id);
    toast.success('Habit removed');
    load();
  };

  const addDefault = async (h) => {
    try {
      await habitApi.create({ ...h, frequency: 'DAILY' });
      toast.success(`Added: ${h.name} 🌱`);
      load();
    } catch { toast.error('Already added or failed'); }
  };

  const completed = completedToday.size;
  const total = habits.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26 }}>Daily Habits ⚡</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Small daily actions create lasting change.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> New Habit</button>
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="card" style={{ marginBottom: 24, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontWeight: 600 }}>Today's Progress</span>
            <span style={{ fontWeight: 700, color: pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#7c3aed', fontSize: 20 }}>
              {completed}/{total}
            </span>
          </div>
          <div style={{ background: 'var(--soft-gray)', borderRadius: 99, height: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, transition: 'width 0.5s',
              background: pct >= 80 ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#7c3aed,#a78bfa)' }} />
          </div>
          {pct === 100 && (
            <p style={{ marginTop: 10, color: '#10b981', fontWeight: 600, fontSize: 14 }}>
              🎉 Amazing! You completed all habits today!
            </p>
          )}
        </div>
      )}

      {/* Habit List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
        {habits.length === 0 ? (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🌱</div>
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 8 }}>Plant your first habit</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Consistent small actions lead to big transformations.</p>
          </div>
        ) : habits.map(habit => {
          const done = completedToday.has(habit.id);
          return (
            <div key={habit.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
              borderColor: done ? habit.color || '#7c3aed' : 'var(--border)',
              background: done ? `${habit.color || '#7c3aed'}08` : 'white' }}>
              <button onClick={() => logHabit(habit.id)} style={{
                width: 44, height: 44, borderRadius: 12, border: `2px solid ${habit.color || '#7c3aed'}`,
                background: done ? habit.color || '#7c3aed' : 'transparent',
                color: done ? 'white' : habit.color || '#7c3aed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                fontSize: done ? 18 : 20, flexShrink: 0, transition: 'all 0.2s'
              }}>
                {done ? <FiCheck strokeWidth={3} /> : habit.icon || '⚡'}
              </button>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, textDecoration: done ? 'line-through' : 'none',
                  color: done ? 'var(--text-muted)' : 'var(--text-primary)' }}>{habit.name}</p>
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                  <span>🔥 {habit.currentStreak} day streak</span>
                  <span>✅ {habit.totalCompletions} total</span>
                </div>
              </div>
              <button onClick={() => deleteHabit(habit.id)} className="btn btn-ghost" style={{ padding: '5px 7px', color: '#ef4444' }}>
                <FiTrash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Suggested Habits */}
      {habits.length < 6 && (
        <div className="card">
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 14, fontSize: 15 }}>✨ Suggested Habits</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {DEFAULT_HABITS.filter(d => !habits.find(h => h.name === d.name)).map(h => (
              <button key={h.name} onClick={() => addDefault(h)} style={{
                padding: '12px 14px', borderRadius: 12, border: '1px dashed var(--border)',
                background: 'var(--soft-gray)', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor=h.color}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                <span style={{ fontSize: 22 }}>{h.icon}</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600 }}>{h.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>+ Add</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480 }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 20 }}>Create New Habit</h2>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Habit Name</label>
              <input className="input" placeholder="e.g. Drink water, Read 20 mins..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Description (optional)</label>
              <input className="input" placeholder="Why does this habit matter to you?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Icon</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setForm({ ...form, icon: ic })} style={{
                    padding: '6px 10px', borderRadius: 8, border: `2px solid ${form.icon === ic ? '#7c3aed' : 'var(--border)'}`,
                    background: form.icon === ic ? '#ede9fe' : 'white', cursor: 'pointer', fontSize: 20
                  }}>{ic}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Color</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })} style={{
                    width: 28, height: 28, borderRadius: '50%', background: c, border: `3px solid ${form.color === c ? '#1c1917' : 'transparent'}`, cursor: 'pointer'
                  }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={createHabit} disabled={saving} className="btn btn-primary">{saving ? 'Creating...' : 'Create Habit'}</button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
