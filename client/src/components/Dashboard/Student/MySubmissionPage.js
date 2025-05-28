// client/src/components/Dashboard/Student/MySubmissionsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../../../services/project.service';
import Spinner from '../../Common/Spinner';
import Alert from '../../Common/Alert';
import { FaEdit, FaEye, FaFileAlt, FaLink, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { PROJECT_STATUS_CLASSES, PROJECT_STATUS_COLORS } from '../../../utils/constants';
import './StudentDashboard.css'; // Shared CSS

const MySubmissionsPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const response = await projectService.getMySubmissions();
                setSubmissions(response.data.data || response.data.submissions || []); // Adjust based on backend response structure
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load submissions.');
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    if (loading) return <Spinner message="Loading your submissions..." />;
    if (error) return <Alert type="danger" message={error} />;

    return (
        <div className="my-submissions-page card">
            <h2 className="page-title">My Submissions</h2>
            {submissions.length === 0 ? (
                <Alert type="info" message="You haven't made any submissions yet." />
            ) : (
                <div className="submissions-list">
                    {submissions.map(sub => (
                        <div key={sub._id} className={`submission-item card ${PROJECT_STATUS_CLASSES[sub.status]}`}>
                            <div className="submission-item-header">
                                <h3>{sub.title}</h3>
                                <span className="submission-status-badge" style={{backgroundColor: PROJECT_STATUS_COLORS[sub.status]}}>
                                    {sub.status === 'Approved' && <FaCheckCircle />}
                                    {sub.status === 'Rejected' && <FaTimesCircle />}
                                    {sub.status === 'Submitted' && <FaClock />}
                                    {' '}{sub.status}
                                </span>
                            </div>
                            <p className="project-title-snapshot">For Project: <em>{sub.projectTitleSnapshot}</em></p>
                            <p className="submission-description">{sub.description.substring(0,150)}...</p>

                            {(sub.submissionFile || sub.submissionLink) && (
                                <div className="submission-links">
                                    {sub.submissionFile && (
                                        <a href={`${process.env.REACT_APP_API_URL_NO_PROXY || ''}${sub.submissionFile}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                                            <FaFileAlt /> View File
                                        </a>
                                    )}
                                    {sub.submissionLink && (
                                        <a href={sub.submissionLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                                            <FaLink /> View Link
                                        </a>
                                    )}
                                </div>
                            )}

                            {sub.feedback && (
                                <div className={`submission-feedback ${sub.status === 'Approved' ? 'feedback-approved' : 'feedback-rejected'}`}>
                                    <strong>Admin Feedback:</strong> {sub.feedback}
                                </div>
                            )}

                            <div className="submission-item-footer">
                                <p className="submission-date">
                                    {sub.status === 'Submitted' && sub.submittedAt && `Submitted: ${new Date(sub.submittedAt).toLocaleDateString()}`}
                                    {(sub.status === 'Approved' || sub.status === 'Rejected') && sub.reviewedAt && `Reviewed: ${new Date(sub.reviewedAt).toLocaleDateString()}`}
                                </p>
                                {(sub.status === 'Submitted' || sub.status === 'Rejected') && (
                                    <Link to={`/dashboard/submit/${sub.projectIdentifier}`} className="btn btn-primary btn-sm">
                                        <FaEdit /> {sub.status === 'Rejected' ? 'Resubmit' : 'Edit'}
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MySubmissionsPage;