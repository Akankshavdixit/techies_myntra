import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from '../context/SessionContext';
import PostDisplay from './PostDisplay';
import Loading from '../pages/Loading';

const RecommendedPosts = () => {
    const {session}=useSession()  // State to store user_id
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading]=useState(true)

    const updateLike = (id, liked, likes) => {
        setRecommendations(prevPosts =>
            prevPosts.map(p =>
                p.id === id ? { ...p, liked, likes } : p
            )
        );
    }; 
    const updateFollow = (creator, isFollowing) => {
        setRecommendations(prevPosts =>
            prevPosts.map(p =>
                p.creator === creator ? { ...p, isFollowed: !isFollowing } : p
            )
        );
    };
    useEffect(() => {
        
        // const fetchRecommendations = async () => {
        //     if (!session){
        //         alert("No user Session found!")
        //         return
        //     }
        //     try {
        //         const response = await axios.get(`http://127.0.0.1:5000/recommend`, {
        //             params: {
        //                 user_id: session.username,
        //                 num_recommendations: 12
        //             }
        //         });
        //         console.log(response.data)
        //         setRecommendations(response.data.recommendations);
        //         setIsLoading(false)
        //     } catch (error) {
        //         console.error('Error fetching recommendations:', error);
        //     }
        // };
        const fetchRecommendations = async () => {
            if (!session){
                alert("No user Session found!")
                return
            }
            try {
                const response = await axios.get(`http://localhost:8000/rec/posts`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
                    }
                });
                console.log(response.data)
                setRecommendations(response.data.recommendations);
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        
        fetchRecommendations();
        
    }, [session]);  // Run effect when user_id changes


    return (
        
        <div>
            {isLoading? <Loading/>:(<div className="allposts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 overflow-y-auto">
          {recommendations && recommendations.map((p) => (
            <PostDisplay key={p.id} post={p} updateFollow={updateFollow} updateLike={updateLike} />
          ))}
          {!recommendations && <div>No Recommendations</div>}
        </div>)}
            
            
        </div>
    );
};

export default RecommendedPosts;
