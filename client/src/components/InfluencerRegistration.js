import axios from 'axios';
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'; 
import { useSession } from '../context/SessionContext';



function InfluencerRegistration()
{
    console.log('InfluencerRegistration component rendered');


    
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
            const response = await axios.post( 'http://localhost:8000/register/influencer',{
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
            navigate('/createpost'); 
        }catch(error){
            console.log('Axios request failed', error);
            setError(error.response?.data?.message || 'Failed to register'); 
            setSuccessMessage('');
            console.error('Registration error:', error);
            
        }
    
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen rounded-3xl mx-48">
                
            <div className = "bg-pink-100 rounded-l-3xl  w-2/5 h-[550px]">
            <form onSubmit={handleRegistration} className=' flex flex-col justify-center items-center'>
                <input 
                onChange={(e) => setUsername(e.target.value)}
                type = 'text'
                placeholder = 'username'
                name = 'username'
                id = 'username'
                className = " rounded-xl w-64 py-2 px-2 border-none outline-none md:mt-24 placeholder-grey"
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
                className = "rounded-xl  w-64 py-2 px-2 border-none outline-none md:mt-7 placeholder-grey"
                spellcheck="false"
                value = {password}
                required
    
                />
                <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className = " py-2 px-2 w-64 border-none rounded-xl outline-none md:mt-7 resize-none placeholder-grey" required />
                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className = "w-64  py-2 px-2 rounded-xl border-none outline-none md:mt-7 placeholder-grey" required />
                <div className = "text-red-600  text-sm">{error}</div>
                <div className = "text-green-600  text-sm">{successMessage}</div>
                <button type="submit" className="text-white text-lg bg-orange-500 md:px-5 md:py-2  md:mt-16 rounded-xl ">
                    Register
                </button>
    
                <p class=" text-sm md:mt-2 ">
                Already have an account?
                <Link
                    class="font-semibold text-orange-500 transition-all duration-200"
                    to="/influencerlogin"
                    > Login</Link>
                </p>
            </form>
    
        </div>
        <div className="w-3/5 "  >
         <img src="/resources/registrationwallpaper.jpg" className="h-[550px] rounded-r-3xl "></img>

        </div>
        
            
        </div>
    );
}

export default InfluencerRegistration;