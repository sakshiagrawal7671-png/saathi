import React, { useState, useEffect } from 'react';
import { journeyApi } from '../services/api';
import toast from 'react-hot-toast';

const CHAPTER_THEMES = [
  { gradient:'linear-gradient(135deg,#667eea,#764ba2)', accent:'#7c3aed', icon:'🔍' },
  { gradient:'linear-gradient(135deg,#f093fb,#f5576c)', accent:'#ec4899', icon:'⚡' },
  { gradient:'linear-gradient(135deg,#4facfe,#00f2fe)', accent:'#0ea5e9', icon:'🌊' },
  { gradient:'linear-gradient(135deg,#43e97b,#38f9d7)', accent:'#10b981', icon:'🌿' },
  { gradient:'linear-gradient(135deg,#fa709a,#fee140)', accent:'#f97316', icon:'🌅' },
];

const STATUS_META = {
  LOCKED:      { label:'Locked',      icon:'🔒', color:'#94a3b8' },
  IN_PROGRESS: { label:'In Progress', icon:'📖', color:'#7c3aed' },
  COMPLETED:   { label:'Completed',   icon:'✅', color:'#10b981' },
};

export default function LifeJourneyPage() {
  const [chapters, setChapters] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(null);
  const [storyDraft, setStoryDraft]  = useState('');
  const [milestoneDraft, setMilestoneDraft] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [active,   setActive]   = useState(null); // expanded chapter

  const load = async () => {
    try {
      const res = await journeyApi.getChapters();
      const chs = res.data.data || [];
      setChapters(chs);
      // auto-open current chapter
      const current = chs.find(c => c.status === 'IN_PROGRESS');
      if (current && active === null) setActive(current.chapterNumber);
    } catch { toast.error('Failed to load journey'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const startEditing = (ch) => {
    setEditing(ch.chapterNumber);
    setStoryDraft(ch.story || '');
    setMilestoneDraft(ch.milestone || '');
  };

  const saveChapter = async (number) => {
    setSaving(true);
    try {
      await journeyApi.update(number, { story:storyDraft, milestone:milestoneDraft });
      toast.success('Chapter updated ✨');
      setEditing(null);
      load();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const completeChapter = async (number) => {
    if (!window.confirm('Mark this chapter as complete and unlock the next one?')) return;
    try {
      await journeyApi.complete(number);
      toast.success('Chapter complete! Next chapter unlocked 📖');
      load();
    } catch { toast.error('Failed to complete chapter'); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12, animation:'float 2s ease-in-out infinite' }}>📖</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading your life story...</p>
      </div>
    </div>
  );

  const completedCount = chapters.filter(c => c.status==='COMPLETED').length;

  return (
    <div style={{ maxWidth:860, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Life Journey Story 📖</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Your life is an epic story. You are the author. Write it.
        </p>
      </div>

      {/* Story Progress */}
      <div style={{
        borderRadius:20, padding:'24px 28px', marginBottom:24,
        background:'linear-gradient(135deg,#1e1b4b,#312e81)',
        color:'white', display:'flex', alignItems:'center', gap:24
      }}>
        <div style={{ fontSize:56 }}>📚</div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:'Poppins', fontWeight:700, marginBottom:4 }}>Your Story So Far</h2>
          <p style={{ opacity:.8, fontSize:14, marginBottom:12 }}>
            {completedCount === 0
              ? 'Your story is just beginning. Every great journey starts with a single step.'
              : `You've completed ${completedCount} chapter${completedCount!==1?'s':''} of your life story.`}
          </p>
          <div style={{ display:'flex', gap:8 }}>
            {chapters.map((ch, i) => {
              const theme = CHAPTER_THEMES[i] || CHAPTER_THEMES[0];
              return (
                <div key={i} title={`Chapter ${ch.chapterNumber}: ${ch.title}`} style={{
                  width:32, height:32, borderRadius:8,
                  background: ch.status==='COMPLETED' ? theme.accent
                            : ch.status==='IN_PROGRESS' ? `${theme.accent}88`
                            : 'rgba(255,255,255,0.15)',
                  border:`2px solid ${ch.status==='LOCKED' ? 'rgba(255,255,255,0.2)' : theme.accent}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:14, cursor:'pointer', transition:'transform 0.15s'
                }}
                  onClick={() => setActive(active===ch.chapterNumber ? null : ch.chapterNumber)}>
                  {ch.status==='COMPLETED' ? '✓' : ch.status==='IN_PROGRESS' ? theme.icon : '🔒'}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <p style={{ fontSize:32, fontWeight:700, fontFamily:'Poppins' }}>{completedCount}/{chapters.length}</p>
          <p style={{ opacity:.7, fontSize:12 }}>Chapters Complete</p>
        </div>
      </div>

      {/* Chapters */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {chapters.map((ch, i) => {
          const theme  = CHAPTER_THEMES[i] || CHAPTER_THEMES[0];
          const status = STATUS_META[ch.status] || STATUS_META.LOCKED;
          const isOpen = active === ch.chapterNumber;
          const locked = ch.status === 'LOCKED';

          return (
            <div key={ch.id} className="card" style={{
              borderLeft:`4px solid ${locked ? '#e2e8f0' : theme.accent}`,
              opacity: locked ? .55 : 1,
              transition:'all 0.2s'
            }}>
              {/* Chapter header */}
              <div
                onClick={() => !locked && setActive(isOpen ? null : ch.chapterNumber)}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                  cursor: locked ? 'default' : 'pointer' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{
                    width:52, height:52, borderRadius:14, flexShrink:0,
                    background: locked ? 'var(--soft-gray)' : theme.gradient,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:22, boxShadow: locked ? 'none' : `0 4px 12px ${theme.accent}44`
                  }}>
                    {locked ? '🔒' : theme.icon}
                  </div>
                  <div>
                    <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>
                      CHAPTER {ch.chapterNumber}
                    </p>
                    <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:17 }}>{ch.title}</h3>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:500,
                    background:`${status.color}18`, color:status.color }}>
                    {status.icon} {status.label}
                  </span>
                  {!locked && (
                    <span style={{ fontSize:18, color:'var(--text-muted)', transition:'transform 0.2s',
                      transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && !locked && (
                <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid var(--border)' }}>
                  {editing === ch.chapterNumber ? (
                    /* Edit mode */
                    <div>
                      <div style={{ marginBottom:14 }}>
                        <label className="label">Your Story for This Chapter</label>
                        <textarea className="input" rows={5} style={{ resize:'vertical', lineHeight:1.8 }}
                          placeholder="Write what this chapter means to you, what you're experiencing, how you're growing..."
                          value={storyDraft} onChange={e => setStoryDraft(e.target.value)} />
                      </div>
                      <div style={{ marginBottom:16 }}>
                        <label className="label">Key Milestone / Achievement</label>
                        <input className="input"
                          placeholder="What's one important milestone in this chapter?"
                          value={milestoneDraft} onChange={e => setMilestoneDraft(e.target.value)} />
                      </div>
                      <div style={{ display:'flex', gap:10 }}>
                        <button onClick={() => saveChapter(ch.chapterNumber)} disabled={saving}
                          className="btn btn-primary">
                          {saving ? 'Saving...' : '💾 Save Chapter'}
                        </button>
                        <button onClick={() => setEditing(null)} className="btn btn-ghost">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div>
                      <div style={{ marginBottom:16 }}>
                        <p style={{ fontSize:13, fontWeight:500, color:'var(--text-secondary)', marginBottom:8 }}>
                          YOUR STORY
                        </p>
                        <p style={{ lineHeight:1.8, color:'var(--text-primary)',
                          fontStyle: ch.story===CHAPTER_TEMPLATES_HINT(ch.chapterNumber) ? 'italic' : 'normal',
                          whiteSpace:'pre-wrap' }}>
                          {ch.story || 'You haven\'t written your story for this chapter yet. Click Edit to begin.'}
                        </p>
                      </div>

                      {ch.milestone && (
                        <div style={{ padding:'12px 16px', borderRadius:12,
                          background:'linear-gradient(135deg,#fef9c3,#fef3c7)',
                          border:'1px solid #fde68a', marginBottom:16 }}>
                          <p style={{ fontSize:12, fontWeight:600, color:'#92400e', marginBottom:4 }}>
                            🏅 KEY MILESTONE
                          </p>
                          <p style={{ fontSize:14, color:'#78350f' }}>{ch.milestone}</p>
                        </div>
                      )}

                      <div style={{ display:'flex', gap:10 }}>
                        <button onClick={() => startEditing(ch)} className="btn btn-secondary">
                          ✏️ {ch.story ? 'Edit Chapter' : 'Write Your Story'}
                        </button>
                        {ch.status === 'IN_PROGRESS' && (
                          <button onClick={() => completeChapter(ch.chapterNumber)}
                            className="btn btn-ghost" style={{ color:'#10b981', borderColor:'#10b981' }}>
                            ✅ Complete Chapter
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Inspiration */}
      <div className="card" style={{ marginTop:20, background:'linear-gradient(135deg,#f8f7ff,#ede9fe)',
        border:'1px solid #ddd6fe', textAlign:'center', padding:'24px' }}>
        <p style={{ fontSize:18, fontStyle:'italic', color:'#5b21b6', lineHeight:1.7 }}>
          "The two most important days in your life are the day you are born,<br />
          and the day you find out why."
        </p>
        <p style={{ fontSize:13, color:'#7c3aed', marginTop:8, fontWeight:500 }}>— Mark Twain</p>
      </div>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
    </div>
  );
}

// Helper — just for display hint detection
function CHAPTER_TEMPLATES_HINT(num) {
  const defaults = [
    'Your story begins. Who are you beneath the surface?',
    'Small daily actions are forging your character.',
    'Every obstacle is a lesson wearing a disguise.',
    'You are not the same person who started this journey.',
    'Your growth ripples outward — you are changing lives.',
  ];
  return defaults[num - 1] || '';
}
