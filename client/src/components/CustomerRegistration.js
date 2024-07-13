import axios from 'axios';
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'; 
import { useSession } from '../context/SessionContext';



function CustomerRegistration()
{
    console.log('CustomerRegistration component rendered');


    
    const { saveSession } = useSession();
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[bio, setBio] = useState('');
    const[age, setAge] = useState('');
    const [error, setError] = useState(null); 
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); 
    
    
    const handleRegistration = async(e) => {
        e.preventDefault();

        if (!username || !password || !bio || !age) {
            setError('All fields are required');
            return;
        }
        try{
            console.log('Making axios request...');
            const response = await axios.post( 'http://localhost:8000/register/customer',{
                username,
                password,
                bio,
                age
            }, {withCredentials : true});
            console.log('Registration response:', response.data.user);
            console.log(response.data);
            setSuccessMessage(response.data.message);
            saveSession(response.data.user);
      
            
            setError(null); 
            navigate('/posts'); 
        }catch(error){
            console.log('Axios request failed', error);
            setError(error.response?.data?.message || 'Failed to register'); 
            setSuccessMessage('');
            console.error('Registration error:', error);
            
        }
    
    };
    
    return (
        <div className="flex rounded-3xl mx-48 mt-16">
                
            <div className = "bg-pink-100 rounded-l-3xl  w-2/5 h-[550px]">
            <form onSubmit={handleRegistration}>
                <input 
                onChange={(e) => setUsername(e.target.value)}
                type = 'text'
                placeholder = 'username'
                name = 'username'
                id = 'username'
                className = "md:ml-16 bg-pink-500 rounded-xl w-48 py-2 px-2 border-none outline-none md:mt-24 placeholder-white"
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
                className = "md:ml-16 bg-pink-500 rounded-xl w-48 py-2 px-2 border-none outline-none md:mt-7 placeholder-white"
                spellcheck="false"
                value = {password}
                required
    
                />
                <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className = "md:ml-16 bg-pink-500 rounded-xl placeholder-white py-2 px-2 w-48 border-none outline-none md:mt-7" required />
                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className = "md:ml-16 w-48 rounded-xl bg-pink-500 py-2 px-2 border-none outline-none md:mt-7 placeholder-white" required />
                <div className = "text-red-600 ml-16 text-sm">{error}</div>
                <div className = "text-green-600 ml-16 text-sm">{successMessage}</div>
                <button type="submit" className="text-white text-lg bg-orange-500 md:px-5 md:py-2 md:ml-24   md:mt-16 rounded-xl ">
                    Register
                </button>
    
                <p class="md:ml-14 text-sm md:mt-2 ">
                Already have an account?
                <Link
                    class="font-semibold text-orange-500 transition-all duration-200"
                    to="/customerlogin"
                    >Login</Link>
                </p>
                
                
            </form>
    
    
        </div>
        <div className="w-3/5"  >
         <img src="/resources/registrationwallpaper.jpg" className="h-[550px]  "></img>

        </div>
        
            
        </div>
    );
}

export default CustomerRegistration;