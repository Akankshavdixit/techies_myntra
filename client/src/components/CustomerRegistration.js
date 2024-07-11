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
            navigate('/carousel'); 
        }catch(error){
            console.log('Axios request failed', error);
            setError(error.response?.data?.message || 'Failed to register'); 
            setSuccessMessage('');
            console.error('Registration error:', error);
            
        }
    
    };
    
    return (
        <div className="flex gap-6 rounded-3xl mx-48 mt-16">
                
            <div className = "bg-white w-1/2 h-[500px]">
            <form onSubmit={handleRegistration}>
                <input 
                onChange={(e) => setUsername(e.target.value)}
                type = 'text'
                placeholder = 'username'
                name = 'username'
                id = 'username'
                className = "md:ml-24 bg-gray-100 py-2 px-2 border-none outline-none md:mt-28"
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
                className = "md:ml-24 bg-gray-100 py-2 px-2 border-none outline-none md:mt-7"
                spellcheck="false"
                value = {password}
                required
    
                />
                <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className = "md:ml-24 bg-gray-100 py-2 px-2 border-none outline-none md:mt-7" required />
                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className = "md:ml-24 bg-gray-100 py-2 px-2 border-none outline-none md:mt-7" required />
                <div className = "text-red-600 ml-24 text-sm">{error}</div>
                <div className = "text-green-600 ml-24 text-sm">{successMessage}</div>
                <button type="submit" className="text-white text-lg bg-orange-600 md:px-5 md:py-2 md:ml-36 md:mt-16 rounded-xl ">
                    Register
                </button>
    
                <p class="md:ml-24 md:mt-12 ">
                Already have an account?
                <Link
                    class="font-semibold text-orange-600 transition-all duration-200"
                    to="/signin"
                    >Login</Link>
                </p>
                
                
            </form>
    
    
        </div>
        
            
        </div>
    );
}

export default CustomerRegistration;