import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
