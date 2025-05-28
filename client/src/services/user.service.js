// client/src/services/user.service.js
import axios from 'axios';
import authHeader from '../utils/authHeader';
import { API_BASE_URL } from '../utils/constants';

const USER_API_URL = `${API_BASE_URL}/users`;

const getStudentDashboardData = () => {
    return axios.get(`${USER_API_URL}/dashboard`, { headers: authHeader() });
};

const updateProfile = (profileData) => {
    // profileData can contain { name, currentPassword, newPassword }
    return axios.put(`${USER_API_URL}/profile`, profileData, { headers: authHeader() });
};

const updateAvatar = (formData) => {
    // formData should be an instance of FormData with the 'avatar' file
    return axios.put(`${USER_API_URL}/avatar`, formData, {
        headers: {
            ...authHeader(),
            'Content-Type': 'multipart/form-data',
        },
    });
};

const userService = {
    getStudentDashboardData,
    updateProfile,
    updateAvatar,
};

export default userService;