import React from 'react'
import { useState , useEffect} from 'react';
import PostDisplay from '../components/PostDisplay';
import { useSession } from '../context/SessionContext';
import axios from 'axios';
import './AllPosts.css'
import {Link} from 'react-router-dom'

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const {session}= useSession();
    
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
    
    useEffect(() => {
        
        
      const fetchPosts = async () => {
          if (!session) {
              console.log('No session available');
              return;
          }

          console.log(session.token);
          try {
              const response = await axios.get('http://localhost:8000/posts/all', {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                      'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
                  }
              });
              console.log(response.data);
              const reversedPosts = response.data.reverse();
              setPosts(reversedPosts);
              
          } catch (err) {
              console.log(err);
          }
      };

      fetchPosts();
  }, [session]);
    
  //return (
    // <>
    
    
    // {posts && 
    // <>
    // <div>
    //     {session && session.role === "influencer" && (

    //             <div>
    //             <Link to="/posts" className="bg-pink-500 text-white px-4 py-2 rounded-lg">Create post</Link>
    //             </div>
    //         )}
            
        
    //     <div className='allposts'>
    //     {posts.map((p)=>{
    //         return <PostDisplay key={p.id} post={p} updateFollow={updateFollow} updateLike={updateLike}/>
    //     })}
    //     </div>

    // </>
    //     }
    //     </div>
      
    // </>

    return (
        <div className="flex flex-col bg-pink-50 shadow-2xl">
        <div className="allposts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 overflow-y-auto">
          {posts.map((p) => (
            <PostDisplay key={p.id} post={p} updateFollow={updateFollow} updateLike={updateLike} />
          ))}
        </div>
      
        {session && session.role === "influencer" && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
            <Link to="/createpost" className="bg-orange-500 hover:bg-pink-500 text-white px-4 py-3 rounded-full">
              +
            </Link>
          </div>
        )}
      </div>
    );
    
    
    
  
}
