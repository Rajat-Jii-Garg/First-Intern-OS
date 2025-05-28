// client/src/components/Layout/AdminLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Layout.css'; // Shared layout CSS

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const closeSidebar = () => {
        if (isSidebarOpen) setIsSidebarOpen(false);
    }

    return (
        <div className={`dashboard-layout admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
             <div className="dashboard-sidebar-container">
                <Sidebar userRole="admin" onLinkClick={closeSidebar} />
            </div>

            <div className="dashboard-content-wrapper">
                <header className="dashboard-topbar">
                    <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <div className="topbar-title">Admin Panel</div>
                    {/* Admin specific top-bar items */}
                </header>
                <main className="dashboard-main-content-area" onClick={closeSidebar}>
                    <Outlet /> {/* Nested admin dashboard routes will render here */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;