import React, { useState, useEffect } from 'react';
import { goalApi } from '../services/api';
import { FiPlus, FiTrash2, FiCheck, FiTarget } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATS = ['CAREER','EDUCATION','HEALTH','RELATIONSHIPS','FINANCE','PERSONAL_GROWTH','FAMILY','HOBBY','OTHER'];
const CAT_META = {
  CAREER: { icon: '💼', color: '#0ea5e9' }, EDUCATION: { icon: '📚', color: '#7c3aed' },
  HEALTH: { icon: '💪', color: '#10b981' }, RELATIONSHIPS: { icon: '❤️', color: '#ef4444' },
  FINANCE: { icon: '💰', color: '#f59e0b' }, PERSONAL_GROWTH: { icon: '🌱', color: '#84cc16' },
  FAMILY: { icon: '🏠', color: '#f97316' }, HOBBY: { icon: '🎨', color: '#ec4899' },
  OTHER: { icon: '⭐', color: '#8b5cf6' },
};

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'PERSONAL_GROWTH', targetDate: '' });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const load = () => goalApi.getAll().then(r => setGoals(r.data.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title.trim()) return toast.error('Enter a goal title');
    setSaving(true);
    try {
      await goalApi.create(form);
      toast.success('Goal set! You can do this 🌟');
      setShowForm(false); setForm({ title: '', description: '', category: 'PERSONAL_GROWTH', targetDate: '' });
      load();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const updateProgress = async (id, progress) => {
    await goalApi.updateProgress(id, progress);
    load();
  };

  const complete = async (id) => {
    await goalApi.updateStatus(id, 'COMPLETED');
    toast.success('Goal completed! Amazing work! 🎉');
    load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    await goalApi.delete(id);
    toast.success('Goal removed'); load();
  };

  const filtered = filter === 'ALL' ? goals : goals.filter(g => g.status === filter);
  const active = goals.filter(g => g.status === 'IN_PROGRESS').length;
  const done = goals.filter(g => g.status === 'COMPLETED').length;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26 }}>My Goals 🎯</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Your dreams deserve a roadmap.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> New Goal</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {[{ label: 'Active Goals', value: active, icon: '🎯', color: '#7c3aed' },
          { label: 'Completed', value: done, icon: '🏆', color: '#10b981' },
          { label: 'Total Goals', value: goals.length, icon: '⭐', color: '#f59e0b' }
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 24, color }}>{value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['ALL','IN_PROGRESS','COMPLETED','PAUSED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`btn ${filter === s ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 12 }}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 56 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}><FiTarget size={56} color="#7c3aed" /></div>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 8 }}>Set your first goal</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 340, margin: '0 auto 20px' }}>Your dreams are valid. Let's give them a direction.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> Set a Goal</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(goal => {
            const meta = CAT_META[goal.category] || CAT_META.OTHER;
            return (
              <div key={goal.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ fontSize: 28, lineHeight: 1 }}>{meta.icon}</div>
                    <div>
                      <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{goal.title}</h3>
                      {goal.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{goal.description}</p>}
                      <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                        <span className="badge" style={{ background: `${meta.color}18`, color: meta.color, fontSize: 11 }}>{goal.category.replace('_', ' ')}</span>
                        {goal.targetDate && (
                          <span className="badge badge-sky" style={{ fontSize: 11 }}>
                            📅 {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        )}
                        <span className={`badge ${goal.status === 'COMPLETED' ? 'badge-mint' : goal.status === 'PAUSED' ? 'badge-peach' : 'badge-lavender'}`} style={{ fontSize: 11 }}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {goal.status === 'IN_PROGRESS' && (
                      <button onClick={() => complete(goal.id)} className="btn btn-ghost" style={{ padding: '6px 10px', color: '#10b981', fontSize: 12, gap: 4 }}>
                        <FiCheck size={13} /> Done
                      </button>
                    )}
                    <button onClick={() => del(goal.id)} className="btn btn-ghost" style={{ padding: '6px 8px', color: '#ef4444' }}>
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>

                {goal.status !== 'COMPLETED' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 600, color: meta.color }}>{goal.progress}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={goal.progress}
                      onChange={e => updateProgress(goal.id, Number(e.target.value))}
                      style={{ width: '100%', accentColor: meta.color, height: 6, cursor: 'pointer' }} />
                  </div>
                )}

                {goal.status === 'COMPLETED' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, padding: '8px 12px', background: '#f0fdf4', borderRadius: 10 }}>
                    <span style={{ fontSize: 20 }}>🏆</span>
                    <p style={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>Goal achieved! You should be proud of yourself.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480 }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 20 }}>Set a New Goal 🎯</h2>
            <div style={{ marginBottom: 14 }}>
              <label className="label">What do you want to achieve?</label>
              <input className="input" placeholder="e.g. Learn guitar, Get fit, Read 12 books..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Why does this matter to you? (optional)</label>
              <textarea className="input" rows={3} placeholder="Your deeper motivation..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'none' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATS.map(c => <option key={c} value={c}>{CAT_META[c]?.icon} {c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Target Date (optional)</label>
              <input className="input" type="date" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Set This Goal 🌟'}</button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
