// client/src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaTasks, FaCertificate } from 'react-icons/fa';
import './LandingPage.css'; // Specific styles for the landing page

const LandingPage = () => {
    return (
        <div className="landing-page">
            <section className="hero-section-lp">
                <div className="container hero-content-lp">
                    <h1 className="hero-title-lp">Your Internship Journey Starts Here.</h1>
                    <p className="hero-subtitle-lp">
                        First Intern OS: The modern, engaging portal for students to submit projects,
                        track progress, and earn recognition seamlessly.
                    </p>
                    <Link to="/signup" className="btn btn-primary btn-lg hero-cta-lp">
                        <FaRocket /> Get Started Now
                    </Link>
                </div>
            </section>

            <section className="features-section-lp">
                <div className="container">
                    <h2 className="section-title-lp">Why Choose First Intern OS?</h2>
                    <div className="features-grid-lp">
                        <div className="feature-item-lp card">
                            <FaTasks className="feature-icon-lp" />
                            <h3>Effortless Submissions</h3>
                            <p>Easily submit your projects via direct uploads or links. Track everything in one place.</p>
                        </div>
                        <div className="feature-item-lp card">
                            <FaRocket className="feature-icon-lp" />
                            <h3>Track Your Progress</h3>
                            <p>Stay updated with real-time status of your submissions and overall internship progress.</p>
                        </div>
                        <div className="feature-item-lp card">
                            <FaCertificate className="feature-icon-lp" />
                            <h3>Earn Certificates</h3>
                            <p>Unlock and download certificates upon successful completion of all your projects.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Optional: Add a How It Works or Call to Action section */}
            <section className="cta-section-lp">
                <div className="container text-center">
                    <h2 className="section-title-lp">Ready to Elevate Your Internship Experience?</h2>
                    <p className="cta-text-lp">
                        Join thousands of students who are streamlining their internship submissions with First Intern OS.
                    </p>
                    <div className="cta-buttons-lp">
                        <Link to="/signup" className="btn btn-primary btn-lg">
                            Sign Up for Free
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">
                            Login to Your Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;