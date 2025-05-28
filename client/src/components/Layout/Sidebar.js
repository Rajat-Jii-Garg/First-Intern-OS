// client/src/components/Layout/Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    FaTachometerAlt, FaFileUpload, FaCheckCircle, FaCertificate, FaUserEdit, FaSignOutAlt,
    FaUsers, FaTasks, FaCog // Admin Icons
} from 'react-icons/fa';
import './Layout.css';

const Sidebar = ({ userRole, onLinkClick }) => { // onLinkClick to close mobile sidebar
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        if(onLinkClick) onLinkClick(); // Close mobile menu if open
        navigate('/login');
    };

    const studentLinks = [
        { to: "/dashboard", icon: <FaTachometerAlt />, text: "Dashboard" },
        // Submit Project link might be dynamic or a general section in dashboard overview
        // { to: "/dashboard/submit", icon: <FaFileUpload />, text: "Submit Project" },
        { to: "/dashboard/submissions", icon: <FaTasks />, text: "My Submissions" },
        { to: "/dashboard/certificate", icon: <FaCertificate />, text: "Certificate" },
        { to: "/dashboard/profile", icon: <FaUserEdit />, text: "My Profile" },
    ];

    const adminLinks = [
        { to: "/admin", icon: <FaTachometerAlt />, text: "Admin Overview" },
        { to: "/admin/students", icon: <FaUsers />, text: "Manage Students" },
        { to: "/admin/submissions", icon: <FaTasks />, text: "Manage Submissions" },
        // { to: "/admin/settings", icon: <FaCog />, text: "Settings" },
        { to: "/dashboard/profile", icon: <FaUserEdit />, text: "My Profile" }, // Admin also has a profile
    ];

    const links = userRole === 'admin' ? adminLinks : studentLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img
                    src={(user?.avatar && user.avatar.startsWith('http')) ? user.avatar : `${process.env.REACT_APP_API_URL_NO_PROXY || ''}${user?.avatar || '/uploads/avatars/default-avatar.png'}`}
                    alt={user?.name || 'User'}
                    className="sidebar-avatar"
                />
                <h3 className="sidebar-username">{user?.name || 'User'}</h3>
                <p className="sidebar-userrole">{userRole === 'admin' ? 'Administrator' : 'Student Intern'}</p>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {links.map((link, index) => (
                        <li key={index}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
                                onClick={onLinkClick} // For mobile
                                end={link.to === '/dashboard' || link.to === '/admin'} // `end` for overview links
                            >
                                {link.icon}
                                <span>{link.text}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <button onClick={handleLogout} className="sidebar-logout-btn btn btn-danger btn-sm">
                <FaSignOutAlt /> Logout
            </button>
        </aside>
    );
};

export default Sidebar;