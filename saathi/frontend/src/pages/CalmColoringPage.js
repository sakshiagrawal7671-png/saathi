import React, { useState, useEffect, useRef } from 'react';
import { coloringApi } from '../services/api';
import toast from 'react-hot-toast';

// SVG mandala paths for 4 templates
const TEMPLATES = {
  MANDALA: {
    name: 'Mandala',
    emoji: '🌸',
    regions: [
      { id:'center',   d:'M200,200 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0', defaultColor:'#f9fafb' },
      { id:'ring1a',   d:'M200,200 m-60,0 a60,60 0 0,0 120,0 a60,60 0 0,0 -120,0 m30,0 a30,30 0 0,1 60,0 a30,30 0 0,1 -60,0', defaultColor:'#f9fafb' },
      { id:'petal1',   d:'M200,140 Q220,170 200,200 Q180,170 200,140Z', defaultColor:'#f9fafb' },
      { id:'petal2',   d:'M260,200 Q230,220 200,200 Q230,180 260,200Z', defaultColor:'#f9fafb' },
      { id:'petal3',   d:'M200,260 Q180,230 200,200 Q220,230 200,260Z', defaultColor:'#f9fafb' },
      { id:'petal4',   d:'M140,200 Q170,180 200,200 Q170,220 140,200Z', defaultColor:'#f9fafb' },
      { id:'petal5',   d:'M242,158 Q225,185 200,200 Q207,172 242,158Z', defaultColor:'#f9fafb' },
      { id:'petal6',   d:'M242,242 Q215,225 200,200 Q228,207 242,242Z', defaultColor:'#f9fafb' },
      { id:'petal7',   d:'M158,242 Q175,215 200,200 Q193,228 158,242Z', defaultColor:'#f9fafb' },
      { id:'petal8',   d:'M158,158 Q185,175 200,200 Q172,193 158,158Z', defaultColor:'#f9fafb' },
      { id:'outer1',   d:'M200,80 Q240,120 200,140 Q160,120 200,80Z', defaultColor:'#f9fafb' },
      { id:'outer2',   d:'M320,200 Q280,240 260,200 Q280,160 320,200Z', defaultColor:'#f9fafb' },
      { id:'outer3',   d:'M200,320 Q160,280 200,260 Q240,280 200,320Z', defaultColor:'#f9fafb' },
      { id:'outer4',   d:'M80,200 Q120,160 140,200 Q120,240 80,200Z', defaultColor:'#f9fafb' },
      { id:'ring2',    d:'M200,200 m-90,0 a90,90 0 0,0 180,0 a90,90 0 0,0 -180,0 m60,0 a30,30 0 0,1 60,0 a30,30 0 0,1 -60,0', defaultColor:'#f9fafb' },
    ]
  },
  FLOWER: {
    name: 'Flower',
    emoji: '🌺',
    regions: [
      { id:'core',   d:'M200,200 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0', defaultColor:'#f9fafb' },
      { id:'p1', d:'M200,110 Q230,155 200,175 Q170,155 200,110Z', defaultColor:'#f9fafb' },
      { id:'p2', d:'M290,200 Q245,230 225,200 Q245,170 290,200Z', defaultColor:'#f9fafb' },
      { id:'p3', d:'M200,290 Q170,245 200,225 Q230,245 200,290Z', defaultColor:'#f9fafb' },
      { id:'p4', d:'M110,200 Q155,170 175,200 Q155,230 110,200Z', defaultColor:'#f9fafb' },
      { id:'p5', d:'M263,137 Q240,178 215,190 Q225,162 263,137Z', defaultColor:'#f9fafb' },
      { id:'p6', d:'M263,263 Q222,240 210,215 Q238,225 263,263Z', defaultColor:'#f9fafb' },
      { id:'p7', d:'M137,263 Q160,222 185,210 Q175,238 137,263Z', defaultColor:'#f9fafb' },
      { id:'p8', d:'M137,137 Q178,160 190,185 Q162,175 137,137Z', defaultColor:'#f9fafb' },
      { id:'leaf1', d:'M200,80 Q250,100 250,140 Q220,120 200,80Z', defaultColor:'#f9fafb' },
      { id:'leaf2', d:'M320,200 Q300,250 260,250 Q280,220 320,200Z', defaultColor:'#f9fafb' },
      { id:'leaf3', d:'M200,320 Q150,300 150,260 Q180,280 200,320Z', defaultColor:'#f9fafb' },
      { id:'leaf4', d:'M80,200 Q100,150 140,150 Q120,180 80,200Z', defaultColor:'#f9fafb' },
    ]
  },
  STAR: {
    name: 'Star',
    emoji: '⭐',
    regions: [
      { id:'center', d:'M200,200 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0', defaultColor:'#f9fafb' },
      { id:'s1', d:'M200,80 L215,155 L290,155 L230,195 L255,270 L200,225 L145,270 L170,195 L110,155 L185,155Z', defaultColor:'#f9fafb' },
      { id:'ring', d:'M200,200 m-100,0 a100,100 0 0,0 200,0 a100,100 0 0,0 -200,0 m80,0 a20,20 0 0,1 40,0 a20,20 0 0,1 -40,0', defaultColor:'#f9fafb' },
      { id:'t1', d:'M200,80 L185,155 L215,155Z', defaultColor:'#f9fafb' },
      { id:'t2', d:'M290,155 L230,195 L255,125Z', defaultColor:'#f9fafb' },
      { id:'t3', d:'M255,270 L200,225 L265,225Z', defaultColor:'#f9fafb' },
      { id:'t4', d:'M145,270 L200,225 L135,225Z', defaultColor:'#f9fafb' },
      { id:'t5', d:'M110,155 L170,195 L145,125Z', defaultColor:'#f9fafb' },
    ]
  },
  LOTUS: {
    name: 'Lotus',
    emoji: '🪷',
    regions: [
      { id:'base',  d:'M140,260 Q200,240 260,260 Q200,280 140,260Z', defaultColor:'#f9fafb' },
      { id:'lp1',  d:'M200,260 Q180,210 200,170 Q220,210 200,260Z', defaultColor:'#f9fafb' },
      { id:'lp2',  d:'M200,260 Q160,215 150,175 Q185,205 200,260Z', defaultColor:'#f9fafb' },
      { id:'lp3',  d:'M200,260 Q140,225 130,185 Q170,210 200,260Z', defaultColor:'#f9fafb' },
      { id:'lp4',  d:'M200,260 Q240,215 250,175 Q215,205 200,260Z', defaultColor:'#f9fafb' },
      { id:'lp5',  d:'M200,260 Q260,225 270,185 Q230,210 200,260Z', defaultColor:'#f9fafb' },
      { id:'inner1',d:'M200,260 Q188,230 200,210 Q212,230 200,260Z', defaultColor:'#f9fafb' },
      { id:'inner2',d:'M200,260 Q175,235 172,215 Q192,230 200,260Z', defaultColor:'#f9fafb' },
      { id:'inner3',d:'M200,260 Q225,235 228,215 Q208,230 200,260Z', defaultColor:'#f9fafb' },
      { id:'stem',  d:'M195,260 L195,300 Q200,310 205,300 L205,260Z', defaultColor:'#f9fafb' },
      { id:'water', d:'M120,295 Q200,280 280,295 Q200,310 120,295Z', defaultColor:'#f9fafb' },
    ]
  }
};

const PALETTE = [
  '#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#22c55e',
  '#10b981','#14b8a6','#06b6d4','#0ea5e9','#3b82f6','#6366f1',
  '#8b5cf6','#a855f7','#d946ef','#ec4899','#f43f5e','#ffffff',
  '#fef9c3','#fce7f3','#dbeafe','#dcfce7','#f5f3ff','#1c1917',
];

export default function CalmColoringPage() {
  const [template,    setTemplate]    = useState('MANDALA');
  const [colors,      setColors]      = useState({});
  const [activeColor, setActiveColor] = useState('#a78bfa');
  const [stats,       setStats]       = useState(null);
  const [sessionStart,setSessionStart]= useState(null);
  const [saving,      setSaving]      = useState(false);

  useEffect(() => {
    coloringApi.getStats().then(r => setStats(r.data.data)).catch(() => {});
    setSessionStart(Date.now());
    return () => {};
  }, []);

  // Reset colors when template changes
  useEffect(() => { setColors({}); }, [template]);

  const paint = (regionId) => {
    setColors(prev => ({ ...prev, [regionId]: activeColor }));
  };

  const clearCanvas = () => {
    setColors({});
    toast.success('Canvas cleared');
  };

  const saveSession = async () => {
    setSaving(true);
    try {
      const minutes = Math.max(1, Math.round((Date.now() - sessionStart) / 60000));
      await coloringApi.saveSession({ templateName: TEMPLATES[template].name, durationMinutes: minutes });
      toast.success(`Session saved! +${Math.max(5, Math.floor(minutes/2))} XP 🎨`);
      coloringApi.getStats().then(r => setStats(r.data.data)).catch(() => {});
      setSessionStart(Date.now());
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const currentTemplate = TEMPLATES[template];
  const BADGE_META = { BEGINNER:{ emoji:'🎨', color:'#94a3b8' }, ARTIST:{ emoji:'🖌️', color:'#0ea5e9' }, CREATIVE:{ emoji:'🌸', color:'#ec4899' }, ZEN_MASTER:{ emoji:'🧘', color:'#7c3aed' } };
  const bm = BADGE_META[stats?.badge] || BADGE_META.BEGINNER;

  return (
    <div style={{ maxWidth:860, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Calm Coloring Therapy 🎨</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Colour mindfully. Let your mind quiet. There is no right or wrong way.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          {[
            { label:'Sessions',      value:stats.sessionsCompleted, icon:bm.emoji, color:bm.color },
            { label:'Total Minutes', value:stats.totalMinutes,      icon:'⏱️',    color:'#0ea5e9' },
            { label:'Badge',         value:stats.badge,             icon:'🏅',    color:bm.color },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{ padding:'10px 18px', borderRadius:12, background:'white',
              border:`1px solid ${color}30`, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <div>
                <p style={{ fontWeight:700, fontSize:16, color }}>{value}</p>
                <p style={{ fontSize:11, color:'var(--text-muted)' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template selector */}
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        {Object.entries(TEMPLATES).map(([key, tmpl]) => (
          <button key={key} onClick={() => setTemplate(key)} style={{
            padding:'10px 18px', borderRadius:12, cursor:'pointer',
            border:`2px solid ${template===key?'#7c3aed':'var(--border)'}`,
            background:template===key?'#ede9fe':'white',
            color:template===key?'#7c3aed':'var(--text-secondary)',
            fontWeight:template===key?700:400, fontSize:14
          }}>
            {tmpl.emoji} {tmpl.name}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 200px', gap:20 }}>
        {/* SVG Canvas */}
        <div className="card" style={{ padding:0, overflow:'hidden', borderRadius:20 }}>
          <div style={{ background:'linear-gradient(135deg,#fdf4ff,#ede9fe,#e0f2fe)', padding:8, borderRadius:20 }}>
            <svg viewBox="0 0 400 400" style={{ width:'100%', borderRadius:16 }}>
              <rect width="400" height="400" fill="white" rx="16" />
              {currentTemplate.regions.map(region => (
                <path
                  key={region.id}
                  d={region.d}
                  fill={colors[region.id] || region.defaultColor}
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  onClick={() => paint(region.id)}
                  style={{ cursor:'pointer', transition:'fill 0.2s' }}
                  onMouseEnter={e => { if (!colors[region.id]) e.target.setAttribute('fill','#f3f4f6'); }}
                  onMouseLeave={e => { if (!colors[region.id]) e.target.setAttribute('fill', region.defaultColor); }}
                />
              ))}
            </svg>
          </div>
          <div style={{ padding:'12px 16px', display:'flex', gap:10, justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontSize:12, color:'var(--text-secondary)' }}>
              Click any region to colour it 🎨
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={clearCanvas} className="btn btn-ghost" style={{ fontSize:12 }}>🗑️ Clear</button>
              <button onClick={saveSession} disabled={saving} className="btn btn-primary" style={{ fontSize:12 }}>
                {saving ? '...' : '💾 Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Palette */}
        <div>
          <div className="card" style={{ padding:16, marginBottom:14 }}>
            <p style={{ fontWeight:600, fontSize:13, marginBottom:10, color:'var(--text-secondary)' }}>COLOUR PALETTE</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
              {PALETTE.map(color => (
                <button key={color} onClick={() => setActiveColor(color)} style={{
                  width:'100%', aspectRatio:'1', borderRadius:8, border:`3px solid ${activeColor===color?'#1c1917':'transparent'}`,
                  background:color, cursor:'pointer', transition:'transform 0.1s',
                  boxShadow: activeColor===color?'0 0 0 2px white, 0 0 0 4px #1c1917':'none'
                }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
              ))}
            </div>
          </div>

          {/* Current color */}
          <div className="card" style={{ padding:14 }}>
            <p style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:8 }}>ACTIVE COLOUR</p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:activeColor,
                border:'2px solid var(--border)', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }} />
              <div>
                <p style={{ fontWeight:600, fontSize:13 }}>Selected</p>
                <p style={{ fontSize:11, color:'var(--text-muted)' }}>{activeColor}</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div style={{ marginTop:14, padding:'12px 14px', borderRadius:12,
            background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0' }}>
            <p style={{ fontSize:12, color:'#15803d', lineHeight:1.6 }}>
              💚 There is no right way to colour. Let your intuition guide you. Even 5 minutes of this calms the nervous system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
