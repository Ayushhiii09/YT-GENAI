import React, { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

// 1. Create the context
const AuthContext = createContext();

// 2. Define the Provider
const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await getMe();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error("Auth initialization failed:", err);
                setUser(null);
            } finally {
                // Guaranteed to run, removing any 'Grey Layer' or loading screen
                setLoading(false); 
            }
        };
        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Export separately for Vite compatibility
export { AuthContext, AuthProvider };