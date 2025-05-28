// client/src/components/Auth/SignupForm.js
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../Common/Alert';
import Spinner from '../Common/Spinner';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import './Auth.css';

const SignupForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setLoading(true);
        try {
            await signup(name, email, password);
            navigate('/dashboard'); // Navigate to student dashboard after signup
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2 className="auth-title">Create Your Account</h2>
            <p className="auth-subtitle">Join First Intern OS and kickstart your journey!</p>
            {error && <Alert type="danger" message={error} onClose={() => setError('')} dismissible />}
            <form onSubmit={onSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-with-icon">
                        <FaUser />
                        <input type="text" id="name" name="name" value={name} onChange={onChange} placeholder="Your Full Name" required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                     <div className="input-with-icon">
                        <FaEnvelope />
                        <input type="email" id="email" name="email" value={email} onChange={onChange} placeholder="you@example.com" required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password <small>(Min. 6 characters)</small></label>
                    <div className="input-with-icon">
                        <FaLock />
                        <input type="password" id="password" name="password" value={password} onChange={onChange} placeholder="Create a strong password" required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-with-icon">
                        <FaLock />
                        <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Re-enter your password" required />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 auth-submit-btn" disabled={loading}>
                    {loading ? <Spinner message="" /> : 'Sign Up'}
                </button>
            </form>
            <p className="auth-switch-text">
                Already have an account? <Link to="/login" className="auth-link">Login Here</Link>
            </p>
        </div>
    );
};

export default SignupForm;