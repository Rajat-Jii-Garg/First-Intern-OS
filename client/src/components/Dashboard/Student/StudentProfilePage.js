// client/src/components/Dashboard/Student/StudentProfilePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import userService from '../../../services/user.service';
import Alert from '../../Common/Alert';
import Spinner from '../../Common/Spinner';
import { FaUserEdit, FaLock, FaCamera, FaSave } from 'react-icons/fa';
import './StudentDashboard.css'; // Shared CSS

const StudentProfilePage = () => {
    const { user, token, updateUserContext, reloadUser } = useAuth(); // user is from context
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [avatarError, setAvatarError] = useState('');

    const [success, setSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [avatarSuccess, setAvatarSuccess] = useState('');

    const avatarInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name || '', email: user.email || '' });
            setAvatarPreview(user.avatar.startsWith('http') ? user.avatar : `${process.env.REACT_APP_API_URL_NO_PROXY || ''}${user.avatar}?t=${new Date().getTime()}`);
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); setSuccess('');
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
        setPasswordError(''); setPasswordSuccess('');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setAvatarError("File is too large. Max 2MB allowed.");
                setAvatarFile(null);
                setAvatarPreview(user.avatar.startsWith('http') ? user.avatar : `${process.env.REACT_APP_API_URL_NO_PROXY || ''}${user.avatar}`); // Revert to old
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file)); // Show preview
            setAvatarError(''); setAvatarSuccess('');
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!formData.name.trim()) {
            setError("Name cannot be empty.");
            return;
        }
        setLoading(true);
        try {
            const response = await userService.updateProfile({ name: formData.name });
            setSuccess(response.data.message || 'Profile updated successfully!');
            updateUserContext(response.data.data); // Update context
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError(''); setPasswordSuccess('');
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            setPasswordError("Please fill all password fields.");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }
        setPasswordLoading(true);
        try {
            const response = await userService.updateProfile(passwordData); // Backend handles if name is not sent
            setPasswordSuccess(response.data.message || 'Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear fields
        } catch (err) {
            setPasswordError(err.response?.data?.message || err.message || 'Failed to change password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleAvatarSubmit = async (e) => {
        e.preventDefault();
        setAvatarError(''); setAvatarSuccess('');
        if (!avatarFile) {
            setAvatarError("Please select an image file.");
            return;
        }
        setAvatarLoading(true);
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        try {
            const response = await userService.updateAvatar(formData);
            setAvatarSuccess(response.data.message || 'Avatar updated successfully!');
            updateUserContext({ avatar: response.data.data.avatar }); // Update context
            setAvatarFile(null); // Clear file input after successful upload
            // No need to call reloadUser if updateUserContext handles localStorage correctly
            // await reloadUser(); // Or reload user to get fresh data from backend, including new avatar path from DB
        } catch (err) {
            setAvatarError(err.response?.data?.message || err.message || 'Failed to update avatar.');
            setAvatarPreview(user.avatar.startsWith('http') ? user.avatar : `${process.env.REACT_APP_API_URL_NO_PROXY || ''}${user.avatar}`); // Revert preview on error
        } finally {
            setAvatarLoading(false);
        }
    };


    if (!user) return <Spinner message="Loading profile..." />;

    return (
        <div className="profile-page">
            <h2 className="page-title"><FaUserEdit /> My Profile</h2>

            {/* Avatar Update Section */}
            <div className="card profile-section mb-3">
                <h3><FaCamera /> Profile Picture</h3>
                {avatarError && <Alert type="danger" message={avatarError} onClose={() => setAvatarError('')} dismissible />}
                {avatarSuccess && <Alert type="success" message={avatarSuccess} />}
                <div className="avatar-upload-area">
                    <img src={avatarPreview || '/path/to/default-avatar.png'} alt="Avatar Preview" className="avatar-preview" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} ref={avatarInputRef} style={{ display: 'none' }} />
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => avatarInputRef.current && avatarInputRef.current.click()}>
                        Choose Image
                    </button>
                    {avatarFile && (
                        <button onClick={handleAvatarSubmit} className="btn btn-primary btn-sm ml-2" disabled={avatarLoading}>
                            {avatarLoading ? <Spinner message="" /> : <><FaSave /> Upload Avatar</>}
                        </button>
                    )}
                </div>
                {avatarFile && <p className="mt-1 small">Selected: {avatarFile.name}</p>}
            </div>


            {/* Profile Details Update Section */}
            <div className="card profile-section mb-3">
                <h3><FaUserEdit /> Basic Information</h3>
                {error && <Alert type="danger" message={error} onClose={() => setError('')} dismissible />}
                {success && <Alert type="success" message={success} />}
                <form onSubmit={handleProfileSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleProfileChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} readOnly disabled />
                        <small className="text-muted">Email address cannot be changed.</small>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <Spinner message="" /> : <><FaSave /> Update Profile</>}
                    </button>
                </form>
            </div>

            {/* Password Change Section */}
            <div className="card profile-section">
                <h3><FaLock /> Change Password</h3>
                {passwordError && <Alert type="danger" message={passwordError} onClose={() => setPasswordError('')} dismissible />}
                {passwordSuccess && <Alert type="success" message={passwordSuccess} />}
                <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength="6" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirm New Password</label>
                        <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required minLength="6" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                        {passwordLoading ? <Spinner message="" /> : <><FaSave /> Change Password</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentProfilePage;