import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {

    return (
        <nav className="bg-pink-700 p-4 flex items-center justify-between rounded-b-xl">
            {/* Website name */}
            <Link to="/" className="text-white text-xl font-bold">
                MyntraGram
            </Link>

            
        </nav>
    );
};

export default LandingNavbar;
