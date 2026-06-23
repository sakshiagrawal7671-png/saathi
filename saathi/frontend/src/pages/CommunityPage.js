import React, { useState, useEffect } from 'react';
import { communityApi } from '../services/api';
import { FiPlus, FiHeart, FiMessageCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['GENERAL','VENTING','QUESTION','PEER_SUPPORT','GROWTH','CAREER','STUDIES','RELATIONSHIP'];
const CAT_META = {
  GENERAL: { icon: '💬', color: '#7c3aed' }, VENTING: { icon: '💭', color: '#ef4444' },
  QUESTION: { icon: '❓', color: '#f59e0b' }, PEER_SUPPORT: { icon: '🤝', color: '#10b981' },
  GROWTH: { icon: '🌱', color: '#84cc16' }, CAREER: { icon: '💼', color: '#0ea5e9' },
  STUDIES: { icon: '📚', color: '#8b5cf6' }, RELATIONSHIP: { icon: '❤️', color: '#ec4899' },
};

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'GENERAL', anonymous: false });
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState('');

  const load = async () => {
    try {
      const res = filterCat
        ? await communityApi.getByCategory(filterCat)
        : await communityApi.getPosts();
      setPosts(res.data.data || []);
    } catch { setPosts([]); }
  };
  useEffect(() => { load(); }, [filterCat]);

  const createPost = async () => {
    if (!form.title.trim() || !form.content.trim()) return toast.error('Please fill in title and content');
    setSaving(true);
    try {
      await communityApi.createPost(form);
      toast.success('Post shared with the community 💜');
      setShowForm(false); setForm({ title: '', content: '', category: 'GENERAL', anonymous: false });
      load();
    } catch { toast.error('Failed to post'); }
    setSaving(false);
  };

  const support = async (id) => {
    await communityApi.supportPost(id);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, supportCount: p.supportCount + 1 } : p));
  };

  const loadComments = async (postId) => {
    if (expanded === postId) { setExpanded(null); return; }
    const res = await communityApi.getComments(postId);
    setComments(prev => ({ ...prev, [postId]: res.data.data || [] }));
    setExpanded(postId);
  };

  const addComment = async (postId) => {
    if (!commentInput.trim()) return;
    await communityApi.addComment(postId, { content: commentInput, anonymous: false });
    setCommentInput('');
    const res = await communityApi.getComments(postId);
    setComments(prev => ({ ...prev, [postId]: res.data.data || [] }));
    toast.success('Comment added');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 26 }}>Community 🌍</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>A safe space to share, support, and grow together.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary"><FiPlus /> Share</button>
      </div>

      {/* Community Guidelines */}
      <div style={{ borderRadius: 14, padding: '12px 18px', marginBottom: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 13, color: '#15803d' }}>
        💚 <strong>Community Guidelines:</strong> Be kind, supportive, and respectful. No hate, judgment, or toxic behavior.
        This is a space for healing and growth.
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button onClick={() => setFilterCat(null)} className={`btn ${!filterCat ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 12 }}>All</button>
        {CATEGORIES.map(c => {
          const m = CAT_META[c];
          return (
            <button key={c} onClick={() => setFilterCat(filterCat === c ? null : c)}
              className="btn btn-ghost" style={{ fontSize: 12, borderColor: filterCat === c ? m.color : undefined, color: filterCat === c ? m.color : undefined }}>
              {m.icon} {c.replace('_', ' ')}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌍</div>
          <p style={{ color: 'var(--text-secondary)' }}>Be the first to share something with the community</p>
        </div>
      ) : posts.map(post => {
        const meta = CAT_META[post.category] || CAT_META.GENERAL;
        const postComments = comments[post.id] || [];
        return (
          <div key={post.id} className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${meta.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {meta.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: 15 }}>{post.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {post.anonymous ? 'Anonymous' : post.user?.username || 'Someone'} •{' '}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ background: `${meta.color}18`, color: meta.color, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
                    {post.category.replace('_', ' ')}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 12 }}>{post.content}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => support(post.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99,
                    border: '1px solid #fecdd3', background: '#fff1f2', color: '#e11d48',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500
                  }}>
                    <FiHeart size={13} /> {post.supportCount} Support
                  </button>
                  <button onClick={() => loadComments(post.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99,
                    border: '1px solid var(--border)', background: 'var(--soft-gray)', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 13
                  }}>
                    <FiMessageCircle size={13} /> Comments
                  </button>
                </div>

                {expanded === post.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                    {postComments.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ede9fe',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                          {c.anonymous ? '🙈' : '💬'}
                        </div>
                        <div style={{ background: 'var(--soft-gray)', borderRadius: 12, padding: '8px 12px', flex: 1 }}>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>
                            {c.anonymous ? 'Anonymous' : c.user?.username}
                          </p>
                          <p style={{ fontSize: 13 }}>{c.content}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <input className="input" placeholder="Add a supportive comment..." value={commentInput}
                        onChange={e => setCommentInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                        style={{ flex: 1, fontSize: 13 }} />
                      <button onClick={() => addComment(post.id)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Send</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 560 }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 20 }}>Share with Community</h2>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Title</label>
              <input className="input" placeholder="Give your post a title..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">What's on your mind?</label>
              <textarea className="input" rows={5} placeholder="Share your thoughts, feelings, questions... This community cares."
                value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} style={{ resize: 'none' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Category</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CATEGORIES.map(c => {
                  const m = CAT_META[c];
                  return (
                    <button key={c} onClick={() => setForm({ ...form, category: c })} style={{
                      padding: '6px 12px', borderRadius: 99, border: `1.5px solid ${form.category === c ? m.color : 'var(--border)'}`,
                      background: form.category === c ? `${m.color}18` : 'transparent', color: form.category === c ? m.color : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 12
                    }}>{m.icon} {c.replace('_', ' ')}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <input type="checkbox" id="anon" checked={form.anonymous} onChange={e => setForm({ ...form, anonymous: e.target.checked })} />
              <label htmlFor="anon" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>Post anonymously</label>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={createPost} disabled={saving} className="btn btn-primary">{saving ? 'Sharing...' : 'Share with Community 💜'}</button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
