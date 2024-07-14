import React from 'react'
import { useState , useEffect} from 'react';
import PostDisplay from '../components/PostDisplay';
import { useSession } from '../context/SessionContext';
import axios from 'axios';
import './AllPosts.css'
import Navbar from '../components/Navbar';
import Loading from './Loading';
import { FaSearch } from 'react-icons/fa';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const {session}= useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const updateFollow = (creator, isFollowing) => {
        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.creator === creator ? { ...p, isFollowed: !isFollowing } : p
            )
        );
    };
    const filteredPosts = posts.filter(post => {
        const tagsArray = JSON.parse(post.tags);
        return (
            post.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tagsArray.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });
    
    
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
              setIsLoading(false)
              
          } catch (err) {
              console.log(err);
          }
      };

      fetchPosts();
  }, [session]);
    

    return (
        
        <div className="flex flex-col bg-pink-50 shadow-2xl">
            <Navbar/>
            <div className="p-4 relative">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-10 rounded-md border border-pink-300 focus:outline-none focus:border-pink-500"
                />
                <FaSearch className="text-pink-500 absolute left-7 top-1/2 transform -translate-y-1/2" />
            </div>
            {isLoading? <Loading/>:( <div className="allposts grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 overflow-y-auto">
          {filteredPosts.map((p) => (
            <PostDisplay key={p.id} post={p} updateFollow={updateFollow} updateLike={updateLike} />
          ))}
        </div>)}
      </div>
    
    );
    
    
    
  
}
