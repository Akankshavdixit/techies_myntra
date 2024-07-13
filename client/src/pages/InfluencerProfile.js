import React, { useEffect, useState } from 'react'
import { useSession } from '../context/SessionContext'
import axios from 'axios'
import PostDisplay from '../components/PostDisplay';

export default function InfluencerProfile() {
    const [likedPosts, setLikedPosts]=useState([]);
    const [myPosts, setMyPosts]=useState([])
    const {session}=useSession()
    const [activeTab, setActiveTab] = useState('created'); // 'created' or 'liked'

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
                const response = await axios.get('http://localhost:8000/profile/iprofile', {
                    headers: {
                        'Content-Type': 'multipart/formdata',
                        'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
                    }
                });
                console.log(response.data);
                setLikedPosts(response.data.liked);
                setMyPosts(response.data.created);
            } catch (err) {
                console.log(err);
            }
        }

        fetchLikedPosts();
    },[session])
    const toggleTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Influencer Profile</h1>
            <div className="flex justify-center mb-6">
                <button
                    className={`mr-4 py-2 px-4 rounded-lg focus:outline-none ${activeTab === 'created' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => toggleTab('created')}
                >
                    Created Posts
                </button>
                <button
                    className={`py-2 px-4 rounded-lg focus:outline-none ${activeTab === 'liked' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => toggleTab('liked')}
                >
                    Liked Posts
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'created' && myPosts.map((p) => (
                    <PostDisplay post={p} key={p.id} updateFollow={updateFollow} updateLike={updateLike} />
                ))}
                {activeTab === 'liked' && likedPosts.map((p) => (
                    <PostDisplay post={p} key={p.id} updateFollow={updateFollow} updateLike={updateLike} />
                ))}
            </div>
        </div>
    );
}
