import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Segments API
export const segmentsAPI = {
  getAll: () => api.get('/segments'),
  getById: (id) => api.get(`/segments/${id}`),
  create: (segment) => api.post('/segments', segment),
  update: (id, segment) => api.put(`/segments/${id}`, segment),
  delete: (id) => api.delete(`/segments/${id}`),
  distribute: (distribution) => api.post('/segments/distribute', distribution),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post('/users', user),
  getUserSegments: (id) => api.get(`/users/${id}/segments`),
  addToSegment: (userId, segmentId) => api.post(`/users/${userId}/segments/${segmentId}`),
  removeFromSegment: (userId, segmentId) => api.delete(`/users/${userId}/segments/${segmentId}`),
};

export default api;