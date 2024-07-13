
import React, { useState } from "react";
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom'; 
import { useSession } from '../context/SessionContext';


function CustomerLogin()
{
    console.log('CustomerLogin component rendered');
    const {saveSession} = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();

        try{
            console.log('Making axios request...');
            const response = await axios.post('http://localhost:8000/login/customer',{
                username,
                password
            }, {withCredentials: true});
            setSuccessMessage(response.data.message);
            saveSession(response.data.user);
      
            
            setError(null); 
            navigate('/posts');

        }catch(error){
            console.log('Axios request failed', error);
            setError(error.response?.data?.message || 'Failed to login'); 
            setSuccessMessage('');
            console.error('Login error:', error);

        }
    };


    return (
        <div className="flex rounded-3xl mx-48 mt-16">
            
            <div className = "bg-purple-300 w-2/5 h-[500px]">
            <form onSubmit={handleLogin}>
                <input 
                onChange={(e) => setUsername(e.target.value)}
                type = 'text'
                placeholder = 'username'
                name = 'username'
                id = 'username'
                className = "md:ml-16 bg-purple-200 rounded-xl py-2 px-2 border-none outline-none md:mt-28"
                spellcheck="false"
                value = {username}
                required
    
                 />
                <input 
                onChange={(e) => setPassword(e.target.value)}
                type = 'password'
                placeholder = 'password'
                name = 'password'
                id = 'password'
                className = "md:ml-16 bg-purple-200 rounded-xl py-2 px-2 border-none outline-none md:mt-7"
                spellcheck="false"
                value = {password}
                required
    
                />
                <div className = "text-red-600 ml-16 text-sm">{error}</div>
                
                <button type="submit" className="text-white text-lg bg-purple-600 md:px-5 md:py-2 md:ml-28 md:mt-16 rounded-xl ">
                    SignIn
                </button>

                <p class="md:ml-16 text-sm md:mt-4 ">
                Don't have an account?
                <Link
                    class="font-semibold text-purple-600 transition-all duration-200"
                    to="/customerregistration"
                    >register</Link>
                </p>
                
                
            </form>


        </div>

        <div className="w-3/5"  >
         <img src="/resources/registrationwallpaper.jpg" className="h-[500px] rounded-r-3xl  "></img>

        </div>
        
            
        </div>
   

    );
    
    
}

export default CustomerLogin;