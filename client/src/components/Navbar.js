import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { TbSquareRoundedLetterMFilled } from "react-icons/tb";


const Navbar = () => {
    const { session, logout } = useSession();
    const location = useLocation();
    const navigate = useNavigate()

    // Function to determine if a link is active
    const isActiveLink = (path) => {
        return location.pathname === path ? 'text-pink-500 font-bold underline-offset-2 underline' : 'text-white';
    };

    const handleLogout = async() => {
        await logout(); 
        navigate('/')
      
    };

    return (
        <nav className="bg-pink-700 p-4 flex items-center justify-between rounded-b-xl">
            {/* Website name */}
            <Link to="/" className="text-white text-xl font-bold">
                <div className='flex gap-2 justify-center items-center'> 
            <TbSquareRoundedLetterMFilled size={30}/> MyntraGram
            </div>
            </Link>

            {/* Tabs */}
            <div className="flex space-x-4">
                <Link
                    to="/posts"
                    className={`text-white hover:text-pink-500 ${isActiveLink('/posts')} px-3 py-2 rounded-md`}
                >
                    All Posts
                </Link>
                <Link
                    to="/myfashion"
                    className={`text-white hover:text-pink-500 ${isActiveLink('/myfashion')} px-3 py-2 rounded-md`}
                >
                    My Fashion
                </Link>
                <Link
                    to="/explore"
                    className={`text-white hover:text-pink-500 ${isActiveLink('/explore')} px-3 py-2 rounded-md`}
                >
                    Explore Trending
                </Link>
                {session && session.role === "influencer" && (
                
                <Link to="/createpost" className={`text-white hover:text-pink-500 flex items-center space-x-1 ${isActiveLink(
                    '/createpost'
                )} px-3 py-2 rounded-md`}>
                    Create Post
                </Link>
                
        )}
                <Link
                    to={`/profile`}
                    className={`text-white hover:text-pink-500 flex items-center space-x-1 ${isActiveLink(
                        '/profile'
                    )} px-3 py-2 rounded-md`}
                >
                    {session && (
                        <>
                            <span>{session.username}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </>
                    )}
                </Link>
                <button
                    onClick={handleLogout}
                    className="text-white hover:text-pink-500 px-3 py-2 rounded-md"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
