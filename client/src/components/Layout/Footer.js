// client/src/components/Layout/Footer.js
import React from 'react';
import './Layout.css'; // Shared CSS

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <p>© {new Date().getFullYear()} First Intern OS. All Rights Reserved.</p>
                <p>Empowering the next generation of interns.</p>
                {/* Add social media links or other footer content if needed */}
            </div>
        </footer>
    );
};

export default Footer;