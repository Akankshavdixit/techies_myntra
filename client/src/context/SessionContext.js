import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SessionContext = createContext(null);

export const useSession = () => {
    return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    

    const saveSession = (sessionData) => {
        console.log('saving session')
        setSession(sessionData);
        localStorage.setItem('session', JSON.stringify(sessionData));
    };

    const logout = async() => {
            setSession(null); // Clear session state
            localStorage.removeItem('session'); // Clear session from localStorage
            };

    const loadSession = async () => {
        const storedSession = localStorage.getItem('session');
        if (storedSession) {
            setSession(JSON.parse(storedSession));
           
        } else {
            try {
                const response = await axios.get('http://localhost:8000/api/user/me', { withCredentials: true });
                setSession(response.data);
                saveSession(response.data)
                
            } catch (error) {
                console.error('Failed to load session:', error);
                
        }
    }
};

    useEffect(() => {
        loadSession();
    }, []);

    

    return (
        <SessionContext.Provider value={{ session, saveSession, logout }}>
            {children}
        </SessionContext.Provider>
    );
}

