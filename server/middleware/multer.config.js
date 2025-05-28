// D:\First-Intern-OS\server\middleware\multer.config.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse.util'); // Custom error class

// Helper function to ensure a directory exists
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Ensure default avatar exists (or create a placeholder)
const uploadsBaseDir = path.join(__dirname, '..', 'uploads');
const defaultAvatarDir = path.join(uploadsBaseDir, 'avatars');
const defaultAvatarPath = path.join(defaultAvatarDir, 'default-avatar.png');
ensureDirExists(defaultAvatarDir);
if (!fs.existsSync(defaultAvatarPath)) {
    // In a real app, you'd copy a predefined default avatar image here.
    // For now, we'll just log a warning if it's missing.
    // You can create a simple 100x100px PNG image and name it default-avatar.png
    console.warn(`WARNING: Default avatar not found at ${defaultAvatarPath}. Please add a default-avatar.png to server/uploads/avatars/`);
    // Example: fs.writeFileSync(defaultAvatarPath, "Placeholder for default avatar"); // Not a real image
}

// Function to create multer storage configuration for different upload types
const createMulterStorage = (subfolder) => {
    const destinationPath = path.join(uploadsBaseDir, subfolder);
    ensureDirExists(destinationPath); // Ensure the specific subfolder (e.g., submissions, avatars) exists

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            let prefix = 'file'; // Default prefix
            if (req.user && req.user.id) {
                prefix = req.user.id.toString().slice(-6); // Use last 6 chars of user ID for some uniqueness
            }
            if (req.body && req.body.projectIdentifier) { // For project submissions
                prefix += `_${req.body.projectIdentifier}`;
            }
            cb(null, `${prefix}_${uniqueSuffix}${path.extname(file.originalname)}`);
        }
    });
};

// File filter for project submissions (PDF, DOC, DOCX)
const projectFileFilter = (req, file, cb) => {
    const allowedFileExtensions = /pdf|doc|docx/;
    // Check extension
    const extname = allowedFileExtensions.test(path.extname(file.originalname).toLowerCase());
    // Check mimetype (can be less reliable but good as a secondary check)
    const mimetype = file.mimetype.startsWith('application/') &&
                     (file.mimetype.includes('pdf') || file.mimetype.includes('msword') || file.mimetype.includes('vnd.openxmlformats-officedocument.wordprocessingml.document'));

    if (extname || mimetype) { // Allow if either extension or a known mimetype matches
        return cb(null, true);
    }
    cb(new ErrorResponse('Invalid file type. Only PDF, DOC, and DOCX files are allowed for project submissions.', 400), false);
};

// File filter for avatars (JPEG, PNG, GIF)
const avatarFileFilter = (req, file, cb) => {
    const allowedImageExtensions = /jpeg|jpg|png|gif/;
    const extname = allowedImageExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('image/'); // More general check for image mimetypes

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new ErrorResponse('Invalid file type. Only JPEG, JPG, PNG, and GIF images are allowed for avatars.', 400), false);
};

// Multer instance for project file uploads
exports.uploadProjectFile = multer({
    storage: createMulterStorage('submissions'), // Files will be saved in 'server/uploads/submissions/'
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    fileFilter: projectFileFilter
});

// Multer instance for user avatar uploads
exports.uploadAvatar = multer({
    storage: createMulterStorage('avatars'), // Files will be saved in 'server/uploads/avatars/'
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    fileFilter: avatarFileFilter
});