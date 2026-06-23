import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { setComfortRoom } from '../../store/slices/uiSlice';
import { FiLogOut, FiSliders } from 'react-icons/fi';
import PersonalizationModal from './PersonalizationModal';

// ── 5 main tab groups ────────────────────────────────────
const GROUPS = [
  {
    id: 'core', icon: '🏠', label: 'Core',
    items: [
      { path: '/dashboard', icon: '🏠', label: 'Home' },
      { path: '/mood',      icon: '😊', label: 'Mood Tracker' },
      { path: '/journal',   icon: '📓', label: 'Journal' },
      { path: '/companion', icon: '🤗', label: 'SAATHI AI' },
    ]
  },
  {
    id: 'growth', icon: '🌱', label: 'Growth',
    items: [
      { path: '/habits',      icon: '⚡', label: 'Habits' },
      { path: '/goals',       icon: '🎯', label: 'Goals' },
      { path: '/rpg',         icon: '⚔️', label: 'Life RPG' },
      { path: '/journey',     icon: '📖', label: 'Life Journey' },
      { path: '/personality', icon: '🧠', label: 'Personality' },
      { path: '/purpose',     icon: '🧭', label: 'Purpose' },
      { path: '/career',      icon: '🚀', label: 'Career' },
      { path: '/life-map',    icon: '🗺️', label: 'Life Map' },
    ]
  },
  {
    id: 'wellness', icon: '💜', label: 'Wellness',
    items: [
      { path: '/gratitude',   icon: '🌸', label: 'Gratitude' },
      { path: '/family',      icon: '❤️', label: 'Family Hub' },
      { path: '/focus',       icon: '🌳', label: 'Focus Forest' },
      { path: '/wellness',    icon: '🌿', label: 'Wellness' },
      { path: '/coloring',    icon: '🎨', label: 'Calm Coloring' },
      { path: '/relax',       icon: '🎵', label: 'Relax Hub' },
      { path: '/memories',    icon: '😊', label: 'Memories' },
      { path: '/vault',       icon: '💜', label: 'Reasons to Live' },
      { path: '/inner-circle',icon: '❤️', label: 'Inner Circle' },
      { path: '/stress-game', icon: '💥', label: 'Stress Destroyer' },
    ]
  },
  {
    id: 'explore', icon: '🌍', label: 'Explore',
    items: [
      { path: '/community',         icon: '🌍', label: 'Community' },
      { path: '/ask',               icon: '🙈', label: 'Anon Ask' },
      { path: '/dream-communities', icon: '🌠', label: 'Dream Clubs' },
      { path: '/shorts',            icon: '✨', label: 'SAATHI Shorts' },
      { path: '/surprise',          icon: '🎁', label: 'Daily Surprise' },
      { path: '/island',            icon: '🏝️', label: 'My Island' },
      { path: '/life-library',      icon: '📚', label: 'Life Library' },
      { path: '/hope-library',      icon: '🌟', label: 'Hope Library' },
      { path: '/experts',           icon: '🎓', label: 'Experts' },
    ]
  },
  {
    id: 'account', icon: '⚙️', label: 'Account',
    items: [
      { path: '/notifications', icon: '🔔', label: 'Notifications' },
      { path: '/detox',         icon: '🌿', label: 'Digital Detox' },
      { path: '/ai',            icon: '🤖', label: 'AI Insights' },
      { path: '/offline',       icon: '🔄', label: 'Offline Sync' },
      { path: '/admin',         icon: '⚙️', label: 'Admin' },
    ]
  },
];

export default function Sidebar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useSelector(s => s.auth);

  const [activeGroup,     setActiveGroup]     = useState('core');
  const [showPersonalize, setShowPersonalize] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const currentGroup = GROUPS.find(g => g.id === activeGroup);

  // Auto-highlight correct tab based on current route
  const getActiveGroupId = () => {
    for (const g of GROUPS) {
      if (g.items.some(i => location.pathname.startsWith(i.path))) return g.id;
    }
    return 'core';
  };
  const highlightedGroup = getActiveGroupId();

  return (
    <aside style={{
      width: 240, height: '100vh', position: 'fixed', left: 0, top: 0,
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
      boxShadow: '2px 0 16px rgba(0,0,0,0.06)',
      transition: 'background 0.3s',
    }}>

      {/* ── LOGO ─────────────────────────────── */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--primary), var(--primary-mid))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontFamily: 'Poppins', fontSize: 15,
            boxShadow: '0 4px 10px var(--primary)44', flexShrink: 0,
          }}>S</div>
          <div>
            <span style={{
              fontFamily: 'Poppins', fontWeight: 800, fontSize: 17,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-mid))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>SAATHI</span>
            <p style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: 1.5, marginTop: -1 }}>LIFE COMPANION</p>
          </div>
        </div>

        {/* User chip */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 10,
            background: 'var(--primary)0d',
            border: '1px solid var(--primary)1a',
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 11,
            }}>{user.fullName?.[0]?.toUpperCase() || 'S'}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.fullName?.split(' ')[0]}
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                ⚔️{user.level||1} &nbsp;·&nbsp; ⭐{user.xpPoints||0}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── I NEED SUPPORT ────────────────────── */}
      <div style={{ padding: '8px 12px', flexShrink: 0 }}>
        <button onClick={() => dispatch(setComfortRoom(true))} style={{
          width: '100%', padding: '8px 12px', borderRadius: 10,
          background: 'linear-gradient(135deg,var(--primary)12,var(--accent)0a)',
          border: '1px solid var(--primary)25',
          color: 'var(--primary)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
        }}>
          <span>🫂</span> I Need Support
        </button>
      </div>

      {/* ── TAB BAR ──────────────────────────── */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        padding: '0 6px', flexShrink: 0,
      }}>
        {GROUPS.map(g => {
          const isActive = activeGroup === g.id;
          const isHighlighted = highlightedGroup === g.id;
          return (
            <button key={g.id} onClick={() => setActiveGroup(g.id)} style={{
              flex: 1, padding: '8px 4px 6px', border: 'none', cursor: 'pointer',
              background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              borderBottom: `2.5px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
              transition: 'all 0.15s',
              opacity: isActive ? 1 : 0.55,
            }}>
              <span style={{
                fontSize: 18,
                filter: isActive ? 'none' : 'grayscale(30%)',
              }}>{g.icon}</span>
              <span style={{
                fontSize: 8, fontWeight: isActive ? 700 : 400,
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                letterSpacing: 0.3,
              }}>{g.label}</span>
              {isHighlighted && !isActive && (
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)', marginTop: -2 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── NAV ITEMS ─────────────────────────── */}
      <nav style={{
        flex: 1, overflowY: 'auto', padding: '8px 8px',
        scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent',
      }}>
        <p style={{
          fontSize: 9, fontWeight: 800, letterSpacing: 1.5,
          color: 'var(--primary)', textTransform: 'uppercase',
          padding: '4px 8px 8px', opacity: 0.8,
        }}>{currentGroup?.label}</p>

        {currentGroup?.items.map(({ path, icon, label }) => (
          <NavLink key={path} to={path} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 10, marginBottom: 2,
            textDecoration: 'none', fontSize: 13,
            fontWeight: isActive ? 600 : 400,
            background: isActive
              ? 'linear-gradient(135deg,var(--primary)18,var(--primary-mid)10)'
              : 'transparent',
            color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
            transition: 'all 0.15s',
          })}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── BOTTOM ────────────────────────────── */}
      <div style={{
        padding: '8px 12px 12px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 8, flexShrink: 0,
      }}>
        <button onClick={() => setShowPersonalize(true)} style={{
          flex: 1, padding: '7px', borderRadius: 9, cursor: 'pointer',
          border: '1px solid var(--border)', background: 'var(--bg-soft)',
          color: 'var(--primary)', fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-soft)'}
        >
          <FiSliders size={12} /> Theme
        </button>
        <button onClick={handleLogout} style={{
          flex: 1, padding: '7px', borderRadius: 9, cursor: 'pointer',
          border: '1px solid #fecdd3', background: 'transparent',
          color: '#ef4444', fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <FiLogOut size={12} /> Logout
        </button>
      </div>

      {showPersonalize && (
        <PersonalizationModal onComplete={() => setShowPersonalize(false)} />
      )}
    </aside>
  );
}


