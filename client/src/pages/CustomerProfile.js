import React, { useEffect, useState } from 'react'
import { useSession } from '../context/SessionContext'
import axios from 'axios'
import { BsPerson } from "react-icons/bs";
import PostDisplay from '../components/PostDisplay';

export default function CustomerProfile() {
    const [likedPosts, setLikedPosts]=useState([]);
    const [activeTab, setActiveTab] = useState('created'); // 'created' or 'liked'

    const [following, setFollowing]=useState(0)
    const {session}=useSession()

    const toggleTab = (tab) => {
        setActiveTab(tab);
    };
    const updateFollow = (creator, isFollowing) => {
        setLikedPosts(prevPosts =>
            prevPosts.map(p =>
                p.creator === creator ? { ...p, isFollowed: !isFollowing } : p
            )
        );
    };
    
    const updateLike = (id, liked, likes) => {
        setLikedPosts(prevPosts =>
            prevPosts.map(p =>
                p.id === id ? { ...p, liked, likes } : p
            )
        );
    };

    useEffect(()=>{
        const fetchLikedPosts=async()=>{
            
            if (!session){
                console.log('no session available')
                return
            }
            console.log(session.token)
            try {
                const response = await axios.get('http://localhost:8000/profile/cprofile', {
                    headers: {
                        'Content-Type': 'multipart/formdata',
                        'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
                    }
                });
                console.log(response.data);
                setLikedPosts(response.data.liked);
                setFollowing(response.data.following.low)
            } catch (err) {
                console.log(err);
            }
        }

        fetchLikedPosts();
    },[session])
  return (
    <div className="p-6">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                {/* Left side */}
                <div className="flex items-center mb-4 lg:mb-5 ml-20 mt-3">
                    <div className="mr-4">
                        <BsPerson size={32} color="#4A90E2" /> 
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{session.username}</h1>
                        <p className="text-gray-600">{session.bio}</p>
                        <p className="text-gray-600">Age: {session.age}</p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:w-1/3">
                    <div className="text-center">
                        <div className="text-xl font-bold">{following}</div>
                        <div className="text-gray-600">Following</div>
                    </div>
                </div>
            </div>

    <h2 className="text-xl font-semibold text-orange-500 mb-4">Liked Posts</h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {likedPosts.map((p) => (
            <PostDisplay post={p} key={p.id} updateFollow={updateFollow} updateLike={updateLike}/>
        ))}
    </div>
</div>

    );
}
