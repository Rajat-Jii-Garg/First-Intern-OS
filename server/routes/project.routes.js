// D:\First-Intern-OS\server\routes\project.routes.js
const express = require('express');
const {
    submitOrUpdateProject,
    getMySubmissions,
    getProjectDetailsForStudent
} = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadProjectFile } = require('../middleware/multer.config'); // Multer for project file uploads

const router = express.Router();

// All project routes are protected and for 'student' role
router.use(protect, authorize('student'));

router.post('/submit', uploadProjectFile.single('submissionFile'), submitOrUpdateProject); // 'submissionFile' is field name
router.get('/mysubmissions', getMySubmissions);
router.get('/details/:projectIdentifier', getProjectDetailsForStudent);
// Note: Certificate unlock status is derived from student dashboard data on client-side

module.exports = router;