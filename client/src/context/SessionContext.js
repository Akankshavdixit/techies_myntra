import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SessionContext = createContext(null);

export const useSession = () => {
    return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const saveSession = (sessionData) => {
        setSession(sessionData);
        localStorage.setItem('session', JSON.stringify(sessionData));
    };

    const loadSession = async () => {
        const storedSession = localStorage.getItem('session');
        if (storedSession) {
            setSession(JSON.parse(storedSession));
            setLoading(false); // Set loading to false once session is loaded
        } else {
            try {
                const response = await axios.get('/api/user/me', { withCredentials: true });
                setSession(response.data);
                setLoading(false); // Set loading to false once session is loaded
            } catch (error) {
                console.error('Failed to load session:', error);
                setLoading(false); // Ensure loading is still set to false on error
            }
        }
    };

    useEffect(() => {
        loadSession();
    }, []);

    

    return (
        <SessionContext.Provider value={{ session, saveSession }}>
            {children}
        </SessionContext.Provider>
    );
};
