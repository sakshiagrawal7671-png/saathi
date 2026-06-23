import React, { useState, useEffect } from 'react';
import { expertApi } from '../services/api';
import toast from 'react-hot-toast';

const EXPERT_TYPES = [
  { value:'PSYCHOLOGIST',  label:'Psychologist',   icon:'🧠' },
  { value:'TEACHER',       label:'Teacher',        icon:'👩‍🏫' },
  { value:'PROFESSOR',     label:'Professor',      icon:'🎓' },
  { value:'MENTOR',        label:'Mentor',         icon:'🌟' },
  { value:'DOCTOR',        label:'Doctor',         icon:'⚕️' },
  { value:'CAREER_COACH',  label:'Career Coach',   icon:'🚀' },
];

const THEMES = [
  'COURAGE','HOPE','COMPASSION','PATIENCE','GRATITUDE','PURPOSE',
  'PSYCHOLOGY','HUMAN_BEHAVIOUR','EMOTIONAL_INTELLIGENCE','LIFE_SKILLS',
  'PERSONAL_GROWTH','RESILIENCE'
];

const STATUS_META = {
  PENDING:  { label:'Pending Review', color:'#f59e0b', icon:'⏳' },
  APPROVED: { label:'Verified Expert', color:'#10b981', icon:'✅' },
  REJECTED: { label:'Not Approved',   color:'#ef4444', icon:'❌' },
};

export default function ExpertCreatorPage() {
  const [application, setApplication] = useState(null);
  const [stats,       setStats]       = useState(null);
  const [content,     setContent]     = useState([]);
  const [myContent,   setMyContent]   = useState([]);
  const [tab,         setTab]         = useState('feed');
  const [loading,     setLoading]     = useState(true);

  const [applyForm, setApplyForm] = useState({ expertType:'MENTOR', credentials:'', bio:'', specialization:'' });
  const [contentForm, setContentForm] = useState({ title:'', content:'', theme:'LIFE_SKILLS', icon:'📝' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const [app, st, all, mine] = await Promise.all([
        expertApi.myApplication(), expertApi.myStats(),
        expertApi.getAllContent(), expertApi.getMyContent()
      ]);
      setApplication(app.data.data);
      setStats(st.data.data);
      setContent(all.data.data || []);
      setMyContent(mine.data.data || []);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const apply = async () => {
    if (!applyForm.bio.trim()) return toast.error('Tell us about yourself');
    setSubmitting(true);
    try {
      await expertApi.apply(applyForm);
      toast.success('Application submitted! 🎉');
      load();
    } catch { toast.error('Failed to submit'); }
    setSubmitting(false);
  };

  const publish = async () => {
    if (!contentForm.title.trim() || !contentForm.content.trim()) return toast.error('Fill in title and content');
    setSubmitting(true);
    try {
      await expertApi.createContent(contentForm);
      toast.success('Published! 🎉');
      setContentForm({ title:'', content:'', theme:'LIFE_SKILLS', icon:'📝' });
      load();
    } catch (e) { toast.error(e?.message || 'Failed to publish'); }
    setSubmitting(false);
  };

  const markHelpful = async (id) => {
    await expertApi.markHelpful(id);
    toast.success('Thanks for the feedback! 💜');
    load();
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🎓</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading...</p>
      </div>
    </div>
  );

  const isVerified = stats?.verified;

  return (
    <div style={{ maxWidth:920, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Expert Creator Program 🎓</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Verified professionals sharing wisdom — psychologists, teachers, mentors, and more.
        </p>
      </div>

      {/* Status banner */}
      {application && (
        <div style={{ borderRadius:14, padding:'12px 20px', marginBottom:20,
          background:`${STATUS_META[application.status]?.color}10`,
          border:`1px solid ${STATUS_META[application.status]?.color}30`,
          display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:20 }}>{STATUS_META[application.status]?.icon}</span>
          <p style={{ fontSize:13, fontWeight:600, color:STATUS_META[application.status]?.color }}>
            Your expert application: {STATUS_META[application.status]?.label}
            {application.status === 'PENDING' && ' — our team reviews applications regularly'}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {[
          { id:'feed',  label:'📰 Expert Feed' },
          { id:'apply', label:'🎓 Become an Expert' },
          ...(isVerified ? [{ id:'publish', label:'✍️ Publish Content' }] : []),
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`btn ${tab===t.id ? 'btn-primary' : 'btn-ghost'}`}>{t.label}</button>
        ))}
      </div>

      {/* FEED TAB */}
      {tab === 'feed' && (
        <div>
          {content.length === 0 ? (
            <div className="card" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <p style={{ color:'var(--text-secondary)' }}>No expert content yet. Be the first to apply!</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {content.map(c => (
                <div key={c.id} className="card">
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                    <span style={{ fontSize:32 }}>{c.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <span className="badge badge-lavender">{c.theme?.replace('_',' ')}</span>
                        <span style={{ fontSize:11, color:'var(--text-muted)' }}>
                          by {EXPERT_TYPES.find(t=>t.value===c.expert?.expertType)?.icon} Verified {c.expert?.expertType?.replace('_',' ')}
                        </span>
                      </div>
                      <h3 style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>{c.title}</h3>
                      <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{c.content}</p>
                      <button onClick={() => markHelpful(c.id)} style={{
                        marginTop:10, padding:'5px 14px', borderRadius:99, border:'1px solid #bbf7d0',
                        background:'#f0fdf4', color:'#15803d', fontSize:12, cursor:'pointer' }}>
                        👍 Helpful ({c.helpfulCount})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* APPLY TAB */}
      {tab === 'apply' && (
        <div className="card">
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>Apply to become a Verified Expert</h3>
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>
            Are you a psychologist, teacher, professor, mentor, doctor, or career coach? Share your wisdom with the SAATHI community.
          </p>

          <div style={{ marginBottom:14 }}>
            <label className="label">I am a...</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {EXPERT_TYPES.map(t => (
                <button key={t.value} onClick={() => setApplyForm(f => ({ ...f, expertType:t.value }))} style={{
                  padding:'12px', borderRadius:12, textAlign:'center', cursor:'pointer',
                  border:`2px solid ${applyForm.expertType===t.value ? '#7c3aed' : 'var(--border)'}`,
                  background: applyForm.expertType===t.value ? '#f5f3ff' : 'white' }}>
                  <div style={{ fontSize:24 }}>{t.icon}</div>
                  <p style={{ fontSize:12, marginTop:4, fontWeight:600,
                    color: applyForm.expertType===t.value ? '#7c3aed' : 'var(--text-primary)' }}>{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label className="label">Credentials</label>
            <input className="input" placeholder="e.g. M.A. Psychology, 8 years clinical experience"
              value={applyForm.credentials} onChange={e => setApplyForm(f => ({ ...f, credentials: e.target.value }))} />
          </div>

          <div style={{ marginBottom:14 }}>
            <label className="label">Specialization</label>
            <input className="input" placeholder="e.g. Adolescent anxiety, Career transitions"
              value={applyForm.specialization} onChange={e => setApplyForm(f => ({ ...f, specialization: e.target.value }))} />
          </div>

          <div style={{ marginBottom:20 }}>
            <label className="label">Why do you want to join SAATHI's Expert Program?</label>
            <textarea className="input" rows={4} style={{ resize:'none' }}
              placeholder="Tell us about yourself and your motivation to help others..."
              value={applyForm.bio} onChange={e => setApplyForm(f => ({ ...f, bio: e.target.value }))} />
          </div>

          <button onClick={apply} disabled={submitting} className="btn btn-primary">
            {submitting ? 'Submitting...' : '🎓 Submit Application'}
          </button>
        </div>
      )}

      {/* PUBLISH TAB */}
      {tab === 'publish' && isVerified && (
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14 }}>✍️ Publish New Content</h3>
            <div style={{ marginBottom:14 }}>
              <label className="label">Title</label>
              <input className="input" placeholder="A helpful, specific title..."
                value={contentForm.title} onChange={e => setContentForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label className="label">Theme</label>
              <select className="input" value={contentForm.theme}
                onChange={e => setContentForm(f => ({ ...f, theme: e.target.value }))}>
                {THEMES.map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <label className="label">Content</label>
              <textarea className="input" rows={6} style={{ resize:'vertical' }}
                placeholder="Share your professional insight, advice, or guidance..."
                value={contentForm.content} onChange={e => setContentForm(f => ({ ...f, content: e.target.value }))} />
            </div>
            <button onClick={publish} disabled={submitting} className="btn btn-primary">
              {submitting ? 'Publishing...' : '🚀 Publish'}
            </button>
          </div>

          {myContent.length > 0 && (
            <div className="card">
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14 }}>Your Published Content ({myContent.length})</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {myContent.map(c => (
                  <div key={c.id} style={{ padding:'12px 16px', borderRadius:12, background:'var(--soft-gray)' }}>
                    <p style={{ fontWeight:600, fontSize:14 }}>{c.icon} {c.title}</p>
                    <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>👍 {c.helpfulCount} found this helpful</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
