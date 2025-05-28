// D:\First-Intern-OS\server\models\Submission.model.js
const mongoose = require('mongoose');

// Define the 3 core internship projects.
const INTERNSHIP_PROJECTS_INFO = {
    project1: { title: "Responsive Portfolio Website", description: "Develop a personal portfolio website showcasing your skills and projects. Must be fully responsive." },
    project2: { title: "Data Analysis & Visualization", description: "Analyze a given dataset, derive insights, and present them using charts and graphs." },
    project3: { title: "AI/ML Concept Proposal", description: "Propose an innovative AI/Machine Learning solution for a real-world problem. Include a brief technical overview and potential impact." }
};

const SubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectIdentifier: {
    type: String,
    required: true,
    enum: Object.keys(INTERNSHIP_PROJECTS_INFO), // Ensures identifier is one of the defined projects
  },
  projectTitleSnapshot: { // Store the project title at the time of submission
    type: String,
    required: true
  },
  title: { // Student's custom title for their submission
    type: String,
    required: [true, 'Submission title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  submissionLink: { // Optional URL
    type: String,
    trim: true
  },
  submissionFile: { // Path to uploaded file, e.g., '/uploads/submissions/filename.pdf'
    type: String
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Submitted', 'Approved', 'Rejected'],
    default: 'Not Started',
  },
  feedback: { // Admin feedback
    type: String,
    trim: true
  },
  submittedAt: { type: Date },
  reviewedAt: { type: Date }, // Timestamp when admin approved/rejected
}, { timestamps: true }); // Adds createdAt and updatedAt

// Pre-save hook to set projectTitleSnapshot and manage timestamps
SubmissionSchema.pre('save', function(next) {
    // Set projectTitleSnapshot if new or projectIdentifier changed
    if (this.isNew || this.isModified('projectIdentifier')) {
        this.projectTitleSnapshot = INTERNSHIP_PROJECTS_INFO[this.projectIdentifier]?.title || 'Unknown Project';
    }
    // Set reviewedAt if status changes to Approved or Rejected
    if (this.isModified('status') && (this.status === 'Approved' || this.status === 'Rejected')) {
        this.reviewedAt = Date.now();
    }
    // Set submittedAt if status changes to Submitted (and not already set or explicitly modified)
    if (this.status === 'Submitted' && (!this.submittedAt || this.isModified('status'))){
        this.submittedAt = Date.now();
    }
    next();
});

// Index for faster queries on student's submissions for a specific project
SubmissionSchema.index({ student: 1, projectIdentifier: 1 });

const Submission = mongoose.model('Submission', SubmissionSchema);
module.exports = { Submission, INTERNSHIP_PROJECTS_INFO }; // Export both model and project info