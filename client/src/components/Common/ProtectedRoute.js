// client/src/components/Common/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from './Spinner';

const ProtectedRoute = ({ rolesAllowed }) => {
    const { isAuthenticated, user, loadingAuth } = useAuth();
    const location = useLocation();

    if (loadingAuth) {
        return <Spinner fullPage={true} message="Verifying access..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check for role authorization if rolesAllowed prop is provided
    if (rolesAllowed && rolesAllowed.length > 0 && !rolesAllowed.includes(user?.role)) {
        // User is authenticated but not authorized for this specific route
        // Redirect to a 'not authorized' page or back to dashboard/home
        // For simplicity, redirecting to dashboard. A dedicated "Access Denied" page is better.
        console.warn(`User role '${user?.role}' not authorized for this route. Allowed: ${rolesAllowed.join(', ')}`);
        return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
        // Or: return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />; // Render the nested child route
};

export default ProtectedRoute;