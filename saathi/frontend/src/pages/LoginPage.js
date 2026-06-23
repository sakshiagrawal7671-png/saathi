import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice'; //  Fix: loginUser ko login kiya
import toast from 'react-hot-toast';

const FLOATING_WORDS = ['Growth 🌱','Peace 🕊️','Hope 🌟','Love ❤️','Strength 💪','Joy 😊','Purpose 🎯','Courage 🦁'];

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      //  Fix: loginUser ki jagah login dispatch kiya
      await dispatch(login({ email, password })).unwrap();
      toast.success('Welcome back 💜');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Login failed');
    }
    setLoading(false);
  };

  return (
      <div style={{
        minHeight:'100vh', display:'flex',
        background:'linear-gradient(135deg,#0f0c1a 0%,#1a1040 40%,#2e1065 70%,#4c1d95 100%)',
        position:'relative', overflow:'hidden',
      }}>

        {/* Animated background orbs */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          {[
            {w:500,h:500,t:-100,l:-150,c:'rgba(124,58,237,0.15)'},
            {w:400,h:400,t:'auto',b:-80,r:-100,c:'rgba(249,115,22,0.10)'},
            {w:300,h:300,t:'40%',l:'30%',c:'rgba(167,139,250,0.08)'},
          ].map((orb,i)=>(
              <div key={i} style={{
                position:'absolute', borderRadius:'50%', filter:'blur(60px)',
                width:orb.w, height:orb.h, background:orb.c,
                top:orb.t, left:orb.l, bottom:orb.b, right:orb.r,
                animation:`float ${5+i*2}s ease-in-out infinite alternate`,
              }}/>
          ))}
        </div>

        {/* Floating words */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          {FLOATING_WORDS.map((word,i)=>(
              <div key={i} style={{
                position:'absolute',
                top:`${10+i*11}%`, left:`${5+i*8}%`,
                color:'rgba(167,139,250,0.18)', fontSize:12, fontWeight:600,
                fontFamily:'Poppins', whiteSpace:'nowrap',
                animation:`float ${4+i*0.7}s ease-in-out infinite alternate`,
                animationDelay:`${i*0.4}s`,
              }}>{word}</div>
          ))}
        </div>

        {/* Left panel — branding */}
        <div style={{
          flex:1, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          padding:'60px 48px', position:'relative', zIndex:1,
        }}>
          <div style={{ maxWidth:440, width:'100%' }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:40 }}>
              <div style={{
                width:56, height:56, borderRadius:16,
                background:'linear-gradient(135deg,#7c3aed,#a78bfa)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:28, boxShadow:'0 8px 32px rgba(124,58,237,0.4)',
              }}>🌟</div>
              <div>
                <h1 style={{ fontFamily:'Poppins', fontWeight:800, fontSize:32,
                  background:'linear-gradient(135deg,#e9d5ff,#ffffff)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  SAATHI
                </h1>
                <p style={{ color:'rgba(167,139,250,0.8)', fontSize:12, letterSpacing:2, marginTop:-2 }}>
                  YOUR LIFE COMPANION
                </p>
              </div>
            </div>

            <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:36, color:'white', marginBottom:12, lineHeight:1.2 }}>
              You are not<br/>
              <span style={{ background:'linear-gradient(135deg,#a78bfa,#f97316)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              alone.
            </span>
            </h2>
            <p style={{ color:'rgba(196,181,253,0.8)', fontSize:16, lineHeight:1.7, marginBottom:40 }}>
              SAATHI is your personal space for growth, wellness, and human connection.
              Every journey starts with a single step.
            </p>

            {/* Feature pills */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {['😊 Mood Tracking','📓 Smart Journal','🤗 AI Companion','⚔️ Life RPG','🌱 Habit Builder','💜 Safe Space'].map(f=>(
                  <span key={f} style={{
                    padding:'6px 14px', borderRadius:99, fontSize:12, fontWeight:600,
                    background:'rgba(124,58,237,0.2)', border:'1px solid rgba(167,139,250,0.3)',
                    color:'#c4b5fd',
                  }}>{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div style={{
          width:440, display:'flex', alignItems:'center', justifyContent:'center',
          padding:'40px 48px', position:'relative', zIndex:1,
        }}>
          <div style={{
            width:'100%', background:'rgba(255,255,255,0.05)',
            backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
            borderRadius:28, padding:'40px 36px',
            border:'1px solid rgba(255,255,255,0.10)',
            boxShadow:'0 32px 80px rgba(0,0,0,0.4)',
          }}>
            <h3 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:24, color:'white', marginBottom:6 }}>
              Welcome back 👋
            </h3>
            <p style={{ color:'rgba(196,181,253,0.7)', fontSize:13, marginBottom:28 }}>
              Sign in to continue your journey
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(196,181,253,0.9)', marginBottom:6 }}>
                  Email
                </label>
                <input
                    type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width:'100%', padding:'12px 16px', borderRadius:12,
                      background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(167,139,250,0.3)',
                      color:'white', fontSize:14, outline:'none', fontFamily:'inherit',
                      transition:'all 0.2s',
                    }}
                    onFocus={e=>e.target.style.borderColor='rgba(167,139,250,0.8)'}
                    onBlur={e=>e.target.style.borderColor='rgba(167,139,250,0.3)'}
                />
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(196,181,253,0.9)', marginBottom:6 }}>
                  Password
                </label>
                <input
                    type="password" value={password} onChange={e=>setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width:'100%', padding:'12px 16px', borderRadius:12,
                      background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(167,139,250,0.3)',
                      color:'white', fontSize:14, outline:'none', fontFamily:'inherit',
                      transition:'all 0.2s',
                    }}
                    onFocus={e=>e.target.style.borderColor='rgba(167,139,250,0.8)'}
                    onBlur={e=>e.target.style.borderColor='rgba(167,139,250,0.3)'}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'13px', borderRadius:14, border:'none',
                background:'linear-gradient(135deg,#7c3aed,#a78bfa)',
                color:'white', fontWeight:700, fontSize:15, cursor:'pointer',
                boxShadow:'0 8px 24px rgba(124,58,237,0.4)',
                transition:'all 0.2s', fontFamily:'inherit',
                opacity: loading ? 0.7 : 1,
              }}
                      onMouseEnter={e=>!loading&&(e.target.style.transform='translateY(-2px)')}
                      onMouseLeave={e=>e.target.style.transform='none'}
              >
                {loading ? 'Signing in...' : 'Sign In ✨'}
              </button>
            </form>

            {/* Google OAuth */}
            <div style={{ margin:'20px 0', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize:12, color:'rgba(196,181,253,0.5)' }}>or</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }} />
            </div>

            <a href="http://localhost:8080/oauth2/authorization/google" style={{ textDecoration:'none' }}>
              <button type="button" style={{
                width:'100%', padding:'11px', borderRadius:12,
                background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.15)',
                color:'white', fontSize:13, fontWeight:600, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                fontFamily:'inherit', transition:'all 0.2s',
              }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                      onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </a>

            <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'rgba(196,181,253,0.6)' }}>
              New here?{' '}
              <Link to="/register" style={{ color:'#a78bfa', fontWeight:700, textDecoration:'none' }}>
                Create your account →
              </Link>
            </p>
          </div>
        </div>

        <style>{`
        @keyframes float { from{transform:translateY(0)} to{transform:translateY(-14px)} }
        input::placeholder { color: rgba(196,181,253,0.4) !important; }
      `}</style>
      </div>
  );
}