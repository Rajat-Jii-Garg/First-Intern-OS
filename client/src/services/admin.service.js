// client/src/services/admin.service.js
import axios from 'axios';
import authHeader from '../utils/authHeader';
import { API_BASE_URL } from '../utils/constants';

const ADMIN_API_URL = `${API_BASE_URL}/admin`;

const getAdminStats = () => {
    return axios.get(`${ADMIN_API_URL}/stats`, { headers: authHeader() });
};

const getAllStudents = () => {
    return axios.get(`${ADMIN_API_URL}/students`, { headers: authHeader() });
};

const getAllSubmissions = () => {
    return axios.get(`${ADMIN_API_URL}/submissions`, { headers: authHeader() });
};

const getSingleSubmissionAdmin = (submissionId) => {
    return axios.get(`${ADMIN_API_URL}/submissions/${submissionId}`, { headers: authHeader() });
};

const reviewSubmission = (submissionId, status, feedback) => {
    return axios.put(`${ADMIN_API_URL}/submissions/${submissionId}/review`, { status, feedback }, { headers: authHeader() });
};

const adminService = {
    getAdminStats,
    getAllStudents,
    getAllSubmissions,
    getSingleSubmissionAdmin,
    reviewSubmission,
};

export default adminService;