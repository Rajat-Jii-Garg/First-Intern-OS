// client/src/App.js
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './App.css'; // Main App CSS

// Common Components
import ProtectedRoute from './components/Common/ProtectedRoute'; // Role-aware protected route
import AdminRoute from './components/Common/AdminRoute';       // Admin specific protected route
import Spinner from './components/Common/Spinner';             // Loading spinner
import NotFound from './components/Common/NotFound';           // 404 Page

// Layouts (Eagerly loaded as they define overall structure)
import MainLayout from './components/Layout/MainLayout';
// DashboardPage and AdminDashboardPage will internally use their specific layouts

// --- Lazy Loaded Pages & Dashboard Components ---

// Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

// Student Dashboard Main Container Page (which uses DashboardLayout)
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
// Student Dashboard Sections/Components (children of DashboardPage)
const StudentDashboardOverview = lazy(() => import('./components/Dashboard/Student/StudentDashboardOverview'));
const SubmitProjectPage = lazy(() => import('./components/Dashboard/Student/SubmitProjectPage'));
const MySubmissionsPage = lazy(() => import('./components/Dashboard/Student/MySubmissionsPage'));
const CertificatePage = lazy(() => import('./components/Dashboard/Student/CertificatePage'));
const StudentProfilePage = lazy(() => import('./components/Dashboard/Student/StudentProfilePage'));

// Admin Dashboard Main Container Page (which uses AdminLayout)
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
// Admin Dashboard Sections/Components (children of AdminDashboardPage)
const AdminDashboardOverview = lazy(() => import('./components/Dashboard/Admin/AdminDashboardOverview'));
const ManageStudentsPage = lazy(() => import('./components/Dashboard/Admin/ManageStudentsPage'));
const ManageSubmissionsPage = lazy(() => import('./components/Dashboard/Admin/ManageSubmissionsPage'));

// AI Chatbot (can be placed in a layout or globally if always visible)
const Chatbot = lazy(() => import('./components/Dashboard/Chatbot/Chatbot'));


function App() {
  const { user, loadingAuth, isAuthenticated, isAdmin } = useAuth();

  if (loadingAuth) {
    return <Spinner fullPage={true} message="Initializing First Intern OS..." />;
  }

  return (
    <div className="App"> {/* Main App container */}
      <Suspense fallback={<Spinner fullPage={true} message="Loading page..." />}>
        <Routes>
          {/* Public Routes - Wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> : <LoginPage />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> : <SignupPage />}
            />
          </Route>

          {/* Student Protected Routes - Wrapped in DashboardPage (which uses DashboardLayout) */}
          <Route element={<ProtectedRoute rolesAllowed={['student', 'admin']} />}> {/* Admin can also view student parts */}
            <Route path="/dashboard" element={<DashboardPage />}> {/* This uses DashboardLayout */}
              <Route index element={<StudentDashboardOverview />} />
              <Route path="submit/:projectIdentifier" element={<SubmitProjectPage />} />
              <Route path="submissions" element={<MySubmissionsPage />} />
              <Route path="certificate" element={<CertificatePage />} />
              <Route path="profile" element={<StudentProfilePage />} />
            </Route>
          </Route>

          {/* Admin Protected Routes - Wrapped in AdminDashboardPage (which uses AdminLayout) */}
          <Route element={<AdminRoute />}> {/* This checks for isAuthenticated AND isAdmin */}
            <Route path="/admin" element={<AdminDashboardPage />}> {/* This uses AdminLayout */}
              <Route index element={<AdminDashboardOverview />} />
              <Route path="students" element={<ManageStudentsPage />} />
              <Route path="submissions" element={<ManageSubmissionsPage />} />
              {/* Admin might also access their profile via the student profile page/component */}
              <Route path="profile" element={<StudentProfilePage />} />
            </Route>
          </Route>

          {/* Fallback 404 Not Found Route */}
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} /> {/* Wrap NotFound in a layout too */}
        </Routes>
      </Suspense>
      {/* Chatbot can be rendered based on authentication or specific pages */}
      {isAuthenticated && <Chatbot />}
    </div>
  );
}

export default App;