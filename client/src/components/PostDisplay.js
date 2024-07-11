// src/components/PostDisplay.js

import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './PostDisplay.css'; // Create this CSS file for additional styling
import axios from 'axios';
import { useSession } from '../context/SessionContext';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";

const PostDisplay = ({ post }) => {
    const [liked, setLiked] = useState(post.liked);
    const {session}=useSession();
    const [likes,setLikes]=useState(post.likes)
    console.log(post.id)
    const toggleLike = async () => {
        
        console.log(session)
        try{
          if (liked){
            setLikes(likes-1)
          }
          else{
            setLikes(likes+1)
          }
          setLiked(!liked);
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
        }}catch(err){
          if (liked){
            setLikes(likes-1)
          }
          else{
            setLikes(likes+1)
          }
          setLiked(!liked);
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
      }}>{liked ? <GoHeartFill color='red'/> : <GoHeart/>} </button>
      <p>Likes: {likes}</p>
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
