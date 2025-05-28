// client/src/utils/constants.js

// Define the 3 core internship projects
// This should ideally match or be derived from backend INTERNSHIP_PROJECTS_INFO
export const INTERNSHIP_PROJECTS = [
    {
        id: 'project1',
        title: "Responsive Portfolio Website",
        description: "Develop a personal portfolio website showcasing your skills and projects. Must be fully responsive and well-designed.",
        icon: "FaLaptopCode" // Example, using react-icons names
    },
    {
        id: 'project2',
        title: "Data Analysis & Visualization",
        description: "Analyze a given dataset, derive key insights, and present them effectively using charts and graphs.",
        icon: "FaChartBar"
    },
    {
        id: 'project3',
        title: "AI/ML Concept Proposal",
        description: "Propose an innovative AI/Machine Learning solution for a real-world problem. Include a brief technical overview and potential impact.",
        icon: "FaLightbulb"
    }
];

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1'; // For non-proxied requests or if proxy not working

export const PROJECT_STATUS_COLORS = {
    'Not Started': 'gray',
    'In Progress': 'blue',
    'Submitted': 'orange',
    'Approved': 'green',
    'Rejected': 'red',
};

export const PROJECT_STATUS_CLASSES = {
    'Not Started': 'status-not-started',
    'In Progress': 'status-in-progress',
    'Submitted': 'status-submitted',
    'Approved': 'status-approved',
    'Rejected': 'status-rejected',
};