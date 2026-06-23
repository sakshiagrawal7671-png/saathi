import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../store/slices/authSlice';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      localStorage.setItem('saathi_token', token);
      dispatch(fetchProfile()).then(() => navigate('/dashboard', { replace: true }));
    } else {
      navigate('/login?error=' + (error || 'oauth_failed'), { replace: true });
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#f8f7ff,#ede9fe)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16, animation: 'spin 1s linear infinite' }}>🌟</div>
        <p style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#7c3aed', fontSize: 18 }}>
          Signing you in...
        </p>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          Just a moment, connecting your account.
        </p>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    </div>
  );
}
