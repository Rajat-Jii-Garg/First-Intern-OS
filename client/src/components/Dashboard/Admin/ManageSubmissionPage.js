// client/src/components/Dashboard/Admin/ManageSubmissionsPage.js
import React, { useState, useEffect } from 'react';
import adminService from '../../../services/admin.service';
import Spinner from '../../Common/Spinner';
import Alert from '../../Common/Alert';
import ReviewModal from './ReviewModal'; // We'll create this
import { FaUser, FaProjectDiagram, FaCalendarCheck, FaEdit, FaEye } from 'react-icons/fa';
import { PROJECT_STATUS_CLASSES, PROJECT_STATUS_COLORS } from '../../../utils/constants';
import './AdminDashboard.css';

const ManageSubmissionsPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllSubmissions();
            setSubmissions(response.data.data || response.data.submissions || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load submissions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleOpenReviewModal = (submission) => {
        setSelectedSubmission(submission);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setSelectedSubmission(null);
        setIsReviewModalOpen(false);
    };

    const handleReviewSuccess = () => {
        fetchSubmissions(); // Re-fetch submissions after a review
        handleCloseReviewModal();
    };

    if (loading) return <Spinner message="Loading submissions..." />;
    if (error) return <Alert type="danger" message={error} />;

    return (
        <div className="manage-submissions-page card">
            <h2 className="page-title"><FaTasks /> Manage Submissions</h2>
            {submissions.length === 0 ? (
                <Alert type="info" message="No submissions found." />
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Project</th>
                                <th>Submission Title</th>
                                <th>Status</th>
                                <th>Submitted On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map(sub => (
                                <tr key={sub._id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={sub.student?.avatar?.startsWith('http') ? sub.student.avatar : `${process.env.REACT_APP_API_URL_NO_PROXY || ''}${sub.student?.avatar}`} alt={sub.student?.name} className="table-avatar-small" />
                                            {sub.student?.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td><FaProjectDiagram className="table-icon" /> {sub.projectTitleSnapshot}</td>
                                    <td>{sub.title}</td>
                                    <td>
                                        <span className="submission-status-badge-table" style={{ backgroundColor: PROJECT_STATUS_COLORS[sub.status], color: 'white' }}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td><FaCalendarCheck className="table-icon" /> {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <button onClick={() => handleOpenReviewModal(sub)} className="btn btn-sm btn-primary">
                                            <FaEdit /> Review
                                        </button>
                                        {/* <button className="btn btn-sm btn-secondary ml-1"><FaEye /> View</button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isReviewModalOpen && selectedSubmission && (
                <ReviewModal
                    submission={selectedSubmission}
                    onClose={handleCloseReviewModal}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
};

export default ManageSubmissionsPage;