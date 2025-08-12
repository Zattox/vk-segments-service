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
    getAll: () => api.get('/segments/'),
    create: (segment) => api.post('/segments/', segment),
    update: (name, segment) => api.patch(`/segments/${name}/`, segment),
    delete: (name) => api.delete(`/segments/${name}/`),
    distribute: (segmentName, percentage) => api.post(`/segments/${segmentName}/distribute/`, {percentage}),
};

// Users API
export const usersAPI = {
    getAll: () => api.get('/users/'),
    create: (user) => api.post('/users/', user),
    getUserSegments: (username) => api.get(`/users/${username}/segments/`),
    addToSegment: (username, segmentName) => api.post(`/users/${username}/segments/${segmentName}/`),
    removeFromSegment: (username, segmentName) => api.delete(`/users/${username}/segments/${segmentName}/`),
};

export default api;