import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { FiUser, FiMail, FiLock, FiAtSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success('Welcome to SAATHI! 🌟');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  const fields = [
    { key: 'fullName', label: 'Full Name', icon: FiUser, type: 'text', placeholder: 'Your full name' },
    { key: 'username', label: 'Username', icon: FiAtSign, type: 'text', placeholder: 'Choose a username' },
    { key: 'email', label: 'Email', icon: FiMail, type: 'email', placeholder: 'your@email.com' },
    { key: 'password', label: 'Password', icon: FiLock, type: 'password', placeholder: 'Min 6 characters' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#f8f7ff 0%,#ede9fe 50%,#fce7f3 100%)', padding: 20
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 28, boxShadow: '0 8px 24px rgba(124,58,237,0.3)'
          }}>🌟</div>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 28, color: '#7c3aed' }}>Join SAATHI</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>Your journey to a better life starts here</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label className="label">{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input" style={{ paddingLeft: 40 }} type={type} placeholder={placeholder}
                    value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
                </div>
              </div>
            ))}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, marginTop: 8 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create my account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: '#7c3aed', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
