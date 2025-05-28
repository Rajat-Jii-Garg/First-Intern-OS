// client/src/components/Layout/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Navbar />
            <main className="public-content-area"> {/* Different class for public content styling */}
                <Outlet /> {/* Renders the matched child route's component */}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;