import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { setComfortRoom } from '../../store/slices/uiSlice';
import { FiLogOut, FiChevronDown, FiChevronRight, FiSliders } from 'react-icons/fi';
import PersonalizationModal from './PersonalizationModal';

const NAV_SECTIONS = [
    { label:'Core', items:[
            { path:'/dashboard', icon:'🏠', label:'Home' },
            { path:'/mood',      icon:'😊', label:'Mood Tracker' },
            { path:'/journal',   icon:'📓', label:'Journal' },
            { path:'/companion', icon:'🤗', label:'SAATHI AI' },
        ]},
    { label:'Growth', items:[
            { path:'/habits',  icon:'⚡', label:'Habits' },
            { path:'/goals',   icon:'🎯', label:'Goals' },
            { path:'/rpg',     icon:'⚔️', label:'Life RPG' },
            { path:'/journey', icon:'📖', label:'Life Journey' },
        ]},
    { label:'Self-Discovery', items:[
            { path:'/personality', icon:'🧠', label:'Personality' },
            { path:'/purpose',     icon:'🧭', label:'Purpose Discovery' },
            { path:'/career',      icon:'🚀', label:'Career Guidance' },
        ]},
    { label:'World', items:[
            { path:'/island',     icon:'🏝️', label:'Personal Island' },
            { path:'/connection', icon:'❤️',  label:'Connection Score' },
            { path:'/shorts',     icon:'✨',  label:'SAATHI Shorts' },
            { path:'/surprise',   icon:'🎁',  label:'Daily Surprise' },
        ]},
    { label:'Wisdom', items:[
            { path:'/life-library', icon:'📚', label:'Life Library' },
            { path:'/hope-library', icon:'🌟', label:'Hope Library' },
            { path:'/experts',      icon:'🎓', label:'Expert Creators' },
        ]},
    { label:'Wellbeing', items:[
            { path:'/family',    icon:'❤️', label:'Family Hub' },
            { path:'/gratitude', icon:'🌱', label:'Gratitude Garden' },
            { path:'/pet',       icon:'🐾', label:'Virtual Pet' },
            { path:'/dreams',    icon:'🏰', label:'Dream Tower' },
        ]},
    { label:'Safe Space', items:[
            { path:'/vault',        icon:'💜', label:'Reasons to Live' },
            { path:'/inner-circle', icon:'❤️', label:'Inner Circle' },
            { path:'/stress-game',  icon:'💥', label:'Stress Destroyer' },
        ]},
    { label:'Community', items:[
            { path:'/community',         icon:'🌍', label:'Community' },
            { path:'/ask',               icon:'🙈', label:'Anonymous Ask' },
            { path:'/dream-communities', icon:'🌠', label:'Dream Communities' },
            { path:'/focus',             icon:'🌳', label:'Focus Forest' },
        ]},
    { label:'Calm Corner', items:[
            { path:'/coloring', icon:'🎨', label:'Calm Coloring' },
            { path:'/relax',    icon:'🎵', label:'Relaxation Hub' },
            { path:'/memories', icon:'😊', label:'Positive Memories' },
            { path:'/life-map', icon:'🗺️', label:'Life Map' },
            { path:'/wellness', icon:'🌿', label:'Wellness' },
        ]},
    { label:'Account', items:[
            { path:'/notifications', icon:'🔔', label:'Notifications' },
            { path:'/detox',         icon:'🌿', label:'Digital Detox' },
            { path:'/ai',            icon:'🤖', label:'AI Insights' },
            { path:'/offline',       icon:'🔄', label:'Offline & Sync' },
            { path:'/admin',         icon:'⚙️', label:'Admin Panel' },
        ]},
];

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(s => s.auth);
    const [openSections, setOpenSections] = useState({ Core: true });
    const [showPersonalize, setShowPersonalize] = useState(false);

    const toggle = (label) => setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
    const handleLogout = () => { dispatch(logout()); navigate('/login'); };

    return (
        <aside style={{
            width: 240, height: '100vh', position: 'fixed', left: 0, top: 0,
            background: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', zIndex: 100,
            boxShadow: '2px 0 16px rgba(0,0,0,0.08)',
            transition: 'background 0.3s',
        }}>

            {/* Logo */}
            <div style={{
                padding: '18px 18px 14px',
                borderBottom: '1px solid var(--border)',
                flexShrink: 0,
                background: 'linear-gradient(135deg, var(--primary)18, transparent)',
            }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{
                        width:36, height:36, borderRadius:11,
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-mid))',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:'white', fontWeight:800, fontFamily:'Poppins', fontSize:16,
                        boxShadow: '0 4px 12px var(--primary)44',
                    }}>S</div>
                    <div>
            <span style={{
                fontFamily:'Poppins', fontWeight:800, fontSize:18,
                background: 'linear-gradient(135deg, var(--primary), var(--primary-mid))',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>SAATHI</span>
                        <p style={{ fontSize:9, color:'var(--text-muted)', letterSpacing:1.5, marginTop:-1 }}>
                            LIFE COMPANION
                        </p>
                    </div>
                </div>

                {user && (
                    <div style={{
                        marginTop:10, padding:'8px 10px', borderRadius:10,
                        background: 'var(--primary)10',
                        border: '1px solid var(--primary)20',
                        display:'flex', alignItems:'center', gap:8,
                    }}>
                        <div style={{
                            width:28, height:28, borderRadius:8,
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            color:'white', fontWeight:700, fontSize:12, flexShrink:0,
                        }}>
                            {user.fullName?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div style={{ minWidth:0 }}>
                            <p style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                {user.fullName?.split(' ')[0]}
                            </p>
                            <p style={{ fontSize:10, color:'var(--text-muted)' }}>
                                ⚔️ Lvl {user.level||1} &nbsp;·&nbsp; ⭐ {user.xpPoints||0} XP
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* I Need Support */}
            <div style={{ padding:'10px 12px', flexShrink:0 }}>
                <button onClick={() => dispatch(setComfortRoom(true))} style={{
                    width:'100%', padding:'9px 12px', borderRadius:12,
                    background: 'linear-gradient(135deg, var(--primary)15, var(--accent)10)',
                    border: '1px solid var(--primary)30',
                    color: 'var(--primary)',
                    fontWeight:700, fontSize:12, cursor:'pointer',
                    display:'flex', alignItems:'center', gap:7,
                    transition:'all 0.2s',
                }}
                        onMouseEnter={e => e.currentTarget.style.background='linear-gradient(135deg, var(--primary)25, var(--accent)15)'}
                        onMouseLeave={e => e.currentTarget.style.background='linear-gradient(135deg, var(--primary)15, var(--accent)10)'}
                >
                    <span style={{ fontSize:16 }}>🫂</span>
                    <span>I Need Support</span>
                </button>
            </div>

            {/* Nav */}
            <nav style={{
                flex:1, overflowY:'auto', padding:'4px 8px',
                scrollbarWidth:'thin',
                scrollbarColor: 'var(--border) transparent',
            }}>
                {NAV_SECTIONS.map(section => {
                    const isOpen = !!openSections[section.label];
                    return (
                        <div key={section.label} style={{ marginBottom:1 }}>
                            <button onClick={() => toggle(section.label)} style={{
                                width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                                padding:'6px 8px', borderRadius:8, border:'none', cursor:'pointer',
                                background: isOpen ? 'var(--primary)12' : 'transparent',
                                transition:'all 0.15s',
                            }}
                                    onMouseEnter={e => { if(!isOpen) e.currentTarget.style.background='var(--primary)08'; }}
                                    onMouseLeave={e => { if(!isOpen) e.currentTarget.style.background='transparent'; }}
                            >
                <span style={{
                    fontSize:10, fontWeight:700, letterSpacing:1.2,
                    color: isOpen ? 'var(--primary)' : 'var(--text-muted)',
                    textTransform:'uppercase',
                }}>
                  {section.label}
                </span>
                                {isOpen
                                    ? <FiChevronDown size={11} color="var(--primary)" />
                                    : <FiChevronRight size={11} color="var(--text-muted)" />
                                }
                            </button>

                            {isOpen && (
                                <div style={{ paddingLeft:0, marginBottom:2 }}>
                                    {section.items.map(({ path, icon, label }) => (
                                        <NavLink key={path} to={path} style={({ isActive }) => ({
                                            display:'flex', alignItems:'center', gap:9,
                                            padding:'7px 10px', borderRadius:9, marginBottom:1,
                                            textDecoration:'none', fontSize:13, fontWeight: isActive ? 600 : 400,
                                            background: isActive
                                                ? 'linear-gradient(135deg, var(--primary)20, var(--primary-mid)15)'
                                                : 'transparent',
                                            color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                                            transition:'all 0.15s',
                                        })}>
                                            <span style={{ fontSize:14 }}>{icon}</span>
                                            <span>{label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom bar */}
            <div style={{
                padding:'10px 12px', borderTop:'1px solid var(--border)',
                display:'flex', gap:8, flexShrink:0,
                background:'var(--primary)06',
            }}>
                <button onClick={() => setShowPersonalize(true)} style={{
                    flex:1, padding:'8px', borderRadius:10, border:'1px solid var(--border)',
                    background:'var(--bg-soft)', color:'var(--primary)',
                    cursor:'pointer', fontSize:11, fontWeight:600,
                    display:'flex', alignItems:'center', justifyContent:'center', gap:5,
                    transition:'all 0.15s',
                }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--primary-light)'}
                        onMouseLeave={e => e.currentTarget.style.background='var(--bg-soft)'}
                >
                    <FiSliders size={13} /> Theme
                </button>
                <button onClick={handleLogout} style={{
                    flex:1, padding:'8px', borderRadius:10, border:'1px solid #fecdd3',
                    background:'transparent', color:'#ef4444',
                    cursor:'pointer', fontSize:11, fontWeight:600,
                    display:'flex', alignItems:'center', justifyContent:'center', gap:5,
                    transition:'all 0.15s',
                }}
                        onMouseEnter={e => e.currentTarget.style.background='#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                    <FiLogOut size={13} /> Logout
                </button>
            </div>

            {showPersonalize && (
                <PersonalizationModal onComplete={() => setShowPersonalize(false)} />
            )}
        </aside>
    );
}

