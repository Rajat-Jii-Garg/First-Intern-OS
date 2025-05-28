// D:\First-Intern-OS\server\routes\user.routes.js
const express = require('express');
const {
    updateProfile,
    updateAvatar,
    getStudentDashboardData
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadAvatar } = require('../middleware/multer.config'); // Multer config for avatar uploads

const router = express.Router();

// All routes below are protected (user must be logged in)
router.use(protect);

router.put('/profile', updateProfile); // Student or Admin can update their own profile
router.put('/avatar', uploadAvatar.single('avatar'), updateAvatar); // 'avatar' is the field name in form-data

// Student-specific routes
router.get('/dashboard', authorize('student'), getStudentDashboardData);

module.exports = router;