import React from 'react'
import { useState , useEffect} from 'react';
import PostDisplay from '../components/PostDisplay';
import { useSession } from '../context/SessionContext';
import axios from 'axios';


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
              const response = await axios.get('http://localhost:8000/posts/explore', {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
                  }
              });
              console.log(response.data);
              setPosts(response.data);
          } catch (err) {
              console.log(err);
          }
      };

      fetchPosts();
  }, [session]);
    
  return (
    <>
    {posts && 
    <>
        <div className='allposts'>
        {posts.map((p)=>{
            return <PostDisplay key={p.id} post={p} updateFollow={updateFollow} updateLike={updateLike}/>
        })}
        </div>

    </>
        }
      
    </>
  )
}
