// src/components/PostDisplay.js

import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './PostDisplay.css'; 
import axios from 'axios';
import { useSession } from '../context/SessionContext';

const PostDisplay = ({ post }) => {
    const [liked, setLiked] = useState(post.liked);
    const {session}=useSession();
    const [likes,setLikes]=useState(post.likes)
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(post.followerCount);
    console.log(post.id);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/following/${post.influencerUsername}`, {
                    headers: {
                        'Authorization': `Bearer ${session.token}`
                    }
                });
                setIsFollowing(response.data.isFollowing);
            } catch (error) {
                console.error('Failed to check follow status', error);
            }
        };

        if (session) {
            checkFollowingStatus();
        }
    }, [session, post.influencerUsername]);

    const toggleFollow = async () => {
        try {
            if (session) {
                let url = isFollowing ? `http://localhost:8000/posts/unfollow/${post.influencerUsername}` : `http://localhost:8000/posts/follow/${post.influencerUsername}`;
                const response = await axios.post(url, null, {
                    headers: {
                        'Authorization': `Bearer ${session.token}`
                    }
                });
                if (response.status === 200) {
                    setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
                    setIsFollowing(!isFollowing);
                }
            }
        } catch (err) {
            console.error('Failed to toggle follow', err);
        }
    };

    const toggleLike = async () => {
        console.log(session)
        try{
          if (session){
            console.log(session.token)
          let url = liked ? 'http://localhost:8000/posts/remove-like' : 'http://localhost:8000/posts/add-like';
          url = url +'/'+post.id
          console.log(url)
          const response = await axios.post(url,null,{
            headers: {
                
              'Authorization': `Bearer ${session.token}`, 
          }
          });
          if (response.status === 200) {
              console.log(likes)
              if (liked){
                setLikes(likes-1)
              }
              else{
                setLikes(likes+1)
              }
              console.log(likes)
              setLiked(!liked);
              
              
        }}}catch(err){
          console.log(err)
        }
    };
    
  return (
    <div className="post-container">
      <Carousel showThumbs={false}>
        {post.imageUrls && post.imageUrls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Post Image ${index + 1}`} />
          </div>
        ))}
      </Carousel>
      <button onClick={(e)=>{
        toggleLike()
      }}>{liked ? 'Unlike' : 'Like'} </button>
      <p>Likes: {likes}</p>
      <button onClick={toggleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
      <p>Followers: {followerCount}</p>
      <div className="post-description">
        <p>{post.description}</p>
      </div>
      <div className="post-product-links">
        <h3>Product Links:</h3>
        <ul>
          {post.productLinks && post.productLinks.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

}


export default PostDisplay;
