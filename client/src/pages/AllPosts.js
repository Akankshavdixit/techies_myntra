import React from 'react'
import { useState , useEffect} from 'react';
import PostDisplay from '../components/PostDisplay';
import { useSession } from '../context/SessionContext';
import CreatePost from '../components/CreatePost';
import axios from 'axios';


export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const {session}= useSession();
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
        posts.map((p)=>{
            return <PostDisplay key={p.id} post={p}/>
        })
        }
      <CreatePost/>
    </>
  )
}
