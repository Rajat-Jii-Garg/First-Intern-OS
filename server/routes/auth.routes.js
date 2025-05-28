// D:\First-Intern-OS\server\routes\auth.routes.js
const express = require('express');
const { signup, login, getMe, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware'); // Auth protection middleware
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe); // Get current user details if token is valid
router.get('/logout', protect, logout); // Client will handle token removal

module.exports = router;