import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE = 'http://10.0.2.2:8080/api';
const api = axios.create({ baseURL:API_BASE, timeout:15000, headers:{'Content-Type':'application/json'} });
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('saathi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(r => r, error => Promise.reject(error.response?.data || error));
export const authApi = {
  login: (d) => api.post('/auth/login', d),
  register: (d) => api.post('/auth/register', d),
  getMe: () => api.get('/auth/me'),
};
export const moodApi = {
  log: (d) => api.post('/mood', d),
  getHistory: () => api.get('/mood'),
  getToday: () => api.get('/mood/today'),
  getAnalytics: () => api.get('/mood/analytics'),
};
export const journalApi = {
  create: (d) => api.post('/journal', d),
  getAll: () => api.get('/journal'),
  delete: (id) => api.delete(`/journal/${id}`),
};
export const companionApi = {
  chat: (message) => api.post('/companion/chat', { message }),
  getHistory: () => api.get('/companion/history'),
};
export const habitApi = {
  create: (d) => api.post('/habits', d),
  getAll: () => api.get('/habits'),
  log: (id) => api.post(`/habits/${id}/log`),
};
export const dashboardApi = { get: () => api.get('/dashboard') };
export const familyApi = {
  getAll: () => api.get('/family'),
  recordContact: (id) => api.post(`/family/${id}/contact`),
};
export const gratitudeApi = {
  add: (d) => api.post('/gratitude', d),
  getAll: () => api.get('/gratitude'),
  getGarden: () => api.get('/gratitude/garden'),
};
export const rpgApi = {
  getProfile: () => api.get('/rpg/profile'),
  getQuests: () => api.get('/rpg/quests'),
  completeQuest: (id) => api.post(`/rpg/quests/${id}/complete`),
};
export const focusApi = {
  start: (d) => api.post('/focus/start', d),
  complete: (id) => api.patch(`/focus/${id}/complete`),
  getForest: () => api.get('/focus/forest'),
};
export const petApi = {
  getStatus: () => api.get('/pet'),
  feed: () => api.post('/pet/feed'),
  play: () => api.post('/pet/play'),
};
export default api;
