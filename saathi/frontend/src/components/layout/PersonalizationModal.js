import React, { useState } from 'react';

const THEMES = [
    {
        id: 'default',
        name: 'Aurora Purple',
        desc: 'Light & elegant with purple soul',
        preview: 'linear-gradient(135deg,#f8f7ff,#ede9fe,#fce7f3)',
        accent: '#7c3aed',
        emoji: '🌸',
    },
    {
        id: 'dark-purple',
        name: 'Midnight RPG',
        desc: 'Dark, mysterious, Solo Leveling vibes',
        preview: 'linear-gradient(135deg,#0f0c1a,#1a1528,#2e1065)',
        accent: '#a78bfa',
        emoji: '🌙',
    },
    {
        id: 'pastel',
        name: 'Soft Blossom',
        desc: 'Cute, warm, cozy feminine aesthetic',
        preview: 'linear-gradient(135deg,#fff9fb,#fce7f3,#fdf2f8)',
        accent: '#ec4899',
        emoji: '🌷',
    },
    {
        id: 'minimal',
        name: 'Clean Focus',
        desc: 'Minimal, distraction-free, professional',
        preview: 'linear-gradient(135deg,#f9fafb,#eff6ff,#f3f4f6)',
        accent: '#1d4ed8',
        emoji: '🎯',
    },
];

const LAYOUTS = [
    { id:'default', name:'Balanced', desc:'Standard spacing, works for everything', emoji:'⚖️' },
    { id:'cozy',    name:'Cozy',     desc:'More padding, rounder cards, breathable', emoji:'☕' },
    { id:'compact', name:'Compact',  desc:'Dense info, power user mode', emoji:'⚡' },
];

const FONTS = [
    { id:'default', name:'Inter',    desc:'Clean and modern (default)', preview:'Aa', style:'Inter, sans-serif' },
    { id:'poppins', name:'Poppins',  desc:'Geometric, friendly',        preview:'Aa', style:'Poppins, sans-serif' },
    { id:'nunito',  name:'Nunito',   desc:'Rounded, warm, cute',        preview:'Aa', style:'Nunito, sans-serif' },
    { id:'dm-sans', name:'DM Sans',  desc:'Sharp, professional',        preview:'Aa', style:'DM Sans, sans-serif' },
];

const STEPS = ['theme', 'layout', 'font', 'done'];

export default function PersonalizationModal({ onComplete }) {
    const [step,   setStep]   = useState(0);
    const [choices, setChoices] = useState({ theme:'default', layout:'default', font:'default' });

    const current = STEPS[step];

    const pick = (key, val) => {
        const next = { ...choices, [key]: val };
        setChoices(next);

        // Apply immediately so user sees live preview
        applyTheme(next);
    };

    const applyTheme = (c) => {
        const root = document.documentElement;
        root.setAttribute('data-theme',  c.theme  === 'default' ? '' : c.theme);
        root.setAttribute('data-layout', c.layout === 'default' ? '' : c.layout);
        root.setAttribute('data-font',   c.font   === 'default' ? '' : c.font);
        localStorage.setItem('saathi_theme',  c.theme);
        localStorage.setItem('saathi_layout', c.layout);
        localStorage.setItem('saathi_font',   c.font);
    };

    const next = () => {
        if (step < STEPS.length - 1) setStep(s => s+1);
    };
    const back = () => { if (step > 0) setStep(s => s-1); };

    const finish = () => {
        localStorage.setItem('saathi_personalized', 'true');
        onComplete();
    };

    const theme = THEMES.find(t => t.id === choices.theme) || THEMES[0];

    const progressPct = ((step) / (STEPS.length - 1)) * 100;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
            animation: 'scaleIn 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}>
            <div style={{
                width: '100%', maxWidth: 600,
                background: 'var(--bg-card)',
                borderRadius: 28,
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                animation: 'slideUp 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}>

                {/* Header */}
                <div style={{
                    padding: '28px 32px 20px',
                    background: `linear-gradient(135deg, ${theme.preview.slice(17,-1)})`,
                    borderBottom: '1px solid var(--border)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    {/* Decorative dots */}
                    {[...Array(12)].map((_,i) => (
                        <div key={i} style={{
                            position:'absolute', borderRadius:'50%', background:'rgba(255,255,255,0.3)',
                            width: 4+Math.random()*8, height: 4+Math.random()*8,
                            top: `${Math.random()*100}%`, left: `${Math.random()*100}%`,
                        }} />
                    ))}

                    <div style={{ position:'relative', zIndex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                            <div style={{
                                width:40, height:40, borderRadius:12,
                                background:'rgba(255,255,255,0.3)',
                                backdropFilter:'blur(8px)',
                                display:'flex', alignItems:'center', justifyContent:'center', fontSize:20
                            }}>✨</div>
                            <div>
                                <h2 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:20, color:'#1c1917' }}>
                                    Make SAATHI yours
                                </h2>
                                <p style={{ fontSize:13, color:'#4b5563', marginTop:1 }}>
                                    Step {step+1} of {STEPS.length-1} — personalize your experience
                                </p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ height:4, background:'rgba(255,255,255,0.4)', borderRadius:99, marginTop:14 }}>
                            <div style={{
                                height:'100%', borderRadius:99,
                                background:'rgba(124,58,237,0.8)',
                                width:`${progressPct}%`,
                                transition:'width 0.4s ease'
                            }} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding:'28px 32px' }}>

                    {/* THEME STEP */}
                    {current === 'theme' && (
                        <div style={{ animation:'slideUp 0.3s ease' }}>
                            <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:17, marginBottom:5 }}>
                                Choose your vibe 🎨
                            </h3>
                            <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>
                                Pick a color theme. You can always change this in Settings later.
                            </p>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                                {THEMES.map(t => (
                                    <button key={t.id} onClick={() => pick('theme', t.id)} style={{
                                        padding:'16px', borderRadius:16, cursor:'pointer', textAlign:'left',
                                        border:`2.5px solid ${choices.theme===t.id ? t.accent : 'var(--border)'}`,
                                        background: choices.theme===t.id ? `${t.accent}10` : 'var(--bg-soft)',
                                        transition:'all 0.2s', position:'relative', overflow:'hidden'
                                    }}>
                                        {/* Mini preview */}
                                        <div style={{
                                            height:40, borderRadius:10, marginBottom:10,
                                            background: t.preview, position:'relative'
                                        }}>
                                            <div style={{ position:'absolute', bottom:6, right:6,
                                                width:16, height:16, borderRadius:'50%', background:t.accent }} />
                                        </div>
                                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                                            <span style={{ fontSize:18 }}>{t.emoji}</span>
                                            <div>
                                                <p style={{ fontWeight:700, fontSize:13, color:choices.theme===t.id?t.accent:'var(--text-primary)' }}>
                                                    {t.name}
                                                </p>
                                                <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{t.desc}</p>
                                            </div>
                                        </div>
                                        {choices.theme===t.id && (
                                            <div style={{
                                                position:'absolute', top:8, right:8,
                                                width:20, height:20, borderRadius:'50%',
                                                background:t.accent, display:'flex', alignItems:'center', justifyContent:'center',
                                                color:'white', fontSize:11, fontWeight:700
                                            }}>✓</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* LAYOUT STEP */}
                    {current === 'layout' && (
                        <div style={{ animation:'slideUp 0.3s ease' }}>
                            <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:17, marginBottom:5 }}>
                                Choose your layout 📐
                            </h3>
                            <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>
                                How do you like your information — spacious or dense?
                            </p>
                            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                                {LAYOUTS.map(l => (
                                    <button key={l.id} onClick={() => pick('layout', l.id)} style={{
                                        padding:'16px 20px', borderRadius:14, cursor:'pointer', textAlign:'left',
                                        border:`2.5px solid ${choices.layout===l.id ? 'var(--primary)' : 'var(--border)'}`,
                                        background: choices.layout===l.id ? 'var(--primary-light)' : 'var(--bg-soft)',
                                        display:'flex', alignItems:'center', gap:14, transition:'all 0.2s'
                                    }}>
                                        <span style={{ fontSize:28 }}>{l.emoji}</span>
                                        <div style={{ flex:1 }}>
                                            <p style={{ fontWeight:700, fontSize:14, color:choices.layout===l.id?'var(--primary)':'var(--text-primary)' }}>
                                                {l.name}
                                            </p>
                                            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{l.desc}</p>
                                        </div>
                                        {choices.layout===l.id && (
                                            <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--primary)',
                                                display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:12 }}>✓</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FONT STEP */}
                    {current === 'font' && (
                        <div style={{ animation:'slideUp 0.3s ease' }}>
                            <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:17, marginBottom:5 }}>
                                Choose your font ✍️
                            </h3>
                            <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>
                                Small detail, big difference. Which feels most like you?
                            </p>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                                {FONTS.map(f => (
                                    <button key={f.id} onClick={() => pick('font', f.id)} style={{
                                        padding:'16px', borderRadius:14, cursor:'pointer', textAlign:'left',
                                        border:`2.5px solid ${choices.font===f.id ? 'var(--primary)' : 'var(--border)'}`,
                                        background: choices.font===f.id ? 'var(--primary-light)' : 'var(--bg-soft)',
                                        transition:'all 0.2s'
                                    }}>
                                        <p style={{ fontFamily:f.style, fontSize:28, fontWeight:700, color:'var(--primary)', marginBottom:6 }}>
                                            {f.preview}
                                        </p>
                                        <p style={{ fontWeight:700, fontSize:13, fontFamily:f.style, color:choices.font===f.id?'var(--primary)':'var(--text-primary)' }}>{f.name}</p>
                                        <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2, fontFamily:f.style }}>{f.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* DONE STEP */}
                    {current === 'done' && (
                        <div style={{ textAlign:'center', padding:'12px 0', animation:'slideUp 0.3s ease' }}>
                            <div style={{ fontSize:72, marginBottom:12, animation:'float 2s ease-in-out infinite' }}>🎉</div>
                            <h3 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:24, marginBottom:8 }}>
                                SAATHI is ready for you!
                            </h3>
                            <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.7, maxWidth:380, margin:'0 auto 24px' }}>
                                Your personalized experience is set. You can always change these in <strong>Settings → Appearance</strong>.
                            </p>
                            <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap', marginBottom:8 }}>
                                {[
                                    { label: THEMES.find(t=>t.id===choices.theme)?.name, emoji: THEMES.find(t=>t.id===choices.theme)?.emoji },
                                    { label: LAYOUTS.find(l=>l.id===choices.layout)?.name, emoji: LAYOUTS.find(l=>l.id===choices.layout)?.emoji },
                                    { label: FONTS.find(f=>f.id===choices.font)?.name, emoji: '✍️' },
                                ].map(({label, emoji}) => (
                                    <span key={label} style={{ padding:'6px 14px', borderRadius:99, background:'var(--primary-light)',
                                        color:'var(--primary)', fontSize:12, fontWeight:700 }}>{emoji} {label}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding:'18px 32px 24px',
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    borderTop:'1px solid var(--border)'
                }}>
                    {step > 0 && step < STEPS.length-1 ? (
                        <button onClick={back} className="btn btn-ghost" style={{ fontSize:13 }}>← Back</button>
                    ) : <div />}

                    {current === 'done' ? (
                        <button onClick={finish} className="btn btn-primary" style={{ padding:'12px 36px', fontSize:15 }}>
                            Let's go! 🚀
                        </button>
                    ) : (
                        <button onClick={next} className="btn btn-primary">
                            {step === STEPS.length - 2 ? 'Finish ✨' : 'Next →'}
                        </button>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
        </div>
    );
}
