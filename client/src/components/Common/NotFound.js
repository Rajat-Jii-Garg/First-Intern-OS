// client/src/components/Common/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <FaExclamationTriangle className="not-found-icon" />
            <h1 className="not-found-title">404 - Page Not Found</h1>
            <p className="not-found-message">
                Oops! The page you are looking for does not exist.
                It might have been moved or deleted.
            </p>
            <Link to="/" className="btn btn-primary">
                Go to Homepage
            </Link>
        </div>
    );
};

export default NotFound;