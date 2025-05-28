// client/src/components/Dashboard/Student/StudentDashboardOverview.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../../services/user.service';
import Spinner from '../../Common/Spinner';
import Alert from '../../Common/Alert';
import ProjectCard from './ProjectCard'; // We will create this
import { FaLightbulb, FaTasks, FaCertificate, FaUser } from 'react-icons/fa';
import './StudentDashboard.css';

const StudentDashboardOverview = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await userService.getStudentDashboardData();
                setDashboardData(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load dashboard data.');
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <Spinner fullPage={false} message="Loading dashboard..." />;
    if (error) return <Alert type="danger" message={error} />;
    if (!dashboardData) return <Alert type="info" message="No dashboard data available." />;

    const { user, projects, overallProgress, certificateUnlocked, approvedCount, totalProjects } = dashboardData;

    const quickStats = [
        { title: "Projects Submitted", value: projects.filter(p => ['Submitted', 'Approved', 'Rejected'].includes(p.status)).length + ` / ${totalProjects}`, icon: <FaTasks />, color: 'info' },
        { title: "Projects Approved", value: approvedCount + ` / ${totalProjects}`, icon: <FaCheckCircle />, color: 'success' },
        { title: "Overall Progress", value: `${overallProgress}%`, icon: <FaLightbulb />, color: 'primary' }, // Using FaLightbulb for progress/ideas
        { title: "Certificate", value: certificateUnlocked ? "Unlocked!" : "Locked", icon: <FaCertificate />, color: certificateUnlocked ? 'success' : 'warning' },
    ];


    return (
        <div className="student-dashboard-overview">
            <div className="dashboard-welcome card">
                 <img
                    src={user.avatar.startsWith('http') ? user.avatar : `${process.env.REACT_APP_API_URL_NO_PROXY || ''}${user.avatar}`}
                    alt={user.name}
                    className="dashboard-user-avatar"
                />
                <div>
                    <h2>Welcome back, {user.name}!</h2>
                    <p>Here's an overview of your internship journey. Keep up the great work!</p>
                </div>
            </div>

            <div className="dashboard-quick-stats">
                {quickStats.map(stat => (
                    <div key={stat.title} className={`stat-card card stat-${stat.color}`}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-content">
                            <h4>{stat.value}</h4>
                            <p>{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>


            <div className="dashboard-progress-section card">
                <h3>Overall Internship Progress</h3>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${overallProgress}%` }}
                        role="progressbar"
                        aria-valuenow={overallProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        {overallProgress}%
                    </div>
                </div>
                {certificateUnlocked && (
                    <Link to="/dashboard/certificate" className="btn btn-success btn-sm mt-2">
                        <FaCertificate /> View Your Certificate
                    </Link>
                )}
            </div>

            <h3>Your Internship Projects</h3>
            <div className="project-cards-grid">
                {projects && projects.length > 0 ? (
                    projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <p>No projects assigned yet. Please check back later.</p>
                )}
            </div>

            {/* Optional: Recent Activity or Announcements Section */}
        </div>
    );
};

// Dummy icon for FaCheckCircle if not already imported
const FaCheckCircle = ({ className }) => <span className={className}>✔</span>;


export default StudentDashboardOverview;