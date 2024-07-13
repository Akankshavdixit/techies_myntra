import React, { useEffect, useState } from 'react'
import { useSession } from '../context/SessionContext'
import axios from 'axios'
import PostDisplay from '../components/PostDisplay';
import { BsPerson } from "react-icons/bs";
import { useParams } from 'react-router-dom';

export default function InfluencerAccount() {
    const {iname}=useParams()
    const {session}=useSession()
    const [posts, setPosts]=useState()
    const [influencer, setInfluencer]=useState()
    const [follows,setFollows]=useState()

    const updateFollow = (creator, isFollowing) => {
        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.creator === creator ? { ...p, isFollowed: !isFollowing } : p
            )
        );
    };
    
    const updateLike = (id, liked, likes) => {
        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.id === id ? { ...p, liked, likes } : p
            )
        );
    };
    const toggleFollow = async () => {
        try {
            let url = follows ? `http://localhost:8000/posts/unfollow/${iname}` : `http://localhost:8000/posts/follow/${iname}`;
            const response = await axios.post(url, null, {
                headers: {
                    'Authorization': `Bearer ${session.token}`,
                },
            });

            if (response.status === 200) {
                
                updateFollow(iname, follows);
                setFollows(!follows)
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(()=>{
        const fetchInfluencerAccount=async()=>{
            
            if (!session){
                console.log('no session available')
                return
            }
            console.log(session.token)
            try {
                const response = await axios.get(`http://localhost:8000/profile/iaccount/${iname}`, {
                    headers: {
                        'Content-Type': 'multipart/formdata',
                        'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
                    }
                });
                const result = response.data
                console.log(response.data)
                setPosts(result.posts)
                setInfluencer(result.influencer)
                setFollows(result.follows)
            } catch (err) {
                console.log(err);
            }
        }

        fetchInfluencerAccount();
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
                        <h1 className="text-2xl font-bold mb-1">{influencer && influencer.username}</h1>
                        <p className="text-gray-600">{influencer && influencer.bio}</p>
                        <p className="text-gray-600">Age: {influencer && influencer.age}</p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:w-1/3">
                    <div className="text-center mb-2 lg:mb-0 lg:mr-4">
                        <div className="text-xl font-bold">{influencer && influencer.followers.low}</div>
                        <div className="text-gray-600">Followers</div>
                    </div>
                    <div onClick={()=>{console.log(1);toggleFollow()}} className="text-center ml-5 mb-2 lg:mb-0 lg:mr-4">
                        <div  className={`mr-4 py-2 px-4 rounded-lg focus:outline-none ${follows?  'bg-pink-500' : 'bg-gray-800' } text-white`}>{follows? "Unfollow":"Follow"}</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-6">
                <button
                    className={`mr-4 py-2 px-4 rounded-lg focus:outline-none bg-pink-500 text-white `}>
                    Posts
                </button>
            
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {posts && posts.map((p) => (
                    <PostDisplay post={p} key={p.id} updateFollow={updateFollow} updateLike={updateLike} />
                ))}
            </div>
        </div>
    );
}
