// client/src/components/Common/AdminRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from './Spinner';

const AdminRoute = () => {
    const { isAuthenticated, isAdmin, loadingAuth } = useAuth();
    const location = useLocation();

    if (loadingAuth) {
        return <Spinner fullPage={true} message="Verifying admin access..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        // User is authenticated but not an admin
        // Redirect to student dashboard or a generic "access denied" page
        return <Navigate to="/dashboard" replace />;
        // Or: return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />; // Render the nested admin child route
};

export default AdminRoute;