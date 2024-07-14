import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useSession } from '../context/SessionContext';
import axios from 'axios';

const UserTag = ({ username }) => {
    const navigate = useNavigate();
    const { session } = useSession();
    const [isFollowing, setIsFollowing] = useState(false)

    const handleClick = () => {
        navigate(`/influencer/${username}`);
    };

    const toggleFollow = async () => {
        try {
            let url = isFollowing ? `http://localhost:8000/posts/unfollow/${username}` : `http://localhost:8000/posts/follow/${username}`;
            const response = await axios.post(url, null, {
                headers: {
                    'Authorization': `Bearer ${session.token}`,
                },
            });

            if (response.status === 200) {
                setIsFollowing(!isFollowing)
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div  className="flex items-center justify-between p-4 bg-white border border-pink-300 rounded-lg shadow-md hover:bg-pink-50 transition cursor-pointer">
            <div className="flex items-center"  onClick={handleClick}>
                <FaUser className="text-pink-500 mr-2" />
                <span className="text-pink-800 font-semibold">{username}</span>
            </div>
            {session && username !== session.username && (
            <button
              style={{ display: 'inline' }}
              onClick={toggleFollow}
              className={`ml-2 ${isFollowing? 'bg-orange-500' : ' bg-pink-500' } text-white rounded-lg px-2`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
    );
};

export default UserTag;
