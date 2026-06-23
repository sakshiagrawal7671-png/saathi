import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/api';
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { loadUser(); }, []);
  const loadUser = async () => {
    try {
      const t = await AsyncStorage.getItem('saathi_token');
      if (t) { const res = await authApi.getMe(); setUser(res.data.data); }
    } catch {} setLoading(false);
  };
  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: t, user: u } = res.data.data;
    await AsyncStorage.setItem('saathi_token', t); setUser(u); return u;
  };
  const register = async (fullName, username, email, password) => {
    const res = await authApi.register({ fullName, username, email, password });
    const { token: t, user: u } = res.data.data;
    await AsyncStorage.setItem('saathi_token', t); setUser(u); return u;
  };
  const logout = async () => { await AsyncStorage.removeItem('saathi_token'); setUser(null); };
  return { user, loading, login, register, logout };
};
