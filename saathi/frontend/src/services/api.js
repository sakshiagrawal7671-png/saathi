import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' }, timeout: 15000 });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('saathi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401) { localStorage.removeItem('saathi_token'); window.location.href = '/login'; }
  return Promise.reject(error.response?.data || error);
});

export const authApi = {
  register: d => api.post('/auth/register', d),
  login: d => api.post('/auth/login', d),
  getMe: () => api.get('/auth/me'),
  updateMe: d => api.put('/auth/me', d),
};

export const dashboardApi = { get: () => api.get('/dashboard') };

export const moodApi = {
  log: d => api.post('/mood', d), getHistory: () => api.get('/mood'),
  getToday: () => api.get('/mood/today'), getAnalytics: () => api.get('/mood/analytics'),
};

export const journalApi = {
  create: d => api.post('/journal', d), getAll: () => api.get('/journal'),
  getOne: id => api.get(`/journal/${id}`), update: (id, d) => api.put(`/journal/${id}`, d),
  delete: id => api.delete(`/journal/${id}`),
};

export const companionApi = {
  chat: message => api.post('/companion/chat', { message }),
  getHistory: () => api.get('/companion/history'),
  clearHistory: () => api.delete('/companion/history'),
};

export const habitApi = {
  create: d => api.post('/habits', d), getAll: () => api.get('/habits'),
  log: id => api.post(`/habits/${id}/log`), getTodayProgress: () => api.get('/habits/today'),
  delete: id => api.delete(`/habits/${id}`),
};

export const goalApi = {
  create: d => api.post('/goals', d), getAll: () => api.get('/goals'),
  updateProgress: (id, p) => api.patch(`/goals/${id}/progress?progress=${p}`),
  updateStatus: (id, s) => api.patch(`/goals/${id}/status?status=${s}`),
  delete: id => api.delete(`/goals/${id}`),
};

export const familyApi = {
  add: d => api.post('/family', d), getAll: () => api.get('/family'),
  update: (id, d) => api.put(`/family/${id}`, d), delete: id => api.delete(`/family/${id}`),
  recordContact: id => api.post(`/family/${id}/contact`),
};

export const gratitudeApi = {
  add: d => api.post('/gratitude', d), getAll: () => api.get('/gratitude'),
  getGarden: () => api.get('/gratitude/garden'),
};

export const communityApi = {
  createPost: d => api.post('/community/posts', d),
  getPosts: (page=0, size=20) => api.get(`/community/posts?page=${page}&size=${size}`),
  getByCategory: (cat, page=0) => api.get(`/community/posts/category/${cat}?page=${page}`),
  supportPost: id => api.post(`/community/posts/${id}/support`),
  addComment: (id, d) => api.post(`/community/posts/${id}/comments`, d),
  getComments: id => api.get(`/community/posts/${id}/comments`),
};

export const focusApi = {
  start: d => api.post('/focus/start', d), complete: id => api.patch(`/focus/${id}/complete`),
  getSessions: () => api.get('/focus/sessions'), getForest: () => api.get('/focus/forest'),
};

export default api;

// === V2 APIs ===
export const rpgApi = {
  getProfile: () => api.get('/rpg/profile'),
  getQuests: () => api.get('/rpg/quests'),
  completeQuest: (id) => api.post(`/rpg/quests/${id}/complete`),
  getAchievements: () => api.get('/rpg/achievements'),
  awardXP: (xp, reason) => api.post(`/rpg/award-xp?xp=${xp}&reason=${encodeURIComponent(reason)}`),
};

export const petApi = {
  create: (name, petType) => api.post(`/pet/create?name=${encodeURIComponent(name)}&petType=${petType}`),
  getStatus: () => api.get('/pet'),
  feed: () => api.post('/pet/feed'),
  play: () => api.post('/pet/play'),
};

export const dreamApi = {
  add: (data) => api.post('/dreams', data),
  getAll: () => api.get('/dreams'),
  updateProgress: (id, progress) => api.patch(`/dreams/${id}/progress?progress=${progress}`),
  delete: (id) => api.delete(`/dreams/${id}`),
  getTower: () => api.get('/dreams/tower'),
};

export const journeyApi = {
  getChapters: () => api.get('/journey/chapters'),
  getCurrent: () => api.get('/journey/current'),
  update: (number, data) => api.put(`/journey/chapters/${number}`, data),
  complete: (number) => api.post(`/journey/chapters/${number}/complete`),
};

// === V3 APIs ===
export const personalityApi = {
  getQuestions: () => api.get('/personality/questions'),
  submit: (answers) => api.post('/personality/submit', answers),
  getResult: () => api.get('/personality/result'),
  getStatus: () => api.get('/personality/status'),
};

export const purposeApi = {
  getProfile: () => api.get('/purpose'),
  update: (fields) => api.put('/purpose', fields),
  generate: () => api.post('/purpose/generate'),
  getValues: () => api.get('/purpose/values'),
  saveValues: (values) => api.post('/purpose/values', values),
};

export const careerApi = {
  getGuidance: () => api.get('/career'),
  update: (fields) => api.put('/career', fields),
  generate: () => api.post('/career/generate'),
};

// === V4 APIs ===
export const islandApi = {
  getStatus: () => api.get('/island'),
  setEnvironment: (timeOfDay, weather) => {
    const params = new URLSearchParams();
    if (timeOfDay) params.append('timeOfDay', timeOfDay);
    if (weather) params.append('weather', weather);
    return api.patch(`/island/environment?${params.toString()}`);
  },
};

export const connectionApi = {
  log: (type, description) => api.post('/connection/log', { type, description }),
  getScore: () => api.get('/connection/score'),
  getLogs: () => api.get('/connection/logs'),
};

export const shortsApi = {
  getDaily: () => api.get('/shorts/daily'),
  markViewed: (id) => api.post(`/shorts/${id}/view`),
  toggleLike: (id) => api.post(`/shorts/${id}/like`),
  toggleSave: (id) => api.post(`/shorts/${id}/save`),
  getSaved: () => api.get('/shorts/saved'),
  getStats: () => api.get('/shorts/stats'),
};

// === V5 APIs ===
export const libraryApi = {
  getArticles: (type, theme) => api.get(`/library/${type}${theme ? `?theme=${theme}` : ''}`),
  getArticle: (id) => api.get(`/library/article/${id}`),
  markRead: (id) => api.post(`/library/article/${id}/read`),
  toggleBookmark: (id) => api.post(`/library/article/${id}/bookmark`),
  markHelpful: (id) => api.post(`/library/article/${id}/helpful`),
  getBookmarked: (type) => api.get(`/library/bookmarked${type ? `?type=${type}` : ''}`),
  getStats: () => api.get('/library/stats'),
};

export const surpriseApi = {
  getToday: () => api.get('/surprises/today'),
  open: (id) => api.post(`/surprises/${id}/open`),
  complete: (id) => api.post(`/surprises/${id}/complete`),
};

export const expertApi = {
  apply: (data) => api.post('/experts/apply', data),
  myApplication: () => api.get('/experts/me'),
  myStats: () => api.get('/experts/me/stats'),
  createContent: (data) => api.post('/experts/content', data),
  getAllContent: () => api.get('/experts/content'),
  getMyContent: () => api.get('/experts/content/mine'),
  markHelpful: (id) => api.post(`/experts/content/${id}/helpful`),
};

// === V6 APIs ===
export const notificationApi = {
  registerToken: (token, deviceType) => api.post('/notifications/register-token', { token, deviceType }),
  unregisterToken: (token) => api.post('/notifications/unregister-token', { token }),
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (fields) => api.put('/notifications/preferences', fields),
  getAll: () => api.get('/notifications'),
  markAllRead: () => api.post('/notifications/mark-all-read'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  sendTest: () => api.post('/notifications/test'),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (page = 0, size = 50) => api.get(`/admin/users?page=${page}&size=${size}`),
  updateRole: (id, role) => api.patch(`/admin/users/${id}/role?role=${role}`),
  toggleEnabled: (id) => api.patch(`/admin/users/${id}/toggle-enabled`),
  getFlagged: () => api.get('/admin/posts/flagged'),
  flagPost: (id, flagged) => api.patch(`/admin/posts/${id}/flag?flagged=${flagged}`),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
};

// === V7 APIs ===
// Fixed: Merged all detox properties into a single object declaration
export const detoxApi = {
  startSession: () => api.post('/detox/session/start'),
  endSession: () => api.post('/detox/session/end'),
  getTodayUsage: () => api.get('/detox/usage/today'),
  getWeeklyReport: () => api.get('/detox/usage/weekly'),
  getGoal: () => api.get('/detox/goal'),
  updateGoal: (data) => api.put('/detox/goal', data),
};

export const advancedAiApi = {
  chat: (message, provider) => api.post('/ai/chat', { message, provider }),
  getProvider: () => api.get('/ai/provider'),
  analyze: (text, type) => api.post('/ai/analyze', { text, type }),
  getInsights: () => api.get('/ai/insights'),
};

export const syncApi = {
  queue: (entityType, payload, operation) => api.post('/sync/queue', { entityType, payload: JSON.stringify(payload), operation }),
  process: () => api.post('/sync/process'),
  getPending: () => api.get('/sync/pending'),
  getCount: () => api.get('/sync/count'),
};

// === V8 APIs ===
export const vaultApi = {
  addReason: (data) => api.post('/vault/reasons', data),
  getReasons: () => api.get('/vault/reasons'),
  deleteReason: (id) => api.delete(`/vault/reasons/${id}`),
  getWhyIMatter: () => api.get('/vault/why-i-matter'),
  updateWhyIMatter: (fields) => api.put('/vault/why-i-matter', fields),
  getStatus: () => api.get('/vault/status'),
};

export const anonAskApi = {
  post: (data) => api.post('/ask', data),
  getAll: (page=0, size=20) => api.get(`/ask?page=${page}&size=${size}`),
  getByCategory: (cat, page=0) => api.get(`/ask/category/${cat}?page=${page}`),
  support: (id) => api.post(`/ask/${id}/support`),
  postAnswer: (id, content) => api.post(`/ask/${id}/answers`, { content }),
  getAnswers: (id) => api.get(`/ask/${id}/answers`),
  markHelpful: (id) => api.post(`/ask/answers/${id}/helpful`),
};

export const dreamCommApi = {
  getAll: () => api.get('/communities'),
  get: (id) => api.get(`/communities/${id}`),
  join: (id) => api.post(`/communities/${id}/join`),
  leave: (id) => api.post(`/communities/${id}/leave`),
  getMine: () => api.get('/communities/mine'),
};

export const innerCircleApi = {
  add: (data) => api.post('/inner-circle', data),
  get: () => api.get('/inner-circle'),
  update: (memberId, fields) => api.put(`/inner-circle/${memberId}`, fields),
  remove: (memberId) => api.delete(`/inner-circle/${memberId}`),
  recordInteraction: (memberId) => api.post(`/inner-circle/${memberId}/interact`),
};

// === V9 APIs ===
export const memoriesApi = {
  add: (data) => api.post('/memories', data),
  getAll: () => api.get('/memories'),
  togglePin: (id) => api.post(`/memories/${id}/pin`),
  delete: (id) => api.delete(`/memories/${id}`),
  getStats: () => api.get('/memories/stats'),
};

export const coloringApi = {
  saveSession: (data) => api.post('/coloring/session', data),
  getStats: () => api.get('/coloring/stats'),
};

export const lifeMapApi = {
  add: (data) => api.post('/life-map', data),
  getMap: () => api.get('/life-map'),
  complete: (id) => api.post(`/life-map/${id}/complete`),
  delete: (id) => api.delete(`/life-map/${id}`),
};