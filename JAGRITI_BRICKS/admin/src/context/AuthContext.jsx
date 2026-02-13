import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const savedUser = localStorage.getItem('adminUser');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setLoading(false);

            api.get('/auth/me')
                .then(({ data }) => {
                    // Check if user is admin
                    if (data.user.role !== 'admin') {
                        throw new Error('Not authorized');
                    }
                    setUser(data.user);
                    localStorage.setItem('adminUser', JSON.stringify(data.user));
                })
                .catch(() => {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
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

            // Check if user is admin
            if (data.user.role !== 'admin') {
                return { data: null, error: { message: 'Access denied. Admin only.' } };
            }

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            setUser(data.user);

            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.response?.data || error };
        }
    };

    const signOut = async () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, user, session: user ? { user } : null, loading }}>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white font-medium">Loading Admin Panel...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
