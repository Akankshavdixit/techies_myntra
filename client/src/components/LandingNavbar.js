import React from 'react';
import { Link } from 'react-router-dom';
import { TbSquareRoundedLetterMFilled } from "react-icons/tb";


const LandingNavbar = () => {

    return (
        <nav className="bg-pink-700 p-4 flex items-center justify-between rounded-b-xl">
            {/* Website name */}
            <Link to="/" className="text-white text-xl font-bold">
                <div className='flex gap-2 justify-center items-center'> 
            <TbSquareRoundedLetterMFilled size={30}/> MyntraGram
            </div>
            </Link>

            
        </nav>
    );
};

export default LandingNavbar;
