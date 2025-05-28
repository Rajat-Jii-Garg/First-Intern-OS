// client/src/pages/DashboardPage.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout'; // Student specific layout

const DashboardPage = () => {
    // This page component primarily acts as a wrapper for the DashboardLayout
    // The actual content for different dashboard sections will be rendered via <Outlet />
    // and defined as nested routes in App.js
    return (
        <DashboardLayout>
            <Outlet /> {/* Renders child routes like overview, submissions, profile etc. */}
        </DashboardLayout>
    );
};

export default DashboardPage;