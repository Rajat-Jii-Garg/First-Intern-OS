// client/src/components/Dashboard/Admin/AdminDashboardOverview.js
import React, { useState, useEffect } from 'react';
import adminService from '../../../services/admin.service';
import Spinner from '../../Common/Spinner';
import Alert from '../../Common/Alert';
import { FaUsers, FaTasks, FaHourglassHalf, FaCheckDouble } from 'react-icons/fa';
import './AdminDashboard.css'; // Shared Admin CSS

const AdminDashboardOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await adminService.getAdminStats();
                setStats(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load admin stats.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Spinner message="Loading admin overview..." />;
    if (error) return <Alert type="danger" message={error} />;
    if (!stats) return <Alert type="info" message="No statistics available." />;

    const statItems = [
        { title: "Total Students", value: stats.totalStudents, icon: <FaUsers />, color: "blue" },
        { title: "Total Submissions", value: stats.totalSubmissions, icon: <FaTasks />, color: "purple" },
        { title: "Pending Review", value: stats.pendingSubmissions, icon: <FaHourglassHalf />, color: "orange" },
        { title: "Approved Submissions", value: stats.approvedSubmissions, icon: <FaCheckDouble />, color: "green" },
    ];

    return (
        <div className="admin-dashboard-overview">
            <h2 className="page-title">Admin Dashboard Overview</h2>
            <div className="admin-stats-grid">
                {statItems.map(item => (
                    <div key={item.title} className={`admin-stat-card card card-${item.color}`}>
                        <div className="admin-stat-icon">{item.icon}</div>
                        <div className="admin-stat-content">
                            <span className="admin-stat-value">{item.value}</span>
                            <span className="admin-stat-title">{item.title}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Add links to manage students, submissions etc. */}
            <div className="admin-quick-links mt-3">
                {/* Example: <Link to="/admin/students" className="btn btn-primary">Manage Students</Link> */}
            </div>
        </div>
    );
};

export default AdminDashboardOverview;