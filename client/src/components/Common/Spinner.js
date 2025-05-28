// client/src/components/Common/Spinner.js
import React from 'react';
import './Spinner.css'; // We'll create this CSS file

const Spinner = ({ fullPage = false, message = "Loading..." }) => {
    if (fullPage) {
        return (
            <div className="global-spinner-container">
                <div className="spinner"></div>
                {message && <p className="spinner-message">{message}</p>}
            </div>
        );
    }

    return (
        <div className="inline-spinner-container">
            <div className="spinner small-spinner"></div>
            {message && <span className="spinner-message-inline">{message}</span>}
        </div>
    );
};

export default Spinner;