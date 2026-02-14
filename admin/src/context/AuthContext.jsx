import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('simple_admin_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const signIn = async ({ email, password }) => {
        try {
            // Normalize input
            const inputUser = email.toLowerCase().trim()

            // HARDCODED ADMIN CREDENTIALS
            // In a real app, use environment variables, but for this "Basic Login" request:
            const ADMIN_USER = 'admin'
            const ADMIN_PASS = 'admin123'

            if (inputUser === ADMIN_USER && password === ADMIN_PASS) {
                // Create a session-like user object
                const userObj = {
                    id: 'admin-hardcoded-id',
                    email: 'admin@local.host',
                    user_metadata: {
                        username: ADMIN_USER,
                        role: 'admin'
                    },
                    aud: 'authenticated',
                    role: 'admin',
                    created_at: new Date().toISOString()
                }

                localStorage.setItem('simple_admin_user', JSON.stringify(userObj))
                setUser(userObj)
                return { data: { user: userObj }, error: null }
            }

            return { error: { message: 'Invalid admin credentials' } }

        } catch (error) {
            return { error: { message: error.message } }
        }
    }

    const signOut = async () => {
        localStorage.removeItem('simple_admin_user')
        setUser(null)
        window.location.href = '/login' // Force redirect
    }

    const value = {
        signIn,
        signOut,
        user,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Loading Admin...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}
