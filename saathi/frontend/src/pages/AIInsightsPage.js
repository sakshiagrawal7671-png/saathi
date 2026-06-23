import React, { useState, useEffect } from 'react';
import { advancedAiApi } from '../services/api';
import toast from 'react-hot-toast';

export default function AIInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [provider, setProvider] = useState('DEMO');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzeText, setAnalyzeText] = useState('');
  const [analyzeType, setAnalyzeType] = useState('EMOTION');
  const [analyzing, setAnalyzing] = useState(false);

  const load = async () => {
    try {
      const [ins, prov] = await Promise.all([advancedAiApi.getInsights(), advancedAiApi.getProvider()]);
      setInsights(ins.data.data); setProvider(prov.data.data);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const refresh = async () => { setRefreshing(true); await load(); setRefreshing(false); toast.success('Insights refreshed!'); };
  const analyze = async () => {
    if (!analyzeText.trim()) return toast.error('Enter some text');
    setAnalyzing(true);
    try { const res = await advancedAiApi.analyze(analyzeText, analyzeType); setAnalysis(res.data.data); }
    catch { toast.error('Analysis failed'); }
    setAnalyzing(false);
  };

  const PM = { GEMINI:{label:'Gemini AI',color:'#4285F4',icon:'♊'}, OPENAI:{label:'GPT-3.5',color:'#10a37f',icon:'🤖'}, DEMO:{label:'Demo Mode',color:'#7c3aed',icon:'✨'} };
  const pm = PM[provider] || PM.DEMO;

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}><div style={{textAlign:'center'}}><div style={{fontSize:56}}>🤖</div><p style={{color:'var(--text-secondary)',marginTop:12}}>Generating insights...</p></div></div>;

  return (
    <div style={{ maxWidth:900, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>AI Insights 🤖</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>Personalised insights powered by AI — generated from your SAATHI journey.</p>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', borderRadius:99, background:`${pm.color}15`, border:`1px solid ${pm.color}30` }}>
          <span style={{ fontSize:18 }}>{pm.icon}</span>
          <div><p style={{ fontWeight:700, fontSize:13, color:pm.color }}>{pm.label}</p><p style={{ fontSize:11, color:'var(--text-muted)' }}>Active provider</p></div>
        </div>
        <button onClick={refresh} disabled={refreshing} className="btn btn-secondary" style={{ fontSize:13 }}>{refreshing?'...':'🔄 Refresh'}</button>
      </div>

      {insights && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
          <div className="card" style={{ background:'linear-gradient(135deg,#f5f3ff,#ede9fe)', border:'1px solid #ddd6fe' }}>
            <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14, color:'#7c3aed' }}>✨ Personal Insights</h3>
            {(insights.insights||[]).map((insight,i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,0.7)', marginBottom:8 }}>
                <span style={{ color:'#7c3aed', fontWeight:700, flexShrink:0 }}>•</span>
                <p style={{ fontSize:13, color:'#4c1d95', lineHeight:1.6 }}>{insight}</p>
              </div>
            ))}
          </div>
          <div className="card" style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0' }}>
            <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:14, color:'#15803d' }}>🚀 Recommendations</h3>
            {(insights.recommendations||[]).map((rec,i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,0.7)', marginBottom:8 }}>
                <span style={{ color:'#10b981', fontWeight:700, flexShrink:0 }}>→</span>
                <p style={{ fontSize:13, color:'#166534', lineHeight:1.6 }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom:16 }}>
        <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:6 }}>🔍 Text Analysis</h3>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:14 }}>Paste any text — journal entry, a thought — and get AI emotional analysis.</p>
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          {['EMOTION','BURNOUT','GROWTH'].map(t => (
            <button key={t} onClick={() => setAnalyzeType(t)} style={{ padding:'6px 14px', borderRadius:99, fontSize:12, cursor:'pointer',
              border:`1.5px solid ${analyzeType===t?'#7c3aed':'var(--border)'}`, background:analyzeType===t?'#ede9fe':'transparent',
              color:analyzeType===t?'#7c3aed':'var(--text-secondary)', fontWeight:analyzeType===t?600:400 }}>{t}</button>
          ))}
        </div>
        <textarea className="input" rows={4} style={{ resize:'vertical', marginBottom:12 }}
          placeholder="Paste text here to analyze the emotional tone..."
          value={analyzeText} onChange={e => setAnalyzeText(e.target.value)} />
        <button onClick={analyze} disabled={analyzing||!analyzeText.trim()} className="btn btn-primary">
          {analyzing ? '🔍 Analyzing...' : '🔍 Analyze Text'}
        </button>
        {analysis && (
          <div style={{ marginTop:14, padding:'14px 16px', borderRadius:12, background:'linear-gradient(135deg,#fdf4ff,#fae8ff)', border:'1px solid #e9d5ff' }}>
            <p style={{ fontWeight:600, fontSize:12, color:'#7e22ce', marginBottom:6 }}>{pm.icon} {analyzeType} ANALYSIS</p>
            <p style={{ fontSize:14, color:'#4c1d95', lineHeight:1.7 }}>{analysis}</p>
          </div>
        )}
      </div>

      {provider === 'DEMO' && (
        <div style={{ padding:'14px 18px', borderRadius:12, background:'#fffbeb', border:'1px solid #fde68a' }}>
          <p style={{ fontSize:13, color:'#92400e', lineHeight:1.7 }}>
            💡 Enable real AI: Add <code style={{background:'#fef3c7',padding:'1px 6px',borderRadius:4}}>saathi.ai.gemini.api-key=YOUR_KEY</code> or <code style={{background:'#fef3c7',padding:'1px 6px',borderRadius:4}}>saathi.ai.openai.api-key=YOUR_KEY</code> in <code style={{background:'#fef3c7',padding:'1px 6px',borderRadius:4}}>application.properties</code>
          </p>
        </div>
      )}
    </div>
  );
}
