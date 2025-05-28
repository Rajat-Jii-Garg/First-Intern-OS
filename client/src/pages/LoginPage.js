// client/src/pages/LoginPage.js
import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
// Auth.css is imported within LoginForm, so no need here if page structure is simple

const LoginPage = () => {
    return (
        <div className="auth-page-wrapper"> {/* Reusing class from Auth.css for centering */}
            <LoginForm />
        </div>
    );
};

export default LoginPage;