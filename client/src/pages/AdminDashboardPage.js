// client/src/pages/AdminDashboardPage.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminLayout'; // Admin specific layout

const AdminDashboardPage = () => {
    // Similar to DashboardPage, this wraps the AdminLayout
    // Specific admin sections will be child routes rendered by <Outlet />
    return (
        <AdminLayout>
            <Outlet /> {/* Renders child admin routes */}
        </AdminLayout>
    );
};

export default AdminDashboardPage;