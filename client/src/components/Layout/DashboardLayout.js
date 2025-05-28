// client/src/components/Layout/DashboardLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; // Or a dedicated DashboardNavbar
import { FaBars, FaTimes } from 'react-icons/fa';
import './Layout.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const closeSidebar = () => {
        if (isSidebarOpen) setIsSidebarOpen(false);
    }

    return (
        <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="dashboard-sidebar-container">
                 <Sidebar userRole="student" onLinkClick={closeSidebar} />
            </div>

            <div className="dashboard-content-wrapper">
                {/* You can have a simpler top bar here instead of full Navbar if preferred */}
                {/* For now, reusing Navbar, but it might need role-specific adjustments */}
                <header className="dashboard-topbar">
                    <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <div className="topbar-title">Student Dashboard</div>
                    {/* Add any other top bar elements like notifications or quick user access */}
                </header>
                <main className="dashboard-main-content-area" onClick={closeSidebar}>
                    <Outlet /> {/* Nested student dashboard routes will render here */}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;