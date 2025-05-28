// client/src/App.js
import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth'; // Custom hook for auth context
import authService from './services/auth.service'; // For setting token on app load
import './App.css'; // Main App styles

// Layout Components - These will wrap page content
const MainLayout = lazy(() => import('./components/Layout/MainLayout'));
const DashboardLayout = lazy(() => import('./components/Layout/DashboardLayout')); // For Student
const AdminLayout = lazy(() => import('./components/Layout/AdminLayout')); // For Admin

// Common Components
const ProtectedRoute = lazy(() => import('./components/Common/ProtectedRoute'));
const AdminRoute = lazy(() => import('./components/Common/AdminRoute'));
const Spinner = lazy(() => import('./components/Common/Spinner')); // Full page spinner
const NotFound = lazy(() => import('./components/Common/NotFoundPage')); // Renamed for clarity

// Public Page Components (Lazy Loaded)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

// Student Dashboard Page Components (Lazy Loaded)
const StudentDashboardOverview = lazy(() => import('./pages/StudentDashboard/StudentDashboardOverview'));
const SubmitProjectPage = lazy(() => import('./pages/StudentDashboard/SubmitProjectPage'));
const MySubmissionsPage = lazy(() => import('./pages/StudentDashboard/MySubmissionsPage'));
const CertificatePage = lazy(() => import('./pages/StudentDashboard/CertificatePage'));
const StudentProfilePage = lazy(() => import('./pages/StudentDashboard/StudentProfilePage'));

// Admin Dashboard Page Components (Lazy Loaded)
const AdminDashboardOverview = lazy(() => import('./pages/AdminDashboard/AdminDashboardOverview'));
const ManageStudentsPage = lazy(() => import('./pages/AdminDashboard/ManageStudentsPage'));
const ManageSubmissionsPage = lazy(() => import('./pages/AdminDashboard/ManageSubmissionsPage'));
const ViewSingleSubmissionPage = lazy(() => import('./pages/AdminDashboard/ViewSingleSubmissionPage'));


function App() {
  const { user, loadingAuth, loadUser } = useAuth(); // loadingAuth from context
  const location = useLocation();

  // On initial load or when token might change, try to load user
  // This ensures that if a token exists in localStorage, the user state is set.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) { // If token exists but no user in context yet
        authService.setAuthToken(token); // Set axios default header
        loadUser(); // Trigger user loading from AuthContext
    }
  }, [loadUser, user]); // Rerun if loadUser function reference changes or user becomes null

  if (loadingAuth) {
    return <Spinner fullPage={true} message="Initializing Application..." />;
  }

  return (
    <Suspense fallback={<Spinner fullPage={true} message="Loading Page..." />}>
      <Routes>
        {/* --- Public Routes (Accessible to all) --- */}
        <Route element={<MainLayout />}> {/* Wraps public pages with Navbar & Footer */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace /> : <SignupPage />}
          />
        </Route>

        {/* --- Student Protected Routes --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute rolesAllowed={['student']}>
              <DashboardLayout /> {/* Wraps student dashboard pages with Sidebar etc. */}
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboardOverview />} />
          <Route path="submit/:projectIdentifier" element={<SubmitProjectPage />} />
          <Route path="submissions" element={<MySubmissionsPage />} />
          <Route path="certificate" element={<CertificatePage />} />
          <Route path="profile" element={<StudentProfilePage />} />
          {/* Add more student-specific sub-routes here as needed */}
        </Route>

        {/* --- Admin Protected Routes --- */}
        <Route
          path="/admin"
          element={
            <AdminRoute> {/* Uses AdminRoute for role 'admin' check */}
              <AdminLayout /> {/* Wraps admin dashboard pages */}
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardOverview />} />
          <Route path="students" element={<ManageStudentsPage />} />
          <Route path="submissions" element={<ManageSubmissionsPage />} />
          <Route path="submissions/:submissionId" element={<ViewSingleSubmissionPage />} />
          {/* <Route path="settings" element={<AdminSettingsPage />} /> */}
          {/* Add more admin-specific sub-routes here */}
        </Route>

        {/* --- Fallback Route for unmatched paths --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;