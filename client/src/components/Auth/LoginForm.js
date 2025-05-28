// client/src/components/Auth/LoginForm.js
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Alert from '../Common/Alert';
import Spinner from '../Common/Spinner';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Auth.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on change
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            const loginResponse = await login(email, password);
            // login function in AuthContext now sets user state which includes user details and token
            // Navigate based on role after successful login
            const userRole = loginResponse?.user?.role;
            if (userRole === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2 className="auth-title">Welcome Back!</h2>
            <p className="auth-subtitle">Login to access your First Intern OS dashboard.</p>
            {error && <Alert type="danger" message={error} onClose={() => setError('')} dismissible />}
            <form onSubmit={onSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-with-icon">
                        <FaEnvelope />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon">
                        <FaLock />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 auth-submit-btn" disabled={loading}>
                    {loading ? <Spinner message="" /> : 'Login'}
                </button>
            </form>
            <p className="auth-switch-text">
                Don't have an account? <Link to="/signup" className="auth-link">Sign Up Here</Link>
            </p>
        </div>
    );
};

export default LoginForm;