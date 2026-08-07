import axios from 'axios';

// Smart API_BASE_URL selection:
// If VITE_API_URL is provided in environment, use it.
// If running on localhost / 127.0.0.1, use local Django backend (http://localhost:8000/api).
// Otherwise (e.g. deployed on Vercel), fall back to Render production backend (https://quantjournal-trading.onrender.com/api).
const getDynamicApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000/api';
  }
  return 'https://trading-track.onrender.com/api';
};

const API_BASE_URL = getDynamicApiUrl();

export const getMediaUrl = (urlStr) => {
  if (!urlStr) return null;
  if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) return urlStr;
  const backendHost = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${backendHost}${urlStr}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000, // 35 seconds to allow Render cold start spin up
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
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });

  const response = await api.get(`/trades/?${params.toString()}`);
  return response.data;
};

export const createTrade = async (tradeData) => {
  let dataToSend = tradeData;
  let headers = {};

  if (tradeData instanceof FormData) {
    dataToSend = tradeData;
    headers['Content-Type'] = 'multipart/form-data';
  }

  const response = await api.post('/trades/', dataToSend, { headers });
  return response.data;
};

export const updateTrade = async (id, tradeData) => {
  let dataToSend = tradeData;
  let headers = {};

  if (tradeData instanceof FormData) {
    dataToSend = tradeData;
    headers['Content-Type'] = 'multipart/form-data';
  }

  const response = await api.patch(`/trades/${id}/`, dataToSend, { headers });
  return response.data;
};

export const deleteTrade = async (id) => {
  const response = await api.delete(`/trades/${id}/`);
  return response.data;
};

export const getAnalytics = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });

  const response = await api.get(`/analytics/?${params.toString()}`);
  return response.data;
};

export default api;
