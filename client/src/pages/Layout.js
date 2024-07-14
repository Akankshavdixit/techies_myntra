import React from 'react';
import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div className="pt-20">
                {/* Add padding-top equal to navbar height */}
                {children}
            </div>
        </div>
    );
};

export default Layout;
