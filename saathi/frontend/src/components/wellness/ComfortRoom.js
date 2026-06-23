import React from 'react';
import { useDispatch } from 'react-redux';
import { setComfortRoom } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

const RESOURCES = [
  { label: 'Talk to SAATHI AI', icon: '🤗', desc: 'Your compassionate AI companion', path: '/companion', color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Write in Journal', icon: '📓', desc: 'Release what\'s on your mind', path: '/journal', color: '#10b981', bg: '#f0fdf4' },
  { label: 'Breathing Exercise', icon: '🌬️', desc: 'Calm your nervous system', path: '/wellness', color: '#0ea5e9', bg: '#eff6ff' },
  { label: 'Gratitude Garden', icon: '🌱', desc: 'Find something to be grateful for', path: '/gratitude', color: '#f59e0b', bg: '#fefce8' },
  { label: 'Contact Family', icon: '❤️', desc: 'Reach out to someone who loves you', path: '/family', color: '#ef4444', bg: '#fff1f2' },
  { label: 'Community Support', icon: '🤝', desc: 'You\'re not alone here', path: '/community', color: '#8b5cf6', bg: '#faf5ff' },
];

const CRISIS_RESOURCES = [
  { name: 'iCall (India)', number: '9152987821', desc: 'Mon–Sat, 8am–10pm' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 helpline' },
  { name: 'SNEHI', number: '044-24640050', desc: 'Emotional support' },
  { name: 'International Crisis', number: 'findahelpline.com', desc: 'Find local resources' },
];

export default function ComfortRoom() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const go = (path) => { dispatch(setComfortRoom(false)); navigate(path); };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white', borderRadius: 28, width: '100%', maxWidth: 640,
        maxHeight: '90vh', overflowY: 'auto', padding: 36, position: 'relative',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)'
      }}>
        <button onClick={() => dispatch(setComfortRoom(false))} style={{
          position: 'absolute', top: 20, right: 20, background: 'var(--soft-gray)',
          border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--text-secondary)'
        }}><FiX size={18} /></button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🫂</div>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 24, color: '#7c3aed', marginBottom: 8 }}>
            You Are Not Alone
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
            Whatever you're feeling right now is valid. You reached out — that takes courage.<br />
            Here are some ways we can support you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          {RESOURCES.map(({ label, icon, desc, path, color, bg }) => (
            <button key={label} onClick={() => go(path)} style={{
              padding: '16px', borderRadius: 16, border: `1.5px solid ${color}30`,
              background: bg, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
              <p style={{ fontWeight: 600, fontSize: 14, color, marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</p>
            </button>
          ))}
        </div>

        <div style={{ borderRadius: 16, padding: '20px 24px', background: '#fef2f2', border: '1px solid #fecaca' }}>
          <p style={{ fontWeight: 700, color: '#dc2626', marginBottom: 12, fontSize: 14 }}>
            🆘 If you're in crisis, please reach out:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CRISIS_RESOURCES.map(({ name, number, desc }) => (
              <div key={name} style={{ background: 'white', borderRadius: 12, padding: '10px 14px', border: '1px solid #fecaca' }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: '#dc2626' }}>{name}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1c1917' }}>{number}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#9a3412', marginTop: 12, textAlign: 'center' }}>
            💜 You matter. Your life has value. Please reach out to a trusted person or professional.
          </p>
        </div>
      </div>
    </div>
  );
}
