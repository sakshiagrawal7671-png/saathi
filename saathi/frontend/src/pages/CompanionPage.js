import React, { useState, useEffect, useRef } from 'react';
import { companionApi } from '../services/api';
import { FiSend, FiTrash2, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  "I'm feeling overwhelmed today",
  "I need some motivation",
  "I want to talk about my goals",
  "I'm feeling lonely",
  "Help me with stress",
  "I want to reflect on my day",
];

export default function CompanionPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const bottomRef = useRef();

  useEffect(() => {
    companionApi.getHistory().then(r => {
      setMessages(r.data.data || []);
      setFetching(false);
    }).catch(() => {
      setMessages([]);
      setFetching(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'USER', content: msg, createdAt: new Date().toISOString() }]);
    setLoading(true);
    try {
      const res = await companionApi.chat(msg);
      setMessages(prev => [...prev, res.data.data]);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    await companionApi.clearHistory();
    setMessages([]);
    toast.success('Chat cleared');
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: 'linear-gradient(135deg,#7c3aed,#f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
          }}>🤗</div>
          <div>
            <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 20 }}>SAATHI AI Companion</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Always here for you
            </p>
          </div>
        </div>
        <button onClick={clearHistory} className="btn btn-ghost" style={{ gap: 6, fontSize: 13 }}>
          <FiTrash2 size={14} /> Clear
        </button>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, overflowY: 'auto', background: 'white', borderRadius: 20,
        padding: 24, marginBottom: 16, border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {fetching ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40 }}>💭</div>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Loading your conversations...</p>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🤗</div>
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: 8 }}>Hey, I'm SAATHI</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 24px' }}>
              Your compassionate AI companion. I'm here to listen, support, and grow with you.
              What's on your mind today?
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding: '8px 14px', borderRadius: 99, border: '1px solid #ddd6fe',
                  background: '#f5f3ff', color: '#7c3aed', fontSize: 13, cursor: 'pointer',
                  fontFamily: 'Inter', transition: 'all 0.15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background='#ede9fe'}
                  onMouseLeave={e => e.currentTarget.style.background='#f5f3ff'}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: msg.role === 'USER' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end', gap: 8
              }}>
                {msg.role === 'ASSISTANT' && (
                  <div style={{ width: 32, height: 32, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#f97316)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤗</div>
                )}
                <div style={{
                  maxWidth: '72%', padding: '12px 16px', borderRadius: msg.role === 'USER' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                  background: msg.role === 'USER' ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : '#f4f4f5',
                  color: msg.role === 'USER' ? 'white' : 'var(--text-primary)',
                  fontSize: 14, lineHeight: 1.6,
                  boxShadow: msg.role === 'USER' ? '0 4px 12px rgba(124,58,237,0.3)' : 'var(--shadow-sm)'
                }}>
                  {msg.content}
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#f97316)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤗</div>
                <div style={{ background: '#f4f4f5', padding: '14px 18px', borderRadius: '20px 20px 20px 6px' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed',
                        animation: `bounce 1.2s ${i*0.2}s ease-in-out infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="input" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Share what's on your mind... I'm listening 💜"
            style={{ flex: 1, borderRadius: 16 }} />
          <button onClick={() => send()} disabled={loading || !input.trim()} className="btn btn-primary"
            style={{ padding: '0 20px', borderRadius: 16, flexShrink: 0 }}>
            <FiSend size={18} />
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          <FiHeart size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          SAATHI listens without judgment. If you're in crisis, please reach out to a professional.
        </p>
      </div>

      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}
