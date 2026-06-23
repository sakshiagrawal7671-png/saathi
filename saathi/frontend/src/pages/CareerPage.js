import React, { useState, useEffect } from 'react';
import { careerApi } from '../services/api';
import toast from 'react-hot-toast';

const EDU_LEVELS  = ['High School','Diploma','Bachelor\'s','Master\'s','PhD','Self-taught','Other'];
const SKILL_CHIPS = ['JavaScript','Python','Java','React','Design','Writing','Marketing',
                     'Leadership','Public Speaking','Data Analysis','Sales','Teaching','Research',
                     'Problem Solving','Communication','Project Management','Finance','Healthcare'];

export default function CareerPage() {
  const [guidance,   setGuidance]   = useState(null);
  const [personality,setPersonality]= useState(null);
  const [form,       setForm]       = useState({
    currentRole:'', educationLevel:'', fieldOfStudy:'',
    skills:'', interests:'', careerGoal:''
  });
  const [tab,        setTab]        = useState('profile');
  const [saving,     setSaving]     = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [selSkills,  setSelSkills]  = useState([]);

  const load = async () => {
    try {
      const res = await careerApi.getGuidance();
      const { guidance: g, personality: p } = res.data.data;
      setGuidance(g);
      setPersonality(p);
      if (g) {
        setForm({
          currentRole:    g.currentRole    || '',
          educationLevel: g.educationLevel || '',
          fieldOfStudy:   g.fieldOfStudy   || '',
          skills:         g.skills         || '',
          interests:      g.interests      || '',
          careerGoal:     g.careerGoal     || '',
        });
        if (g.skills) setSelSkills(g.skills.split(',').map(s => s.trim()).filter(Boolean));
      }
    } catch { /* start fresh */ }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleSkill = (skill) => {
    const updated = selSkills.includes(skill)
      ? selSkills.filter(s => s !== skill)
      : [...selSkills, skill];
    setSelSkills(updated);
    setForm(f => ({ ...f, skills: updated.join(', ') }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await careerApi.update(form);
      setGuidance(res.data.data);
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const generate = async () => {
    setGenerating(true);
    try {
      await careerApi.update(form); // save first
      const res = await careerApi.generate();
      setGuidance(res.data.data);
      setTab('guidance');
      toast.success('Career guidance ready! 🚀');
    } catch { toast.error('Failed to generate'); }
    setGenerating(false);
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🚀</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading your career profile...</p>
      </div>
    </div>
  );

  const hasGuidance = guidance?.recommendedCareers;

  return (
    <div style={{ maxWidth:960, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Career Guidance Center 🚀</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Discover your path, build your skills, and create your future.
        </p>
      </div>

      {/* Personality insight banner */}
      {personality?.personalityType && (
        <div style={{ borderRadius:16, padding:'14px 20px', marginBottom:20,
          background:'linear-gradient(135deg,#f5f3ff,#ede9fe)', border:'1px solid #ddd6fe',
          display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:28 }}>🧠</span>
          <div>
            <p style={{ fontWeight:600, fontSize:13, color:'#7c3aed' }}>PERSONALITY INSIGHT</p>
            <p style={{ fontSize:13, color:'#5b21b6' }}>
              As <strong>{personality.personalityType}</strong>, you naturally suit: {personality.careerMatches}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {[
          { id:'profile',  label:'👤 My Profile' },
          { id:'guidance', label:'🗺️ Career Guidance' },
          { id:'roadmap',  label:'🛤️ Skill Roadmap' },
          { id:'plan',     label:'📅 Action Plan' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`btn ${tab===t.id ? 'btn-primary' : 'btn-ghost'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {tab === 'profile' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div className="card">
            <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:16 }}>Background</h3>
            {[
              { key:'currentRole',    label:'Current Role / Status', placeholder:'e.g. Student, Developer, Marketing Executive' },
              { key:'fieldOfStudy',   label:'Field of Study / Work',  placeholder:'e.g. Computer Science, Business, Arts' },
              { key:'interests',      label:'Interests & Passions',   placeholder:'e.g. Technology, People, Creativity, Science...' },
              { key:'careerGoal',     label:'Career Goal',            placeholder:'e.g. I want to build my own startup, become a doctor...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label className="label">{label}</label>
                <input className="input" placeholder={placeholder}
                  value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label className="label">Education Level</label>
              <select className="input" value={form.educationLevel}
                onChange={e => setForm(f => ({ ...f, educationLevel: e.target.value }))}>
                <option value="">Select level...</option>
                {EDU_LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>Skills</h3>
            <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:14 }}>
              Select skills you have or type your own below
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
              {SKILL_CHIPS.map(skill => {
                const sel = selSkills.includes(skill);
                return (
                  <button key={skill} onClick={() => toggleSkill(skill)} style={{
                    padding:'5px 12px', borderRadius:99, fontSize:12, cursor:'pointer',
                    border:`1.5px solid ${sel ? '#7c3aed' : 'var(--border)'}`,
                    background: sel ? '#7c3aed' : 'transparent',
                    color: sel ? 'white' : 'var(--text-secondary)',
                    transition:'all 0.12s'
                  }}>{skill}</button>
                );
              })}
            </div>
            <div style={{ marginBottom:14 }}>
              <label className="label">All Skills (editable)</label>
              <textarea className="input" rows={3} style={{ resize:'none' }}
                placeholder="Add any skills not listed above, comma-separated..."
                value={form.skills}
                onChange={e => {
                  setForm(f => ({ ...f, skills: e.target.value }));
                  setSelSkills(e.target.value.split(',').map(s=>s.trim()).filter(Boolean));
                }} />
            </div>
          </div>

          <div style={{ gridColumn:'1/-1', display:'flex', gap:10 }}>
            <button onClick={save} disabled={saving} className="btn btn-secondary">
              {saving ? 'Saving...' : '💾 Save Profile'}
            </button>
            <button onClick={generate} disabled={generating} className="btn btn-primary">
              {generating ? '🚀 Generating...' : '🚀 Generate Career Guidance'}
            </button>
          </div>
        </div>
      )}

      {/* CAREER GUIDANCE TAB */}
      {tab === 'guidance' && (
        <div>
          {!hasGuidance ? (
            <div className="card" style={{ textAlign:'center', padding:56 }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🗺️</div>
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>Generate your career guidance</h3>
              <p style={{ color:'var(--text-secondary)', maxWidth:380, margin:'0 auto 24px', fontSize:14 }}>
                Fill in your profile and click "Generate Career Guidance" to get personalised career recommendations.
              </p>
              <button onClick={() => setTab('profile')} className="btn btn-primary">Complete Profile →</button>
            </div>
          ) : (
            <div>
              <div className="card" style={{ marginBottom:16, background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1px solid #bfdbfe' }}>
                <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14, color:'#1d4ed8', fontSize:16 }}>
                  💼 Recommended Career Paths
                </h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {guidance.recommendedCareers.split(',').map((career, i) => (
                    <div key={i} style={{ background:'white', borderRadius:14, padding:'16px',
                      border:'1px solid #bfdbfe', textAlign:'center' }}>
                      <div style={{ fontSize:28, marginBottom:6 }}>
                        {['💼','🎨','📚','🔬','🏥','💡','🌍','⚙️','📊'][i % 9]}
                      </div>
                      <p style={{ fontWeight:700, color:'#1d4ed8', fontSize:13 }}>{career.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={generate} disabled={generating} className="btn btn-ghost">
                  {generating ? 'Regenerating...' : '🔄 Regenerate'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ROADMAP TAB */}
      {tab === 'roadmap' && (
        <div>
          {!guidance?.skillRoadmap ? (
            <div className="card" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🛤️</div>
              <p style={{ color:'var(--text-secondary)' }}>Generate career guidance first to see your skill roadmap</p>
              <button onClick={() => setTab('profile')} className="btn btn-primary" style={{ marginTop:16 }}>
                Go to Profile
              </button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="card" style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0' }}>
                <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14, color:'#15803d' }}>🛤️ Skill Roadmap</h3>
                <pre style={{ fontFamily:'Inter, sans-serif', fontSize:13, lineHeight:1.8,
                  color:'#166534', whiteSpace:'pre-wrap', margin:0 }}>
                  {guidance.skillRoadmap}
                </pre>
              </div>
              <div className="card" style={{ background:'linear-gradient(135deg,#fff7ed,#fef3c7)', border:'1px solid #fde68a' }}>
                <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14, color:'#92400e' }}>📚 Learning Resources</h3>
                <pre style={{ fontFamily:'Inter, sans-serif', fontSize:13, lineHeight:1.8,
                  color:'#78350f', whiteSpace:'pre-wrap', margin:0 }}>
                  {guidance.learningResources}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACTION PLAN TAB */}
      {tab === 'plan' && (
        <div>
          {!guidance?.actionPlan ? (
            <div className="card" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📅</div>
              <p style={{ color:'var(--text-secondary)' }}>Generate career guidance first to see your 90-day action plan</p>
              <button onClick={() => setTab('profile')} className="btn btn-primary" style={{ marginTop:16 }}>
                Go to Profile
              </button>
            </div>
          ) : (
            <div>
              <div className="card" style={{ background:'linear-gradient(135deg,#fdf4ff,#fae8ff)', border:'1px solid #e9d5ff', marginBottom:16 }}>
                <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14, color:'#7e22ce', fontSize:16 }}>
                  🚀 Your 90-Day Action Plan
                </h3>
                <pre style={{ fontFamily:'Inter, sans-serif', fontSize:13, lineHeight:1.9,
                  color:'#4c1d95', whiteSpace:'pre-wrap', margin:0 }}>
                  {guidance.actionPlan}
                </pre>
              </div>
              <div className="card" style={{ textAlign:'center', background:'linear-gradient(135deg,#f8f7ff,#ede9fe)',
                border:'1px solid #ddd6fe' }}>
                <p style={{ fontSize:15, color:'#5b21b6', lineHeight:1.7, fontStyle:'italic' }}>
                  💜 "The secret of getting ahead is getting started." — Mark Twain<br />
                  Your journey of a thousand miles begins with a single step today.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
