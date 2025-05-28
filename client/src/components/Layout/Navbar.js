// client/src/components/Layout/Navbar.js
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaUserCog } from 'react-icons/fa'; // Icons
import './Layout.css'; // Shared CSS for Layout components

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    {/* <img src="/path-to-logo.png" alt="First Intern OS" className="logo-img"/> */}
                    First Intern OS
                </Link>

                <div className="menu-icon" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

                <ul className={isMobileMenuOpen ? "nav-menu active" : "nav-menu"}>
                    {isAuthenticated ? (
                        <>
                            <li className="nav-item">
                                <NavLink to={isAdmin ? "/admin" : "/dashboard"} className="nav-links" onClick={closeMobileMenu}>
                                    <FaTachometerAlt /> Dashboard
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/dashboard/profile" className="nav-links" onClick={closeMobileMenu}>
                                   {user?.avatar ? (
                                        <img src={user.avatar.startsWith('http') ? user.avatar : `${process.env.REACT_APP_API_URL_NO_PROXY || ''}${user.avatar}`} alt={user.name} className="nav-avatar-icon" />
                                    ) : (
                                        <FaUserCircle />
                                    )}
                                    {user?.name?.split(' ')[0] || 'Profile'}
                                </NavLink>
                            </li>
                            {isAdmin && (
                                 <li className="nav-item">
                                    <NavLink to="/admin/students" className="nav-links" onClick={closeMobileMenu}>
                                        <FaUserCog /> Admin Panel
                                    </NavLink>
                                </li>
                            )}
                            <li className="nav-item">
                                <button className="nav-links-button btn btn-danger btn-sm" onClick={handleLogout}>
                                    <FaSignOutAlt /> Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <NavLink to="/login" className="nav-links" onClick={closeMobileMenu}>
                                    Login
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/signup" className="nav-links btn btn-primary btn-sm" onClick={closeMobileMenu}>
                                    Sign Up
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;