// client/src/components/Dashboard/Student/SubmitProjectPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../../../services/project.service';
import Alert from '../../Common/Alert';
import Spinner from '../../Common/Spinner';
import { FaUpload, FaLink, FaPaperPlane, FaTimesCircle, FaFileAlt, FaTrash } from 'react-icons/fa';
import './StudentDashboard.css'; // Shared CSS

const SubmitProjectPage = () => {
    const { projectIdentifier } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [projectDetails, setProjectDetails] = useState(null);
    const [submission, setSubmission] = useState({
        title: '',
        description: '',
        submissionLink: '',
    });
    const [submissionFile, setSubmissionFile] = useState(null);
    const [existingFileName, setExistingFileName] = useState('');
    const [clearExistingFile, setClearExistingFile] = useState(false);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProjectData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await projectService.getProjectDetailsForStudent(projectIdentifier);
                const data = response.data.data;
                setProjectDetails(data);
                if (data.submission) {
                    setSubmission({
                        title: data.submission.title || `Submission for ${data.title}`,
                        description: data.submission.description || '',
                        submissionLink: data.submission.submissionLink || '',
                    });
                    if(data.submission.submissionFile) {
                        setExistingFileName(data.submission.submissionFile.split('/').pop());
                    }
                } else {
                    setSubmission({ title: `Submission for ${data.title}`, description: '', submissionLink: ''});
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load project details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjectData();
    }, [projectIdentifier]);

    const handleChange = (e) => {
        setSubmission({ ...submission, [e.target.name]: e.target.value });
        setError(''); setSuccess('');
    };

    const handleFileChange = (e) => {
        setSubmissionFile(e.target.files[0]);
        setExistingFileName(''); // Clear existing file name if new one is chosen
        setClearExistingFile(false); // Unset clear flag if new file chosen
        setError(''); setSuccess('');
    };

    const handleRemoveFile = () => {
        setSubmissionFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
        if (existingFileName) { // If there was an existing file and user wants to remove it
            setClearExistingFile(true);
            setExistingFileName(''); // Visually remove it
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!submission.title.trim() || !submission.description.trim()) {
            setError('Title and Description are required.');
            return;
        }
        if (!submission.submissionLink && !submissionFile && !existingFileName && !clearExistingFile) {
            // If there's an existing file and clearExistingFile is false, it means user wants to keep it (and not uploading new or link)
            // this scenario is fine if existingFileName is present and clearExistingFile is false
        } else if (!submission.submissionLink && !submissionFile && !(existingFileName && !clearExistingFile)) {
             setError('Please provide a submission link or upload a file.');
             return;
        }


        setSubmitting(true);
        const formData = new FormData();
        formData.append('projectIdentifier', projectIdentifier);
        formData.append('title', submission.title);
        formData.append('description', submission.description);
        if (submission.submissionLink) formData.append('submissionLink', submission.submissionLink);
        if (submissionFile) formData.append('submissionFile', submissionFile);
        if (clearExistingFile) formData.append('clearFile', 'true');


        try {
            const response = await projectService.submitOrUpdateProject(formData);
            setSuccess(response.data.message || 'Submission successful!');
            // Optionally update local state if needed or navigate
            setTimeout(() => {
                navigate('/dashboard'); // Or to /dashboard/submissions
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Submission failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Spinner message="Loading submission form..." />;
    if (error && !projectDetails) return <Alert type="danger" message={error} />; // Error loading project itself
    if (!projectDetails) return <Alert type="info" message="Project details not found." />;

    const isUpdate = !!projectDetails.submission;

    return (
        <div className="submit-project-page card">
            <h2 className="page-title">{isUpdate ? 'Update Submission for' : 'Submit Project:'} {projectDetails.title}</h2>
            <p className="page-subtitle">{projectDetails.description}</p>

            {error && !submitting && <Alert type="danger" message={error} onClose={() => setError('')} dismissible />}
            {success && <Alert type="success" message={success} />}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Submission Title</label>
                    <input type="text" id="title" name="title" value={submission.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description / Notes</label>
                    <textarea id="description" name="description" value={submission.description} onChange={handleChange} rows="5" required />
                </div>
                <div className="form-group">
                    <label htmlFor="submissionLink"><FaLink /> Submission Link (e.g., GitHub, Google Drive, Figma)</label>
                    <input type="url" id="submissionLink" name="submissionLink" value={submission.submissionLink} onChange={handleChange} placeholder="https://example.com/my-project" />
                </div>

                <p className="text-center my-2"><strong>OR</strong></p>

                <div className="form-group">
                    <label htmlFor="submissionFile"><FaUpload /> Upload File (PDF, DOC, DOCX - Max 10MB)</label>
                    <input type="file" id="submissionFile" name="submissionFile" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                    {(submissionFile || (existingFileName && !clearExistingFile)) && (
                        <div className="file-preview-container mt-2">
                            <FaFileAlt />
                            <span>{submissionFile ? submissionFile.name : existingFileName}</span>
                            <button type="button" onClick={handleRemoveFile} className="btn btn-danger btn-sm remove-file-btn">
                                <FaTrash /> Remove
                            </button>
                        </div>
                    )}
                    {isUpdate && projectDetails.submission?.submissionFile && !existingFileName && !submissionFile && (
                         <p className="text-muted small mt-1">Previously uploaded: {projectDetails.submission.submissionFile.split('/').pop()}. Uploading a new file will replace it.</p>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3" disabled={submitting}>
                    {submitting ? <Spinner message="" /> : (isUpdate ? <><FaPaperPlane /> Update Submission</> : <><FaPaperPlane /> Submit Project</>)}
                </button>
            </form>
            {projectDetails.submission?.status === 'Rejected' && projectDetails.submission.feedback && (
                 <div className="mt-3 card" style={{borderColor: 'var(--danger-color)'}}>
                    <h4>Admin Feedback:</h4>
                    <p style={{color: 'var(--danger-color)'}}>{projectDetails.submission.feedback}</p>
                </div>
            )}
        </div>
    );
};

export default SubmitProjectPage;