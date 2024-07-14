import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import { useSession } from '../context/SessionContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import UserTag from '../components/UserTag';
import RecommendedPosts from '../components/RecommendedPosts';

export default function MyFashion() {
    const [recs, setRecs] = useState([]);
    const {session}= useSession();
    const [isLoading, setIsLoading] = useState(true);
    
        
    useEffect(() => {
      const fetchRecommendations = async () => {
          if (!session) {
              console.log('No session available');
              return;
          }

          console.log(session.token);
          try {
              const response = await axios.get('http://localhost:8000/rec/influencers', {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
                  }
              });
              console.log(response.data);
              setRecs(response.data.recommendations);
              setIsLoading(false)
          } catch (err) {
              console.log(err);
          }
      };

      fetchRecommendations();
  }, [session]);
    
  return (
    <>
    <Navbar />
    {isLoading ? (
        <Loading />
    ) : (
        <div className="  px-4">
            <div className="mt-8 mb-8 ml-4">
                <h2 className="text-2xl font-bold mb-4  text-pink-600">Recommended Influencers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recs && recs.map(user => (
                        <UserTag key={user.username} username={user.username} />
                    ))}
                    {!recs && <div>No Recommendations</div>}
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 ml-4 text-pink-600">Recommended Posts</h2>
                <RecommendedPosts/>
            </div>
        </div>
    )}
</>

  )

}
