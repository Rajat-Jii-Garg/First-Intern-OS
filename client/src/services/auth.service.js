// client/src/services/auth.service.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants'; // Using constants for base URL

const AUTH_API_URL = `${API_BASE_URL}/auth`;

const signup = async (name, email, password) => {
    const response = await axios.post(`${AUTH_API_URL}/signup`, { name, email, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data)); // Includes token and user object
    }
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(`${AUTH_API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data)); // Includes token and user object
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
    // Optionally call a backend logout endpoint if it invalidates the token server-side
    // return axios.get(`${AUTH_API_URL}/logout`, { headers: authHeader() });
};

const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error("Error parsing current user from localStorage:", error);
        localStorage.removeItem('user');
        return null;
    }
};

const getMe = (headers) => {
    return axios.get(`${AUTH_API_URL}/me`, { headers });
}

const authService = {
    signup,
    login,
    logout,
    getCurrentUser,
    getMe,
};

export default authService;