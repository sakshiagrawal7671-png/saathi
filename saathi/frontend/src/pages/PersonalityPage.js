import React, { useState, useEffect } from 'react';
import { personalityApi } from '../services/api';
import toast from 'react-hot-toast';

const TRAIT_META = {
  OPENNESS:          { label:'Openness',          color:'#7c3aed', icon:'🎨', desc:'Curiosity, creativity, and love of new experiences' },
  CONSCIENTIOUSNESS: { label:'Conscientiousness', color:'#0ea5e9', icon:'📋', desc:'Organisation, discipline, and reliability' },
  EXTRAVERSION:      { label:'Extraversion',      color:'#f97316', icon:'🌟', desc:'Sociability, assertiveness, and positive energy' },
  AGREEABLENESS:     { label:'Agreeableness',     color:'#10b981', icon:'❤️', desc:'Compassion, cooperation, and trust' },
  NEUROTICISM:       { label:'Neuroticism',        color:'#ef4444', icon:'🌊', desc:'Emotional sensitivity and stress response' },
};

const SCALE = [
  { value:1, label:'Strongly Disagree' },
  { value:2, label:'Disagree' },
  { value:3, label:'Neutral' },
  { value:4, label:'Agree' },
  { value:5, label:'Strongly Agree' },
];

export default function PersonalityPage() {
  const [questions, setQuestions] = useState([]);
  const [result,    setResult]    = useState(null);
  const [answers,   setAnswers]   = useState({});
  const [step,      setStep]      = useState('intro'); // intro | quiz | result
  const [current,   setCurrent]   = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [submitting,setSubmitting]= useState(false);

  useEffect(() => {
    Promise.all([personalityApi.getQuestions(), personalityApi.getResult()])
      .then(([q, r]) => {
        setQuestions(q.data.data || []);
        if (r.data.data?.completed) { setResult(r.data.data); setStep('result'); }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const answer = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    if (current < questions.length - 1) setTimeout(() => setCurrent(c => c+1), 300);
  };

  const submit = async () => {
    const missing = questions.filter(q => !answers[q.id]);
    if (missing.length > 0) return toast.error(`${missing.length} questions still unanswered`);
    setSubmitting(true);
    try {
      const res = await personalityApi.submit(answers);
      setResult(res.data.data);
      setStep('result');
      toast.success('Your personality profile is ready! 🌟');
    } catch { toast.error('Submission failed, please try again'); }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🧠</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading assessment...</p>
      </div>
    </div>
  );

  /* ── INTRO ─────────────────────────────────────────── */
  if (step === 'intro') return (
    <div style={{ maxWidth:720, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Personality Assessment 🧠</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>Discover who you truly are through the science of personality.</p>
      </div>

      <div className="card" style={{ textAlign:'center', padding:'48px 36px', marginBottom:20 }}>
        <div style={{ fontSize:80, marginBottom:16 }}>🧬</div>
        <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:24, marginBottom:12 }}>The Big Five Personality Model</h2>
        <p style={{ color:'var(--text-secondary)', fontSize:15, maxWidth:480, margin:'0 auto 32px', lineHeight:1.7 }}>
          The most scientifically validated personality framework in psychology.
          50 questions. No right or wrong answers. Just you, understood.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:36 }}>
          {Object.values(TRAIT_META).map(({ label, color, icon, desc }) => (
            <div key={label} style={{ padding:'16px 8px', borderRadius:16,
              background:`${color}10`, border:`1px solid ${color}30`, textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
              <p style={{ fontSize:12, fontWeight:700, color, marginBottom:4 }}>{label}</p>
              <p style={{ fontSize:10, color:'var(--text-muted)', lineHeight:1.4 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:16, justifyContent:'center', marginBottom:32, flexWrap:'wrap' }}>
          {[
            { icon:'⏱️', label:'About 10 minutes' },
            { icon:'🔒', label:'Completely private' },
            { icon:'🧪', label:'Science-backed' },
            { icon:'💜', label:'No judgment' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:6,
              fontSize:13, color:'var(--text-secondary)' }}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setStep('quiz')} className="btn btn-primary"
          style={{ padding:'14px 48px', fontSize:16 }}>
          Begin Assessment →
        </button>
      </div>
    </div>
  );

  /* ── QUIZ ───────────────────────────────────────────── */
  if (step === 'quiz') {
    const q = questions[current];
    const trait = TRAIT_META[q?.trait] || Object.values(TRAIT_META)[0];
    const progress = Math.round(((current + 1) / questions.length) * 100);
    const answeredCount = Object.keys(answers).length;

    return (
      <div style={{ maxWidth:680, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:22 }}>Personality Assessment</h1>
          <span style={{ fontSize:13, color:'var(--text-secondary)' }}>
            {current + 1} / {questions.length}
          </span>
        </div>

        {/* Overall progress */}
        <div style={{ marginBottom:24 }}>
          <div style={{ background:'var(--soft-gray)', borderRadius:99, height:8, overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:99, transition:'width 0.4s',
              background:'linear-gradient(90deg,#7c3aed,#a78bfa)',
              width:`${progress}%` }} />
          </div>
          <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:5, textAlign:'right' }}>
            {answeredCount} answered · {questions.length - answeredCount} remaining
          </p>
        </div>

        {/* Question card */}
        <div className="card" style={{ padding:'36px 32px', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${trait.color}18`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{trait.icon}</div>
            <span style={{ fontSize:12, fontWeight:600, color:trait.color }}>{trait.label}</span>
          </div>

          <p style={{ fontSize:19, fontWeight:500, lineHeight:1.6, marginBottom:36, color:'var(--text-primary)' }}>
            "{q?.questionText}"
          </p>

          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            {SCALE.map(({ value, label }) => {
              const selected = answers[q?.id] === value;
              return (
                <button key={value} onClick={() => answer(q.id, value)} style={{
                  padding:'12px 16px', borderRadius:14, minWidth:100,
                  border:`2px solid ${selected ? trait.color : 'var(--border)'}`,
                  background: selected ? `${trait.color}18` : 'white',
                  color: selected ? trait.color : 'var(--text-secondary)',
                  fontWeight: selected ? 700 : 400, fontSize:12,
                  cursor:'pointer', transition:'all 0.15s',
                  transform: selected ? 'scale(1.05)' : 'scale(1)'
                }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>
                    {['😤','🙁','😐','🙂','😊'][value-1]}
                  </div>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display:'flex', gap:10, justifyContent:'space-between' }}>
          <button onClick={() => setCurrent(c => Math.max(0,c-1))} className="btn btn-ghost"
            disabled={current === 0}>← Previous</button>
          <div style={{ display:'flex', gap:10 }}>
            {current < questions.length - 1 ? (
              <button onClick={() => setCurrent(c => c+1)} className="btn btn-secondary">
                Next →
              </button>
            ) : (
              <button onClick={submit} disabled={submitting || answeredCount < questions.length}
                className="btn btn-primary" style={{ padding:'10px 28px' }}>
                {submitting ? 'Analysing...' : '✨ Get My Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── RESULT ─────────────────────────────────────────── */
  const traits = [
    { key:'openness',         score:result?.opennessScore,          label:result?.opennessLabel },
    { key:'conscientiousness',score:result?.conscientiousnessScore, label:result?.conscientiousnessLabel },
    { key:'extraversion',     score:result?.extraversionScore,      label:result?.extraversionLabel },
    { key:'agreeableness',    score:result?.agreeablenessScore,     label:result?.agreeablenessLabel },
    { key:'neuroticism',      score:result?.neuroticismScore,       label:result?.neuroticismLabel },
  ];

  return (
    <div style={{ maxWidth:900, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Your Personality Profile 🧠</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>Based on the Big Five model — science-backed, never a label.</p>
      </div>

      {/* Type hero */}
      <div style={{
        borderRadius:24, padding:'36px', marginBottom:24,
        background:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)',
        color:'white', textAlign:'center'
      }}>
        <div style={{ fontSize:72, marginBottom:12 }}>🌟</div>
        <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:32, marginBottom:8 }}>
          {result?.personalityType}
        </h2>
        <p style={{ opacity:.85, fontSize:15, maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>
          {result?.personalitySummary}
        </p>
        <button onClick={() => setStep('quiz')} style={{
          marginTop:20, padding:'8px 20px', borderRadius:10,
          background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
          color:'white', cursor:'pointer', fontSize:13
        }}>🔄 Retake Assessment</button>
      </div>

      {/* Radar bars */}
      <div className="card" style={{ marginBottom:20 }}>
        <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:20, fontSize:16 }}>
          Your Big Five Scores
        </h3>
        {traits.map(({ key, score=0, label }) => {
          const meta = TRAIT_META[key.toUpperCase()] || Object.values(TRAIT_META)[0];
          return (
            <div key={key} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:18 }}>{meta.icon}</span>
                  <span style={{ fontWeight:600, fontSize:14 }}>{meta.label}</span>
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>{label}</span>
                </div>
                <span style={{ fontWeight:700, color:meta.color, fontSize:18 }}>{score}%</span>
              </div>
              <div style={{ background:'var(--soft-gray)', borderRadius:99, height:12, overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:99, background:meta.color,
                  width:`${score}%`, transition:'width 1s ease 0.2s'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Strengths */}
        <div className="card" style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0' }}>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:12, color:'#15803d', fontSize:15 }}>
            💪 Your Strengths
          </h3>
          <ul style={{ listStyle:'none', padding:0 }}>
            {(result?.strengths || '').split(',').map((s,i) => (
              <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8, fontSize:13 }}>
                <span style={{ color:'#10b981', fontWeight:700, flexShrink:0 }}>✓</span>
                <span>{s.trim()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth */}
        <div className="card" style={{ background:'linear-gradient(135deg,#fff7ed,#fef3c7)', border:'1px solid #fde68a' }}>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:12, color:'#92400e', fontSize:15 }}>
            🌱 Growth Opportunities
          </h3>
          <ul style={{ listStyle:'none', padding:0 }}>
            {(result?.growthAreas || '').split(',').map((g,i) => (
              <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8, fontSize:13 }}>
                <span style={{ color:'#f59e0b', fontWeight:700, flexShrink:0 }}>→</span>
                <span>{g.trim()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Career matches */}
        <div className="card" style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1px solid #bfdbfe' }}>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:12, color:'#1d4ed8', fontSize:15 }}>
            💼 Career Matches
          </h3>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {(result?.careerMatches || '').split(',').map((c,i) => (
              <span key={i} style={{ padding:'5px 12px', borderRadius:99, background:'white',
                border:'1px solid #bfdbfe', color:'#1d4ed8', fontSize:12, fontWeight:500 }}>
                {c.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Relationship style */}
        <div className="card" style={{ background:'linear-gradient(135deg,#fdf4ff,#fae8ff)', border:'1px solid #e9d5ff' }}>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:12, color:'#7e22ce', fontSize:15 }}>
            ❤️ Relationship Style
          </h3>
          <p style={{ fontSize:13, color:'var(--text-primary)', lineHeight:1.7 }}>
            {result?.relationshipStyle}
          </p>
        </div>
      </div>

      <div className="card" style={{ textAlign:'center', background:'linear-gradient(135deg,#f8f7ff,#ede9fe)',
        border:'1px solid #ddd6fe' }}>
        <p style={{ fontSize:14, color:'#5b21b6', lineHeight:1.7 }}>
          💜 Remember: your personality is not a fixed label. It's a snapshot of where you are today.<br />
          Humans grow, evolve, and change. These results are a tool — not a ceiling.
        </p>
      </div>
    </div>
  );
}
