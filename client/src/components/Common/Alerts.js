// client/src/components/Common/Alert.js
import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa'; // Using react-icons

const alertIcons = {
    success: <FaCheckCircle />,
    danger: <FaTimesCircle />,
    warning: <FaExclamationTriangle />,
    info: <FaInfoCircle />,
};

const Alert = ({ type = 'info', message, onClose, dismissible = false }) => {
    if (!message) return null;

    const alertClass = `alert alert-${type}`;
    const IconComponent = alertIcons[type] || <FaInfoCircle />;

    return (
        <div className={alertClass} role="alert">
            <span className="alert-icon">{IconComponent}</span>
            <span className="alert-message">{message}</span>
            {dismissible && onClose && (
                <button
                    type="button"
                    className="alert-close-btn"
                    aria-label="Close"
                    onClick={onClose}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default Alert;