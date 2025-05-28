// client/src/components/Dashboard/Student/ProjectCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaCheck, FaTimes, FaHourglassHalf, FaRocket } from 'react-icons/fa';
import { PROJECT_STATUS_CLASSES, PROJECT_STATUS_COLORS } from '../../../utils/constants'; // Assuming constants.js is in utils
import './StudentDashboard.css'; // Shared CSS

const ProjectCard = ({ project }) => {
    const statusClass = PROJECT_STATUS_CLASSES[project.status] || 'status-not-started';
    const statusColor = PROJECT_STATUS_COLORS[project.status] || 'gray';

    let actionButton;
    switch (project.status) {
        case 'Not Started':
        case 'In Progress': // Assuming "In Progress" means student started but not submitted
            actionButton = (
                <Link to={`/dashboard/submit/${project.id}`} className="btn btn-primary btn-sm project-action-btn">
                    <FaRocket /> Start / Submit
                </Link>
            );
            break;
        case 'Submitted':
            actionButton = (
                <Link to={`/dashboard/submit/${project.id}`} className="btn btn-secondary btn-sm project-action-btn">
                    <FaEdit /> View / Edit Submission
                </Link>
            );
            break;
        case 'Approved':
            actionButton = (
                <div className="project-status-display approved">
                    <FaCheck /> Approved
                </div>
            );
            break;
        case 'Rejected':
            actionButton = (
                <Link to={`/dashboard/submit/${project.id}`} className="btn btn-danger btn-sm project-action-btn">
                    <FaEdit /> Resubmit Project
                </Link>
            );
            break;
        default:
            actionButton = null;
    }

    return (
        <div className={`project-card-item card ${statusClass}`}>
            <div className="project-card-header">
                <h4 className="project-card-title">{project.title}</h4>
                <span className="project-card-status-badge" style={{ backgroundColor: statusColor }}>
                    {project.status}
                </span>
            </div>
            <p className="project-card-description">{project.description.substring(0, 120)}...</p>
            {project.status === 'Rejected' && project.submissionDetails?.feedback && (
                <p className="project-feedback rejected">
                    <strong>Admin Feedback:</strong> {project.submissionDetails.feedback}
                </p>
            )}
            {project.status === 'Approved' && project.submissionDetails?.feedback && (
                 <p className="project-feedback approved">
                    <strong>Admin Feedback:</strong> {project.submissionDetails.feedback}
                </p>
            )}

            <div className="project-card-footer">
                {actionButton}
                {project.submissionDetails?.submittedAt && (
                    <p className="submission-date">
                        {project.status === 'Submitted' ? 'Submitted: ' :
                         project.status === 'Approved' ? 'Approved: ' :
                         project.status === 'Rejected' ? 'Reviewed: ' : ''}
                        {new Date(project.submissionDetails.reviewedAt || project.submissionDetails.submittedAt).toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;