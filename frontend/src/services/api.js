import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getMediaUrl = (urlStr) => {
  if (!urlStr) return null;
  if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) return urlStr;
  const backendHost = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${backendHost}${urlStr}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to dynamically attach Token Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('quant_journal_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auth API Calls
export const registerUser = async (credentials) => {
  const response = await api.post('/auth/register/', credentials);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me/');
  return response.data;
};

export const getStrategies = async () => {
  const response = await api.get('/strategies/');
  return response.data;
};

export const createStrategy = async (strategyData) => {
  const response = await api.post('/strategies/', strategyData);
  return response.data;
};

export const deleteStrategy = async (id) => {
  const response = await api.delete(`/strategies/${id}/`);
  return response.data;
};

export const getTrades = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });

  const response = await api.get(`/trades/?${params.toString()}`);
  return response.data;
};

export const getTradeById = async (id) => {
  const response = await api.get(`/trades/${id}/`);
  return response.data;
};

export const createTrade = async (formData) => {
  // If formData is FormData (with files), send as multipart/form-data
  const isFormData = formData instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await api.post('/trades/', formData, config);
  return response.data;
};

export const updateTrade = async (id, formData) => {
  const isFormData = formData instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await api.patch(`/trades/${id}/`, formData, config);
  return response.data;
};

export const deleteTrade = async (id) => {
  const response = await api.delete(`/trades/${id}/`);
  return response.data;
};

export const getAnalytics = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });

  const response = await api.get(`/analytics/?${params.toString()}`);
  return response.data;
};

export default api;
