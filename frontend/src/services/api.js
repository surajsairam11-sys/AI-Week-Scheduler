import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// ── Tasks ──
export const getTasks = () => API.get('/tasks');
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// ── Weekly Plan ──
export const getWeeklyPlan = (weekStart) =>
  API.get('/planner', { params: { weekStart } });
export const saveWeeklyPlan = (data) => API.post('/planner', data);

// ── AI Recommendations ──
export const getRecommendations = () => API.get('/ai/recommendations');

// ── Progress / Reports ──
export const getProgressReport = (range) =>
  API.get('/reports', { params: { range } });

// ── Settings ──
export const getSettings = () => API.get('/settings');
export const updateSettings = (data) => API.put('/settings', data);

export default API;
