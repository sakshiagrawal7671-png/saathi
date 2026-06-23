import React, { useState, useEffect } from 'react';
import { gratitudeApi } from '../services/api';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STAGES = {
  SEED: { emoji: '🌰', label: 'Seed', color: '#92400e', next: 5 },
  SPROUT: { emoji: '🌱', label: 'Sprout', color: '#15803d', next: 15 },
  PLANT: { emoji: '🌿', label: 'Plant', color: '#16a34a', next: 30 },
  TREE: { emoji: '🌳', label: 'Tree', color: '#15803d', next: 60 },
  FOREST: { emoji: '🌲', label: 'Forest', color: '#166534', next: 100 },
  PARADISE: { emoji: '🌴', label: 'Paradise', color: '#047857', next: null },
};

const CATEGORIES = ['People', 'Moments', 'Things', 'Health', 'Growth', 'Nature', 'Opportunities', 'Lessons'];

export default function GratitudePage() {
  const [entries, setEntries] = useState([]);
  const [garden, setGarden] = useState(null);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Moments');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [e, g] = await Promise.all([gratitudeApi.getAll(), gratitudeApi.getGarden()]);
    setEntries(e.data.data || []);
    setGarden(g.data.data);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!content.trim()) return toast.error('Write something you are grateful for');
    setSaving(true);
    try {
      await gratitudeApi.add({ content, category });
      toast.success('Gratitude added 🌱');
      setContent(''); load();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const stage = garden ? STAGES[garden.gardenStage] || STAGES.SEED : STAGES.SEED;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26 }}>Gratitude Garden 🌸</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Every gratitude grows your garden. Watch it bloom.</p>
      </div>

      {/* Garden Stage */}
      <div style={{
        borderRadius: 24, padding: '32px', marginBottom: 24,
        background: 'linear-gradient(135deg,#f0fdf4,#dcfce7,#fef9c3)',
        border: '1px solid #bbf7d0', textAlign: 'center'
      }}>
        <div style={{ fontSize: 80, marginBottom: 8, animation: 'float 3s ease-in-out infinite' }}>{stage.emoji}</div>
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 22, color: stage.color }}>
          {stage.label} Garden
        </h2>
        <p style={{ color: '#374151', marginTop: 4, fontSize: 15 }}>
          {garden?.totalEntries || 0} gratitudes planted
        </p>
        {stage.next && (
          <div style={{ marginTop: 16, maxWidth: 300, margin: '16px auto 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
              <span>Progress to next stage</span>
              <span>{garden?.totalEntries || 0} / {stage.next}</span>
            </div>
            <div style={{ background: '#d1fae5', borderRadius: 99, height: 8 }}>
              <div style={{ height: '100%', borderRadius: 99, background: stage.color,
                width: `${Math.min(100, ((garden?.totalEntries || 0) / stage.next) * 100)}%`, transition: 'width 0.5s' }} />
            </div>
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
              {Math.max(0, stage.next - (garden?.totalEntries || 0))} more to reach {Object.values(STAGES)[Object.keys(STAGES).indexOf(garden?.gardenStage || 'SEED') + 1]?.label}
            </p>
          </div>
        )}
      </div>

      {/* Add Gratitude */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 14 }}>🙏 What are you grateful for today?</h3>
        <textarea className="input" rows={3} placeholder="I'm grateful for... (a person, a moment, a simple thing, anything!)"
          value={content} onChange={e => setContent(e.target.value)}
          style={{ marginBottom: 12, resize: 'none', lineHeight: 1.7 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: '5px 12px', borderRadius: 99, border: `1.5px solid ${category === c ? '#7c3aed' : 'var(--border)'}`,
              background: category === c ? '#ede9fe' : 'transparent', color: category === c ? '#7c3aed' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 12, fontWeight: category === c ? 600 : 400
            }}>{c}</button>
          ))}
        </div>
        <button onClick={save} disabled={saving || !content.trim()} className="btn btn-primary">
          <FiPlus /> {saving ? 'Planting...' : 'Plant This Gratitude 🌱'}
        </button>
      </div>

      {/* Entries */}
      <div>
        <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 14 }}>Your Gratitude Garden</h3>
        {entries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
            <p style={{ color: 'var(--text-secondary)' }}>Plant your first seed of gratitude above</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {entries.map((e, i) => (
              <div key={e.id} className="card" style={{ padding: '16px 20px',
                background: i % 4 === 0 ? '#f0fdf4' : i % 4 === 1 ? '#fef9c3' : i % 4 === 2 ? '#fdf4ff' : '#fff7ed' }}>
                <p style={{ lineHeight: 1.6, fontSize: 14, marginBottom: 8 }}>{e.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                  <span style={{ background: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: 99 }}>{e.category}</span>
                  <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
