// src/components/PostDisplay.js

import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './PostDisplay.css'; // Create this CSS file for additional styling
import axios from 'axios';
import { useSession } from '../context/SessionContext';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { BsBagHeartFill } from "react-icons/bs";

const PostDisplay = ({ post, updateFollow, updateLike }) => {
    const [liked, setLiked] = useState(post.liked);
    const {session}=useSession();
    const [likes,setLikes]=useState(post.likes)
    console.log(post)
    // const [followers, setFollowers] = useState(post.followers);
    const [isFollowing, setIsFollowing] = useState(post.isFollowed)
    useEffect(() => {
      setLiked(post.liked);
      setLikes(post.likes);
      setIsFollowing(post.isFollowed);
  }, [post]);
    const toggleFollow = async () => {
        try {
            let url = isFollowing ? `http://localhost:8000/posts/unfollow/${post.creator}` : `http://localhost:8000/posts/follow/${post.creator}`;
            const response = await axios.post(url, null, {
                headers: {
                    'Authorization': `Bearer ${session.token}`,
                },
            });

            if (response.status === 200) {
                
                updateFollow(post.creator, isFollowing);
                setIsFollowing(!isFollowing)
            }
        } catch (err) {
            console.error(err);
        }
    };

   
    const toggleLike = async () => {
        
        console.log(session)
        try{
          const newLiked = !liked;
          const newLikes = newLiked ? likes + 1 : likes - 1;

          setLikes(newLikes);
          setLiked(newLiked);
          if (session){
            console.log(session.token)
          let url = liked ? 'http://localhost:8000/posts/remove-like' : 'http://localhost:8000/posts/add-like';
          url = url +'/'+post.id
          console.log(url)
          const response = await axios.post(url,null,{
            headers: {
              // 'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
          }
          });  
          updateLike(post.id, newLiked, newLikes);  
        }}catch(err){
          setLikes(liked ? likes + 1 : likes - 1);
          setLiked(!liked);
          
          console.log(err)
        }
    };
    
  return (
    <div className="post-container">
      <Carousel showThumbs={false} >
        {post.imageUrls && post.imageUrls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Post Image ${index + 1}`} />
          </div>
        ))}
      </Carousel>
      <button onClick={(e)=>{
        toggleLike()
      }}>{liked ? <GoHeartFill  size={20} className='m-2' color='red'/> : <GoHeart size={20} className='m-2'/>} </button>
      <p>Likes: {likes}</p>
      <p style={{display: 'inline'}}>@{post.creator}  </p>
      {(post.creator != session.username) &&
      <button onClick={toggleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
      }
      {/* <p>Followers: {followers}</p> */}
      <div className="post-description">
        <p>{post.description}</p>
      </div>
      <h3 className="text-sm font-bold mb-1">Product Links:  </h3>
      <div className="post-product-links mb-2">
            <br />
            {post.productLinks && post.productLinks.map((link, index) => {
                const productName = link.match(/\/([^\/]+)\/\d+\/buy$/)[1];
                return (
                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center mb-1 mr-4">
                        <BsBagHeartFill size={20} color='#ec4899' className="mr-2" />
                        <span className="truncate">{productName}</span>
                    </a>
                );
            })}
        </div>
      
    </div>
  );

}
export default PostDisplay;
