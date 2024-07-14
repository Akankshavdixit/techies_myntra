import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SessionContext = createContext(null);

export const useSession = () => {
    return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    

    const saveSession = (sessionData) => {
        setSession(sessionData);
        localStorage.setItem('session', JSON.stringify(sessionData));
    };

    const logout = () => {
        setSession(null); // Clear session state
        localStorage.removeItem('session'); // Clear session from localStorage
        // You may also want to make an API call to logout on the server-side if required
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

