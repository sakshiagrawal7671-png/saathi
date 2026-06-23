import React, { useState, useEffect } from 'react';
import { journalApi } from '../services/api';
import { FiPlus, FiTrash2, FiEdit2, FiLock, FiCalendar, FiMic } from 'react-icons/fi';
import VoiceRecorder from '../components/journal/VoiceRecorder';
import toast from 'react-hot-toast';

const MOODS = { VERY_HAPPY:'😄', HAPPY:'😊', CALM:'😌', HOPEFUL:'🌟', NEUTRAL:'😐', TIRED:'😴', ANXIOUS:'😰', SAD:'😢', ANGRY:'😠', VERY_SAD:'😭' };

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', mood: 'NEUTRAL', isPrivate: true, type: 'TEXT' });
  const [showVoice, setShowVoice] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = () => journalApi.getAll().then(r => setEntries(r.data.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title.trim()) return toast.error('Please add a title');
    setSaving(true);
    try {
      if (editing) {
        await journalApi.update(editing.id, form);
        toast.success('Entry updated');
      } else {
        await journalApi.create(form);
        toast.success('Journal entry saved ✨');
      }
      load(); setShowForm(false); setEditing(null);
      setForm({ title: '', content: '', mood: 'NEUTRAL', isPrivate: true });
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const del = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this entry?')) return;
    await journalApi.delete(id);
    toast.success('Entry deleted');
    load(); if (selected?.id === id) setSelected(null);
  };

  const openEdit = (entry, e) => {
    e.stopPropagation();
    setEditing(entry);
    setForm({ title: entry.title, content: entry.content || '', mood: entry.mood || 'NEUTRAL', isPrivate: entry.isPrivate });
    setShowForm(true);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26 }}>My Journal 📓</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>A safe space for your thoughts and feelings.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', content: '', mood: 'NEUTRAL', isPrivate: true }); }}
          className="btn btn-primary">
          <FiPlus /> New Entry
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 20 }}>{editing ? 'Edit Entry' : 'New Journal Entry'}</h2>

            <div style={{ marginBottom: 16 }}>
              <label className="label">Title</label>
              <input className="input" placeholder="Give this entry a title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="label">How are you feeling?</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(MOODS).map(([type, emoji]) => (
                  <button key={type} onClick={() => setForm({ ...form, mood: type })} style={{
                    padding: '6px 12px', borderRadius: 99, border: `2px solid ${form.mood === type ? '#7c3aed' : 'var(--border)'}`,
                    background: form.mood === type ? '#ede9fe' : 'white', cursor: 'pointer', fontSize: 18
                  }}>{emoji}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <label className="label" style={{ margin:0 }}>Your thoughts</label>
                <button type="button" onClick={() => setShowVoice(!showVoice)}
                  className="btn btn-ghost" style={{ fontSize:12, gap:4 }}>
                  <FiMic size={13} /> {showVoice ? 'Hide mic' : 'Voice journal'}
                </button>
              </div>
              {showVoice && (
                <div style={{ marginBottom:12 }}>
                  <VoiceRecorder
                    onTranscript={(t) => setForm(f => ({ ...f, content: t, type: 'VOICE' }))}
                    onStop={(t) => setForm(f => ({ ...f, content: f.content || t, type: 'VOICE' }))}
                  />
                </div>
              )}
              <textarea className="input" rows={showVoice ? 4 : 8} placeholder="Write freely... this is your safe space. No judgment here."
                value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                style={{ resize: 'vertical', lineHeight: 1.7 }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <input type="checkbox" id="private" checked={form.isPrivate} onChange={e => setForm({ ...form, isPrivate: e.target.checked })} />
              <label htmlFor="private" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <FiLock size={13} /> Keep this private
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : editing ? 'Update Entry' : 'Save Entry'}</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entries.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📝</div>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 8 }}>Start your journal</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Writing helps you process emotions and grow.</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> First Entry</button>
            </div>
          ) : entries.map(entry => (
            <div key={entry.id} onClick={() => setSelected(selected?.id === entry.id ? null : entry)} className="card"
              style={{ cursor: 'pointer', borderColor: selected?.id === entry.id ? '#7c3aed' : 'var(--border)',
                background: selected?.id === entry.id ? '#faf5ff' : 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{MOODS[entry.mood] || '😐'}</span>
                    <h3 style={{ fontWeight: 600, fontSize: 15 }}>{entry.title}</h3>
                    {entry.isPrivate && <FiLock size={12} color="var(--text-muted)" />}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {entry.content || 'No content'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                    <FiCalendar size={11} />
                    {new Date(entry.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {entry.burnoutRisk && <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: 99 }}>⚠ Burnout Risk</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                  <button onClick={e => openEdit(entry, e)} className="btn btn-ghost" style={{ padding: '6px 8px' }}><FiEdit2 size={13} /></button>
                  <button onClick={e => del(entry.id, e)} className="btn btn-ghost" style={{ padding: '6px 8px', color: '#ef4444' }}><FiTrash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="card" style={{ position: 'sticky', top: 0, height: 'fit-content', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>{MOODS[selected.mood] || '😐'}</span>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 18 }}>{selected.title}</h2>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              {new Date(selected.createdAt).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p style={{ lineHeight: 1.8, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{selected.content}</p>
            {selected.aiAnalysis && (
              <div style={{ marginTop: 20, padding: '14px 16px', background: '#f5f3ff', borderRadius: 12, border: '1px solid #ddd6fe' }}>
                <p style={{ fontWeight: 600, fontSize: 12, color: '#7c3aed', marginBottom: 6 }}>✨ AI REFLECTION</p>
                <p style={{ fontSize: 13, color: '#5b21b6', lineHeight: 1.6 }}>{selected.aiAnalysis}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
