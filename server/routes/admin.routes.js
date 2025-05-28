// D:\First-Intern-OS\server\routes\admin.routes.js
const express = require('express');
const {
    getAdminStats,
    getAllStudents,
    getAllSubmissions,
    reviewSubmission,
    getSingleSubmissionAdmin
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All admin routes are protected and require 'admin' role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/students', getAllStudents);
router.get('/submissions', getAllSubmissions);
router.get('/submissions/:submissionId', getSingleSubmissionAdmin);
router.put('/submissions/:submissionId/review', reviewSubmission);

module.exports = router;