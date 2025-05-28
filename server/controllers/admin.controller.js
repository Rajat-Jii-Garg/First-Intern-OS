// D:\First-Intern-OS\server\controllers\admin.controller.js
const User = require('../models/user.model');
const { Submission } = require('../models/submission.model'); // Assuming Submission is exported as { Submission, ... }
const asyncHandler = require('../middleware/asyncHandler.middleware');
const ErrorResponse = require('../utils/errorResponse.util');

// @desc    Get admin dashboard statistics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin role)
exports.getAdminStats = asyncHandler(async (req, res, next) => {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSubmissions = await Submission.countDocuments();
    const pendingSubmissions = await Submission.countDocuments({ status: 'Submitted' });
    const approvedSubmissions = await Submission.countDocuments({ status: 'Approved' });
    // You can add more stats, e.g., project-wise submissions, recently joined students etc.
    res.status(200).json({
        success: true,
        data: {
            totalStudents,
            totalSubmissions,
            pendingSubmissions,
            approvedSubmissions
        }
    });
});

// @desc    Get all students (with optional pagination in future)
// @route   GET /api/v1/admin/students
// @access  Private (Admin role)
exports.getAllStudents = asyncHandler(async (req, res, next) => {
    // TODO: Implement pagination for large number of students
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: students.length, data: students });
});

// @desc    Get all submissions (with optional pagination and filters in future)
// @route   GET /api/v1/admin/submissions
// @access  Private (Admin role)
exports.getAllSubmissions = asyncHandler(async (req, res, next) => {
    // TODO: Implement pagination and filters (by status, by projectIdentifier, by student)
    const submissions = await Submission.find()
        .populate('student', 'name email avatar') // Populate student details
        .sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
});

// @desc    Review a student's submission (Approve/Reject and provide feedback)
// @route   PUT /api/v1/admin/submissions/:submissionId/review
// @access  Private (Admin role)
exports.reviewSubmission = asyncHandler(async (req, res, next) => {
    const { submissionId } = req.params;
    const { status, feedback } = req.body; // status should be 'Approved' or 'Rejected'

    if (!status || !['Approved', 'Rejected'].includes(status)) {
        return next(new ErrorResponse("Please provide a valid status ('Approved' or 'Rejected')", 400));
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
        return next(new ErrorResponse(`Submission not found with id ${submissionId}`, 404));
    }

    submission.status = status;
    submission.feedback = feedback || (status === 'Approved' ? 'Excellent work! Keep it up.' : 'Needs improvement. Please review the feedback.');
    // reviewedAt is handled by the pre-save hook in Submission.model.js

    await submission.save();
    res.status(200).json({ success: true, message: `Submission successfully ${status.toLowerCase()}`, data: submission });
});

// @desc    Get a single submission by ID (for admin detailed view)
// @route   GET /api/v1/admin/submissions/:submissionId
// @access  Private (Admin)
exports.getSingleSubmissionAdmin = asyncHandler(async (req, res, next) => {
    const submission = await Submission.findById(req.params.submissionId)
                               .populate('student', 'name email avatar'); // Populate student details
    if (!submission) {
        return next(new ErrorResponse(`Submission not found with id ${req.params.submissionId}`, 404));
    }
    res.status(200).json({ success: true, data: submission });
});