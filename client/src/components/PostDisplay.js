// src/components/PostDisplay.js

import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './PostDisplay.css'; // Create this CSS file for additional styling
import axios from 'axios';

const PostDisplay = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes.low);
    console.log(post.likes.low)
    
    console.log(post)
    useEffect(() => {
        const updateLikeStatus = async () => {
          try {
            if (liked) {
                setLikes(likes+1)
              const response = await axios.post(`http://localhost:8080/add-like/${post.id}`, {}, {
                headers: {
                  'Content-Type': 'application/json',
                  // 'Authorization': `Bearer ${token}` // Include the JWT token in the header
                }
              });
              setLikes(response.data.likes); // Update likes count
            } else {
                setLikes(likes-1)
              const response = await axios.post(`http://localhost:8080/remove-like/${post.id}`, {}, {
                headers: {
                  'Content-Type': 'application/json',
                  // 'Authorization': `Bearer ${token}` // Include the JWT token in the header
                }
              });
              setLikes(response.data.likes); // Update likes count
            }
          } catch (error) {
            console.error('Failed to update like:', error);
            // Handle error (e.g., show error message to user)
          }
        };
    
        updateLikeStatus(); // Call the async function immediately
    
      }, [liked])
    
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
        setLiked(!liked)
      }}>{liked ? 'Unlike' : 'Like'} </button>
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
};

export default PostDisplay;
