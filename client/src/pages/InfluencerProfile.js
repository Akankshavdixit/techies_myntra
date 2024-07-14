import React, { useEffect, useState } from 'react'
import { useSession } from '../context/SessionContext'
import axios from 'axios'
import PostDisplay from '../components/PostDisplay';
import { BsPerson } from "react-icons/bs";
import Navbar from '../components/Navbar';
import Loading from './Loading';
import Layout from './Layout';

export default function InfluencerProfile() {
    const {session}=useSession()
    const [likedPosts, setLikedPosts]=useState([]);
    const [myPosts, setMyPosts]=useState([])
    const [isLoading, setIsLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('created'); // 'created' or 'liked'
    const [numberOfFollowing, setNumberOfFollowing]=useState(0)
    const [person,setPerson]=useState(null)

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
                setNumberOfFollowing(response.data.numberofFollowing)
                setPerson(response.data.person)
                setIsLoading(false)
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
        <Layout>
        {isLoading? <Loading/>: (<div className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                {/* Left side */}
                <div className="flex items-center mb-4 lg:mb-5 ml-20 mt-3">
                    <div className="mr-4">
                        <BsPerson size={32} color="#4A90E2" /> 
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{session && session.username}</h1>
                        <p className="text-gray-600">{session && session.bio}</p>
                        <p className="text-gray-600">Age: {session && session.age}</p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:w-1/3">
                    <div className="text-center mb-2 lg:mb-0 lg:mr-4">
                        <div className="text-xl font-bold">{person && person.followers.low}</div>
                        <div className="text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold">{numberOfFollowing}</div>
                        <div className="text-gray-600">Following</div>
                    </div>
                </div>
            </div>

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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeTab === 'created' && myPosts.map((p) => (
                    <PostDisplay post={p} key={p.id} updateFollow={updateFollow} updateLike={updateLike} />
                ))}
                {activeTab === 'liked' && likedPosts.map((p) => (
                    <PostDisplay post={p} key={p.id} updateFollow={updateFollow} updateLike={updateLike} />
                ))}
            </div>
        </div>)}
        </Layout>
    );
}
