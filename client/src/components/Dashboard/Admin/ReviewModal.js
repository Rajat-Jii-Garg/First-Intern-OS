// client/src/components/Dashboard/Admin/ReviewModal.js
import React, { useState, useEffect } from 'react';
import adminService from '../../../services/admin.service';
import Alert from '../../Common/Alert';
import Spinner from '../../Common/Spinner';
import { FaPaperPlane, FaTimes, FaFileAlt, FaLink } from 'react-icons/fa';
import './AdminDashboard.css'; // Shared CSS

const ReviewModal = ({ submission, onClose, onSuccess }) => {
    const [status, setStatus] = useState(submission.status === 'Approved' || submission.status === 'Rejected' ? submission.status : 'Submitted');
    const [feedback, setFeedback] = useState(submission.feedback || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [localSuccess, setLocalSuccess] = useState('');


    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setError('');
        setLocalSuccess('');
        if (!status || (status === 'Rejected' && !feedback.trim())) {
            setError('For rejection, feedback is required.');
            return;
        }
        setLoading(true);
        try {
            await adminService.reviewSubmission(submission._id, status, feedback);
            setLocalSuccess(`Submission successfully ${status.toLowerCase()}.`);
            setTimeout(() => {
                onSuccess(); // This will refetch and close modal
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to submit review.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Close modal on ESC key
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content review-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                <h3>Review Submission: {submission.title}</h3>
                <p><strong>Student:</strong> {submission.student?.name || 'N/A'}</p>
                <p><strong>Project:</strong> {submission.projectTitleSnapshot}</p>
                <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>

                <div className="submission-details-modal">
                    <h4>Submission Details:</h4>
                    <p><strong>Description:</strong> {submission.description}</p>
                    {submission.submissionFile && (
                        <p>
                            <strong>File:</strong>{' '}
                            <a href={`${process.env.REACT_APP_API_URL_NO_PROXY || ''}${submission.submissionFile}`} target="_blank" rel="noopener noreferrer" className="modal-link">
                                <FaFileAlt /> {submission.submissionFile.split('/').pop()}
                            </a>
                        </p>
                    )}
                    {submission.submissionLink && (
                        <p>
                            <strong>Link:</strong>{' '}
                            <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer" className="modal-link">
                                <FaLink /> {submission.submissionLink}
                            </a>
                        </p>
                    )}
                </div>


                {error && <Alert type="danger" message={error} onClose={() => setError('')} dismissible />}
                {localSuccess && <Alert type="success" message={localSuccess} />}

                <form onSubmit={handleSubmitReview} className="mt-2">
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="form-control" required>
                            <option value="Submitted" disabled>Submitted (Pending)</option>
                            <option value="Approved">Approve</option>
                            <option value="Rejected">Reject</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="feedback">Feedback (Required if Rejection)</label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="4"
                            className="form-control"
                            placeholder="Provide constructive feedback..."
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <Spinner message="" /> : <><FaPaperPlane /> Submit Review</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;