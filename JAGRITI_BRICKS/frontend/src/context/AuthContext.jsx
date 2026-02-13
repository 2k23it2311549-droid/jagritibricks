import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setLoading(false);

            // Verify token is still valid
            api.get('/auth/me')
                .then(({ data }) => {
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                })
                .catch(() => {
                    // Token invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const signIn = async ({ email, password }) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            // Save token and user
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);

            return { data, error: null };
        } catch (error) {
            console.error('Login error:', error);
            return { data: null, error: error.response?.data || error };
        }
    };

    const signUp = async ({ name, email, password, phone }) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, phone });

            // Save token and user
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);

            return { data, error: null };
        } catch (error) {
            console.error('Signup error:', error);
            return { data: null, error: error.response?.data || error };
        }
    };

    const signOut = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        signUp,
        signIn,
        signOut,
        user,
        session: user ? { user } : null,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Loading JagritiBricks...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
