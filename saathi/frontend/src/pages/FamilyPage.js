import React, { useState, useEffect } from 'react';
import { familyApi } from '../services/api';
import { FiPlus, FiTrash2, FiPhone, FiMessageCircle, FiHeart, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RELATIONSHIPS = ['Mom', 'Dad', 'Sister', 'Brother', 'Spouse', 'Friend', 'Mentor', 'Teacher', 'Grandmother', 'Grandfather', 'Other'];
const AVATARS = ['👩', '👨', '👧', '👦', '👵', '👴', '🧑', '👩‍🦱', '👨‍🦳', '🧔'];

export default function FamilyPage() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', relationship: 'Mom', phone: '', email: '', avatarUrl: '👩', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = () => familyApi.getAll().then(r => setMembers(r.data.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name.trim()) return toast.error('Enter a name');
    setSaving(true);
    try {
      await familyApi.add(form);
      toast.success(`${form.name} added to your circle ❤️`);
      setShowForm(false); setForm({ name: '', relationship: 'Mom', phone: '', email: '', avatarUrl: '👩', notes: '' });
      load();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const del = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    await familyApi.delete(id);
    toast.success('Removed'); load();
  };

  const contact = async (member, type) => {
    await familyApi.recordContact(member.id);
    if (type === 'call' && member.phone) {
      window.open(`tel:${member.phone}`);
    } else if (type === 'whatsapp' && member.phone) {
      window.open(`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}?text=Hi ${member.name}! Just thinking of you 💜`);
    } else {
      toast.success(`Marked as contacted! Remember to reach out to ${member.name} 💜`);
    }
  };

  const getDaysSinceContact = (lastContactedAt) => {
    if (!lastContactedAt) return null;
    const diff = Math.floor((Date.now() - new Date(lastContactedAt)) / 86400000);
    return diff;
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26 }}>Family Bonding Hub ❤️</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Stay connected with the people who matter most.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> Add Person</button>
      </div>

      {/* Warm header */}
      <div style={{
        borderRadius: 20, padding: '24px 28px', marginBottom: 24,
        background: 'linear-gradient(135deg,#fef2f2,#fff7ed,#fdf4ff)',
        border: '1px solid #fecdd3'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>🏠</span>
          <div>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 18, color: '#9a3412' }}>Your Inner Circle</h2>
            <p style={{ fontSize: 13, color: '#c2410c' }}>These people love you. Don't let distance grow.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
          {[
            { label: 'People in your circle', value: members.length, icon: '❤️' },
            { label: 'Connections this week', value: members.filter(m => getDaysSinceContact(m.lastContactedAt) <= 7).length, icon: '💬' },
            { label: 'Needs your attention', value: members.filter(m => !m.lastContactedAt || getDaysSinceContact(m.lastContactedAt) > 7).length, icon: '🔔' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: '10px 16px' }}>
              <p style={{ fontSize: 11, color: '#92400e' }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#9a3412' }}>{icon} {value}</p>
            </div>
          ))}
        </div>
      </div>

      {members.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 56 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>👨‍👩‍👧‍👦</div>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 8 }}>Build your circle</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 340, margin: '0 auto 24px' }}>
            Add the people who matter most — family, friends, mentors. Stay connected.
          </p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> Add First Person</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {members.map(member => {
            const daysSince = getDaysSinceContact(member.lastContactedAt);
            const needsContact = !member.lastContactedAt || daysSince > 7;
            return (
              <div key={member.id} className="card" style={{ padding: '20px', borderColor: needsContact ? '#fca5a5' : 'var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#fce7f3,#ede9fe)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26
                    }}>{member.avatarUrl || '👤'}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{member.name}</p>
                      <span className="badge badge-peach" style={{ fontSize: 11 }}>{member.relationship}</span>
                    </div>
                  </div>
                  <button onClick={() => del(member.id, member.name)} className="btn btn-ghost" style={{ padding: '4px 6px', color: '#ef4444' }}>
                    <FiTrash2 size={12} />
                  </button>
                </div>

                {member.notes && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, fontStyle: 'italic' }}>"{member.notes}"</p>}

                {daysSince !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11,
                    color: needsContact ? '#dc2626' : '#10b981', marginBottom: 12 }}>
                    <FiCalendar size={11} />
                    {needsContact ? `${daysSince} days since contact — reach out!` : `Contacted ${daysSince} days ago ✓`}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  {member.phone && (
                    <button onClick={() => contact(member, 'call')} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12, gap: 4 }}>
                      <FiPhone size={13} /> Call
                    </button>
                  )}
                  <button onClick={() => contact(member, 'whatsapp')} className="btn" style={{
                    flex: 1, justifyContent: 'center', fontSize: 12, gap: 4,
                    background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac'
                  }}>
                    <FiMessageCircle size={13} /> WhatsApp
                  </button>
                  <button onClick={() => contact(member, 'record')} className="btn btn-ghost" style={{ padding: '8px 10px' }}>
                    <FiHeart size={13} color="#ef4444" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480 }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 20 }}>Add to Your Circle</h2>
            {[
              { label: 'Name *', key: 'name', type: 'text', placeholder: 'Their name' },
              { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 xxxxxxxx' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'their@email.com' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label className="label">{label}</label>
                <input className="input" type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label className="label">Relationship</label>
              <select className="input" value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })}>
                {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Avatar</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setForm({ ...form, avatarUrl: a })} style={{
                    padding: '6px 10px', borderRadius: 8, border: `2px solid ${form.avatarUrl === a ? '#7c3aed' : 'var(--border)'}`,
                    background: form.avatarUrl === a ? '#ede9fe' : 'white', cursor: 'pointer', fontSize: 22
                  }}>{a}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Notes (optional)</label>
              <input className="input" placeholder="A note about them..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Add to Circle ❤️'}</button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
