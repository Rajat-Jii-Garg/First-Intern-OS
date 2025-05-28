// client/src/services/project.service.js
import axios from 'axios';
import authHeader from '../utils/authHeader';
import { API_BASE_URL } from '../utils/constants';

const PROJECT_API_URL = `${API_BASE_URL}/projects`;

const submitOrUpdateProject = (formData) => {
    // formData contains projectIdentifier, title, description, submissionLink/submissionFile
    return axios.post(`${PROJECT_API_URL}/submit`, formData, {
        headers: {
            ...authHeader(),
            'Content-Type': 'multipart/form-data',
        },
    });
};

const getMySubmissions = () => {
    return axios.get(`${PROJECT_API_URL}/mysubmissions`, { headers: authHeader() });
};

const getProjectDetailsForStudent = (projectIdentifier) => {
    return axios.get(`${PROJECT_API_URL}/details/${projectIdentifier}`, { headers: authHeader() });
};

// Certificate status logic is primarily derived from student dashboard data on client-side for this version
// If a dedicated endpoint was made on backend for 'certificate/status', it would be called here.

const projectService = {
    submitOrUpdateProject,
    getMySubmissions,
    getProjectDetailsForStudent,
};

export default projectService;