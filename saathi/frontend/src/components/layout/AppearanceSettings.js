import React, { useState } from 'react';

const THEMES = [
    { id:'default',     name:'Aurora Purple', emoji:'🌸', accent:'#7c3aed', preview:'linear-gradient(135deg,#f8f7ff,#ede9fe)' },
    { id:'dark-purple', name:'Midnight RPG',  emoji:'🌙', accent:'#a78bfa', preview:'linear-gradient(135deg,#0f0c1a,#2e1065)' },
    { id:'pastel',      name:'Soft Blossom',  emoji:'🌷', accent:'#ec4899', preview:'linear-gradient(135deg,#fff9fb,#fce7f3)' },
    { id:'minimal',     name:'Clean Focus',   emoji:'🎯', accent:'#1d4ed8', preview:'linear-gradient(135deg,#f9fafb,#eff6ff)' },
];
const LAYOUTS = [
    { id:'default', name:'Balanced', emoji:'⚖️' },
    { id:'cozy',    name:'Cozy',     emoji:'☕' },
    { id:'compact', name:'Compact',  emoji:'⚡' },
];
const FONTS = [
    { id:'default', name:'Inter',   emoji:'🔤', style:'Inter,sans-serif' },
    { id:'poppins', name:'Poppins', emoji:'✨', style:'Poppins,sans-serif' },
    { id:'nunito',  name:'Nunito',  emoji:'🌸', style:'Nunito,sans-serif' },
    { id:'dm-sans', name:'DM Sans', emoji:'⚡', style:'DM Sans,sans-serif' },
];

const apply = (key, val) => {
    document.documentElement.setAttribute(`data-${key}`, val === 'default' ? '' : val);
    localStorage.setItem(`saathi_${key}`, val);
};

export default function AppearanceSettings() {
    const [theme,  setTheme]  = useState(localStorage.getItem('saathi_theme')  || 'default');
    const [layout, setLayout] = useState(localStorage.getItem('saathi_layout') || 'default');
    const [font,   setFont]   = useState(localStorage.getItem('saathi_font')   || 'default');

    const setT = (v) => { setTheme(v);  apply('theme', v);  };
    const setL = (v) => { setLayout(v); apply('layout', v); };
    const setF = (v) => { setFont(v);   apply('font', v);   };

    return (
        <div style={{ maxWidth: 600 }}>
            <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:18, marginBottom:4 }}>
                🎨 Appearance
            </h3>
            <p style={{ color:'var(--text-secondary)', fontSize:13, marginBottom:24 }}>
                Customize how SAATHI looks and feels.
            </p>

            {/* Theme */}
            <div style={{ marginBottom:28 }}>
                <p style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Color Theme</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                    {THEMES.map(t => (
                        <button key={t.id} onClick={() => setT(t.id)} style={{
                            padding:'12px', borderRadius:14, cursor:'pointer', textAlign:'left',
                            border:`2px solid ${theme===t.id?t.accent:'var(--border)'}`,
                            background: theme===t.id ? `${t.accent}12` : 'var(--bg-soft)',
                            display:'flex', alignItems:'center', gap:10, transition:'all 0.2s'
                        }}>
                            <div style={{ width:32, height:32, borderRadius:8, background:t.preview, flexShrink:0,
                                border:`2px solid ${t.accent}40` }} />
                            <div>
                                <p style={{ fontWeight:700, fontSize:13, color:theme===t.id?t.accent:'var(--text-primary)' }}>
                                    {t.emoji} {t.name}
                                </p>
                            </div>
                            {theme===t.id && <span style={{ marginLeft:'auto', color:t.accent, fontSize:16 }}>✓</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Layout */}
            <div style={{ marginBottom:28 }}>
                <p style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Layout Density</p>
                <div style={{ display:'flex', gap:10 }}>
                    {LAYOUTS.map(l => (
                        <button key={l.id} onClick={() => setL(l.id)} style={{
                            flex:1, padding:'12px', borderRadius:12, cursor:'pointer',
                            border:`2px solid ${layout===l.id?'var(--primary)':'var(--border)'}`,
                            background: layout===l.id ? 'var(--primary-light)' : 'var(--bg-soft)',
                            textAlign:'center', transition:'all 0.2s'
                        }}>
                            <div style={{ fontSize:22, marginBottom:4 }}>{l.emoji}</div>
                            <p style={{ fontWeight:700, fontSize:12, color:layout===l.id?'var(--primary)':'var(--text-secondary)' }}>{l.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Font */}
            <div>
                <p style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Font Style</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                    {FONTS.map(f => (
                        <button key={f.id} onClick={() => setF(f.id)} style={{
                            padding:'12px 16px', borderRadius:12, cursor:'pointer',
                            border:`2px solid ${font===f.id?'var(--primary)':'var(--border)'}`,
                            background: font===f.id ? 'var(--primary-light)' : 'var(--bg-soft)',
                            display:'flex', alignItems:'center', gap:10, transition:'all 0.2s'
                        }}>
                            <span style={{ fontFamily:f.style, fontSize:20, fontWeight:700, color:'var(--primary)' }}>Aa</span>
                            <p style={{ fontWeight:700, fontSize:13, fontFamily:f.style, color:font===f.id?'var(--primary)':'var(--text-primary)' }}>
                                {f.name}
                            </p>
                            {font===f.id && <span style={{ marginLeft:'auto', color:'var(--primary)', fontSize:14 }}>✓</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop:20, padding:'12px 16px', borderRadius:12, background:'var(--bg-soft)', border:'1px solid var(--border)' }}>
                <p style={{ fontSize:12, color:'var(--text-muted)' }}>
                    ✨ Changes apply instantly and are saved to your device.
                </p>
            </div>
        </div>
    );
}
