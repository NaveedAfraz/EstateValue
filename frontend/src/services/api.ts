import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authService = {
    register: (userData: any) => api.post('/auth/register', userData),
    login: (credentials: any) => api.post('/auth/login', credentials),
};

export const propertyService = {
    getAll: () => api.get('/properties'),
    getById: (id: string) => api.get(`/properties/${id}`),
    create: (data: any) => api.post('/properties', data),
    update: (id: number, data: any) => api.put(`/properties/${id}`, data),
    delete: (id: number) => api.delete(`/properties/${id}`),
    predict: (features: any) => api.post('/properties/predict', features),
    getFeatured: () => api.get('/properties'), // We'll slice in frontend
};

export const userService = {
    toggleWishlist: (propertyId: number) => api.post('/user/wishlist/toggle', { propertyId }),
    getWishlist: () => api.get('/user/wishlist'),
    savePrediction: (data: any) => api.post('/user/predictions', data),
    getSavedPredictions: () => api.get('/user/predictions'),
};

export const contactService = {
    send: (data: any) => api.post('/contacts', data),
    getAll: () => api.get('/contacts'),
    delete: (id: number) => api.delete(`/contacts/${id}`),
};

export default api;
