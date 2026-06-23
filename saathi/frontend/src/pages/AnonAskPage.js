import React, { useState, useEffect } from 'react';
import { anonAskApi } from '../services/api';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value:'CAREER',        label:'Career',        icon:'💼', color:'#0ea5e9' },
  { value:'STUDIES',       label:'Studies',       icon:'📚', color:'#7c3aed' },
  { value:'RELATIONSHIPS', label:'Relationships', icon:'❤️', color:'#ef4444' },
  { value:'MENTAL_HEALTH', label:'Mental Health', icon:'💭', color:'#8b5cf6' },
  { value:'FAMILY',        label:'Family',        icon:'🏠', color:'#f97316' },
  { value:'FINANCE',       label:'Finance',       icon:'💰', color:'#f59e0b' },
  { value:'LIFE_ADVICE',   label:'Life Advice',   icon:'🌿', color:'#10b981' },
  { value:'GENERAL',       label:'General',       icon:'💬', color:'#06b6d4' },
];

export default function AnonAskPage() {
  const [questions,  setQuestions]  = useState([]);
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState({ question:'', category:'GENERAL' });
  const [saving,     setSaving]     = useState(false);
  const [filter,     setFilter]     = useState(null);
  const [expanded,   setExpanded]   = useState(null);
  const [answers,    setAnswers]    = useState({});
  const [answerText, setAnswerText] = useState('');
  const [loading,    setLoading]    = useState(true);

  const load = async () => {
    try {
      const res = filter
        ? await anonAskApi.getByCategory(filter)
        : await anonAskApi.getAll();
      setQuestions(res.data.data || []);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, [filter]);

  const postQuestion = async () => {
    if (!form.question.trim()) return toast.error('Write your question');
    setSaving(true);
    try {
      await anonAskApi.post(form);
      toast.success('Question posted anonymously 💜');
      setShowForm(false); setForm({ question:'', category:'GENERAL' }); load();
    } catch { toast.error('Failed to post'); }
    setSaving(false);
  };

  const loadAnswers = async (qId) => {
    if (expanded === qId) { setExpanded(null); return; }
    const res = await anonAskApi.getAnswers(qId);
    setAnswers(prev => ({ ...prev, [qId]: res.data.data || [] }));
    setExpanded(qId);
  };

  const postAnswer = async (qId) => {
    if (!answerText.trim()) return;
    await anonAskApi.postAnswer(qId, answerText);
    setAnswerText('');
    const res = await anonAskApi.getAnswers(qId);
    setAnswers(prev => ({ ...prev, [qId]: res.data.data || [] }));
    toast.success('Answer posted — you helped someone! 💜');
  };

  return (
    <div style={{ maxWidth:800, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Anonymous Ask 🙈</h1>
          <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
            Ask anything. Answer anonymously. No judgment, no usernames.
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> Ask</button>
      </div>

      <div style={{ borderRadius:14, padding:'12px 18px', marginBottom:20, background:'#f0fdf4', border:'1px solid #bbf7d0', fontSize:13, color:'#15803d' }}>
        💚 All questions are anonymous. Be kind, supportive, and constructive in your answers.
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
        <button onClick={() => setFilter(null)} className={`btn ${!filter?'btn-primary':'btn-ghost'}`} style={{ fontSize:12 }}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setFilter(filter===c.value?null:c.value)} style={{
            padding:'6px 12px', borderRadius:99, fontSize:12, cursor:'pointer',
            border:`1.5px solid ${filter===c.value?c.color:'var(--border)'}`,
            background:filter===c.value?`${c.color}18`:'transparent',
            color:filter===c.value?c.color:'var(--text-secondary)'
          }}>{c.icon} {c.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40 }}><div style={{ fontSize:40 }}>💭</div></div>
      ) : questions.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:48 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🙈</div>
          <p style={{ color:'var(--text-secondary)' }}>No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        questions.map(q => {
          const cat = CATEGORIES.find(c => c.value===q.category) || CATEGORIES[7];
          const qAnswers = answers[q.id] || [];
          return (
            <div key={q.id} className="card" style={{ marginBottom:14 }}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:40, height:40, borderRadius:12, background:`${cat.color}18`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {cat.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600,
                      background:`${cat.color}18`, color:cat.color }}>{cat.label}</span>
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize:15, color:'var(--text-primary)', lineHeight:1.6, marginBottom:12 }}>
                    {q.question}
                  </p>
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={() => { anonAskApi.support(q.id); toast.success('💜'); }} style={{
                      display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:99,
                      border:'1px solid #fecdd3', background:'#fff1f2', color:'#e11d48', cursor:'pointer', fontSize:12
                    }}>💜 {q.supportCount}</button>
                    <button onClick={() => loadAnswers(q.id)} style={{
                      display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:99,
                      border:'1px solid var(--border)', background:'var(--soft-gray)', color:'var(--text-secondary)', cursor:'pointer', fontSize:12
                    }}>💬 {q.answerCount} answer{q.answerCount!==1?'s':''}</button>
                  </div>

                  {expanded === q.id && (
                    <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--border)' }}>
                      {qAnswers.length === 0 ? (
                        <p style={{ fontSize:13, color:'var(--text-muted)', fontStyle:'italic' }}>No answers yet. Be the first to help!</p>
                      ) : qAnswers.map((a,i) => (
                        <div key={i} style={{ display:'flex', gap:10, marginBottom:12 }}>
                          <div style={{ width:28, height:28, borderRadius:8, background:'#ede9fe',
                            display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🤝</div>
                          <div style={{ background:'var(--soft-gray)', borderRadius:12, padding:'8px 12px', flex:1 }}>
                            <p style={{ fontSize:13, lineHeight:1.6 }}>{a.content}</p>
                            <button onClick={() => anonAskApi.markHelpful(a.id)} style={{
                              marginTop:6, padding:'3px 10px', borderRadius:99, border:'none',
                              background:'#f0fdf4', color:'#10b981', fontSize:11, cursor:'pointer' }}>
                              👍 {a.helpfulCount}
                            </button>
                          </div>
                        </div>
                      ))}
                      <div style={{ display:'flex', gap:8, marginTop:10 }}>
                        <input className="input" style={{ flex:1, fontSize:13 }}
                          placeholder="Share your perspective (anonymously)..."
                          value={answerText} onChange={e => setAnswerText(e.target.value)}
                          onKeyDown={e => e.key==='Enter' && postAnswer(q.id)} />
                        <button onClick={() => postAnswer(q.id)} className="btn btn-primary" style={{ padding:'8px 16px', fontSize:13 }}>Send</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000,
          display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div className="card" style={{ width:'100%', maxWidth:540 }}>
            <h2 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:6 }}>Ask Anonymously 🙈</h2>
            <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>
              No one will know it's you. Just honest questions, honest answers.
            </p>
            <div style={{ marginBottom:14 }}>
              <label className="label">Your question</label>
              <textarea className="input" rows={4} style={{ resize:'none' }}
                placeholder="What's been on your mind? What do you need help with?"
                value={form.question} onChange={e => setForm(f=>({...f,question:e.target.value}))} />
            </div>
            <div style={{ marginBottom:20 }}>
              <label className="label">Category</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.value} onClick={() => setForm(f=>({...f,category:c.value}))} style={{
                    padding:'6px 12px', borderRadius:99, fontSize:12, cursor:'pointer',
                    border:`1.5px solid ${form.category===c.value?c.color:'var(--border)'}`,
                    background:form.category===c.value?`${c.color}18`:'transparent',
                    color:form.category===c.value?c.color:'var(--text-secondary)'
                  }}>{c.icon} {c.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={postQuestion} disabled={saving||!form.question.trim()} className="btn btn-primary">
                {saving?'Posting...':'🙈 Post Anonymously'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
