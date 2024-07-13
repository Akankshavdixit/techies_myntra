import React, { useEffect, useState } from 'react'
import { useSession } from '../context/SessionContext'
import axios from 'axios'

export default function CustomerProfile() {
    const [posts, setPosts]=useState([])
    const {session}=useSession()
    useEffect(()=>{
        const fetchLikedPosts=async()=>{
            
            if (!session){
                console.log('no session available')
                return
            }
            console.log(session.token)
            try {
                const response = await axios.get('http://localhost:8000/profile/cprofile', {
                    headers: {
                        'Content-Type': 'multipart/formdata',
                        'Authorization': `Bearer ${session.token}`, // Include the JWT token in the header
                    }
                });
                console.log(response.data);
                setPosts(response.data.liked);
            } catch (err) {
                console.log(err);
            }
        }

        fetchLikedPosts();
    },[session])
  return (
    <div>CustomerProfile</div>
  )
}
