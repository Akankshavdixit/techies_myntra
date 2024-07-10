// src/components/PostDisplay.js

import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './PostDisplay.css'; // Create this CSS file for additional styling
import axios from 'axios';
import { useSession } from '../context/SessionContext';

const PostDisplay = ({ post }) => {
    const [liked, setLiked] = useState(post.liked);
    const {session}=useSession();
    const [likes,setLikes]=useState(post.likes)
    console.log(post.id)
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
              // 'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
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


// import React, { useState, useEffect } from 'react';
// import { Carousel } from 'react-responsive-carousel';
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import axios from 'axios';
// import './PostDisplay.css';
// import { useSession } from '../context/SessionContext';


// const PostDisplay = ({ post }) => {
//     const { session } = useSession();
//     const [liked, setLiked] = useState(post.liked);
//     const [likes, setLikes] = useState(post.likes);
//     const [isFollowing, setIsFollowing] = useState(false);
//     const influencerUsername = localStorage.getItem('sessionUsername');

//     useEffect(() => {
//         // Check if current user is already following the influencer
//         if (session && post.influencer.username === session.username) {
//             setIsFollowing(true);
//         } else {
//             setIsFollowing(false);
//         }
//     }, [session, post.influencer.username]);

//     const toggleLike = async () => {
//         try {
//             let url = liked ? `http://localhost:8000/posts/remove-like/${post.id}` : `http://localhost:8000/posts/add-like/${post.id}`;
//             const response = await axios.post(url, null, {
//                 headers: {
//                     'Authorization': `Bearer ${session.token}`
//                 }
//             });
//             if (response.status === 200) {
//                 setLikes(liked ? likes - 1 : likes + 1);
//                 setLiked(!liked);
//             }
//         } catch (error) {
//             console.error('Error toggling like:', error);
//         }
//     };

//     const toggleFollow = async () => {
//         try {
//             let url = isFollowing ? `http://localhost:8000/users/unfollow/${post.influencer.username}` : `http://localhost:8000/users/follow/${post.influencer.username}`;
//             const response = await axios.post(url, null, {
//                 headers: {
//                     'Authorization': `Bearer ${session.token}`
//                 }
//             });
//             if (response.status === 200) {
//                 setIsFollowing(!isFollowing);
//                 setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
//             }
//         } catch (error) {
//             console.error('Error toggling follow:', error);
//         }
//     };

//     const toggleUnfollow = async () => {
//         try {
//             let url = `http://localhost:8000/users/unfollow/${post.influencer.username}`;
//             const response = await axios.post(url, null, {
//                 headers: {
//                     'Authorization': `Bearer ${session.token}`
//                 }
//             });
//             if (response.status === 200) {
//                 setIsFollowing(false);
//                 setFollowersCount(followersCount - 1);
//             }
//         } catch (error) {
//             console.error('Error toggling unfollow:', error);
//         }
//     };

//     return (
//         <div className="post-container">
//             <Carousel showThumbs={false}>
//                 {post.imageUrls && post.imageUrls.map((url, index) => (
//                     <div key={index}>
//                         <img src={url} alt={`Post Image ${index + 1}`} />
//                     </div>
//                 ))}
//             </Carousel>
//             <button onClick={toggleLike}>{liked ? 'Unlike' : 'Like'}</button>
//             <p>Likes: {likes}</p>
//             {isFollowing ?
//                 <button onClick={toggleUnfollow}>Unfollow</button> :
//                 <button onClick={toggleFollow}>Follow</button>
//             }
//             <p>Followers: {followersCount}</p>
//             <div className="post-description">
//                 <p>{post.description}</p>
//             </div>
//             <div className="post-product-links">
//                 <h3>Product Links:</h3>
//                 <ul>
//                     {post.productLinks && post.productLinks.map((link, index) => (
//                         <li key={index}>
//                             <a href={link} target="_blank" rel="noopener noreferrer">
//                                 {link}
//                             </a>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

//export default PostDisplay;

