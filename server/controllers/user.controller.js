// D:\First-Intern-OS\server\controllers\user.controller.js
const User = require('../models/user.model');
const { Submission, INTERNSHIP_PROJECTS_INFO } = require('../models/submission.model');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const ErrorResponse = require('../utils/errorResponse.util');
const fs = require('fs');
const path = require('path');

// @desc    Update user profile (name, password)
// @route   PUT /api/v1/users/profile
// @access  Private (Student or Admin for their own profile)
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user.id; // from protect middleware

    // Fetch user and select password for comparison if password change is attempted
    const user = await User.findById(userId).select('+password');
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (name) {
        user.name = name;
    }

    if (newPassword) {
        if (!currentPassword) {
            return next(new ErrorResponse('Current password is required to set a new password', 400));
        }
        if (newPassword.length < 6) {
            return next(new ErrorResponse('New password must be at least 6 characters long', 400));
        }
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return next(new ErrorResponse('Incorrect current password', 401));
        }
        user.password = newPassword; // Password will be hashed by pre-save hook
    }

    await user.save();
    const updatedUser = await User.findById(userId); // Refetch without password selected

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedUser });
});

// @desc    Update user avatar
// @route   PUT /api/v1/users/avatar
// @access  Private
exports.updateAvatar = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }
    if (!req.file) { // 'avatar' is the field name expected from multer
        return next(new ErrorResponse('Please upload an image file for the avatar', 400));
    }

    // If user had a previous avatar (and it's not the default one), delete it from filesystem
    if (user.avatar && user.avatar !== '/uploads/avatars/default-avatar.png') {
        const oldAvatarPath = path.join(__dirname, '..', user.avatar); // Navigate up from controllers to server root
        if (fs.existsSync(oldAvatarPath)) {
            fs.unlink(oldAvatarPath, (err) => {
                if (err) console.error('Error deleting old avatar:', err);
            });
        }
    }

    user.avatar = `/uploads/avatars/${req.file.filename}`; // Path relative to server root for serving
    await user.save();

    res.status(200).json({ success: true, message: 'Avatar updated successfully', data: { avatar: user.avatar } });
});

// @desc    Get student's dashboard data (projects, submissions, progress)
// @route   GET /api/v1/users/dashboard
// @access  Private (Student role)
exports.getStudentDashboardData = asyncHandler(async (req, res, next) => {
    const studentId = req.user.id;
    const projectIdentifiers = Object.keys(INTERNSHIP_PROJECTS_INFO);

    // Fetch all submissions for the student
    const submissions = await Submission.find({ student: studentId });

    // Map submissions to project identifiers for easy lookup
    const submissionsMap = new Map();
    submissions.forEach(sub => submissionsMap.set(sub.projectIdentifier, sub));

    // Prepare data for each predefined project
    const projectsData = projectIdentifiers.map(id => {
        const submission = submissionsMap.get(id);
        return {
            id: id,
            title: INTERNSHIP_PROJECTS_INFO[id].title,
            description: INTERNSHIP_PROJECTS_INFO[id].description, // Add project description
            status: submission ? submission.status : 'Not Started',
            submissionDetails: submission || null, // Full submission object if exists
        };
    });

    // Calculate overall progress and certificate status
    const approvedCount = submissions.filter(s => s.status === 'Approved').length;
    const totalProjects = projectIdentifiers.length;
    const overallProgress = totalProjects > 0 ? Math.round((approvedCount / totalProjects) * 100) : 0;
    const certificateUnlocked = totalProjects > 0 && approvedCount === totalProjects;

    res.status(200).json({
        success: true,
        data: {
            user: { // Send essential user info for dashboard display
                name: req.user.name,
                avatar: req.user.avatar,
                email: req.user.email
            },
            projects: projectsData,
            overallProgress,
            certificateUnlocked,
            approvedCount,
            totalProjects
        },
    });
});