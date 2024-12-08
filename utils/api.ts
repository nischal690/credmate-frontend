import axios from 'axios';
import { getValidAccessToken, clearAuthTokens } from './auth';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        const token = await getValidAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            clearAuthTokens();
            // Redirect to login page
            window.location.href = '/auth/phone';
        }
        return Promise.reject(error);
    }
);

export default api;
