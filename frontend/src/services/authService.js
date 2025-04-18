import axios from 'axios';

const API_URL = 'http://localhost:4000';

const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Registration failed' };
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    },

    // Refresh token
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Token refresh failed' };
        }
    },

    // Logout user
    logout: async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                await axios.post(`${API_URL}/logout`, null, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
            }
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get access token
    getAccessToken: () => {
        return localStorage.getItem('accessToken');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};

export default authService; 