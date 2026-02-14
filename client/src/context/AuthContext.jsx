import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('simple_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const signUp = async ({ email, password, options }) => {
        try {
            // "email" here is actually "username@jagritibricks.com" or similar
            // We extract the username and other details
            const username = options.data.username
            const phone = options.data.phone
            // const displayName = options.data.display_name

            // Check if username exists
            const { data: existingUser } = await supabase
                .from('simple_users')
                .select('id')
                .eq('username', username)
                .single()

            if (existingUser) {
                return { error: { message: 'Username already taken' } }
            }

            // Create new user
            const { data, error } = await supabase
                .from('simple_users')
                .insert([
                    {
                        username,
                        password, // Storing password as provided (simple auth request)
                        phone,
                        role: 'user'
                    }
                ])
                .select()
                .single()

            if (error) return { error }

            return { data: { user: data }, error: null }
        } catch (error) {
            return { error: { message: error.message } }
        }
    }

    const signIn = async ({ email, password }) => {
        try {
            // Determine username from email if provided in that format
            let username = email
            if (email.includes('@')) {
                username = email.split('@')[0]
            }

            const { data, error } = await supabase
                .from('simple_users')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .single()

            if (error || !data) {
                return { error: { message: 'Invalid username or password' } }
            }

            // Create a session-like user object
            const userObj = {
                id: data.id,
                email: email, // Keep purely for compatibility
                user_metadata: {
                    username: data.username,
                    role: data.role,
                    phone: data.phone
                },
                aud: 'authenticated',
                created_at: data.created_at
            }

            localStorage.setItem('simple_user', JSON.stringify(userObj))
            setUser(userObj)

            return { data: { user: userObj }, error: null }
        } catch (error) {
            return { error: { message: error.message } }
        }
    }

    const signOut = async () => {
        localStorage.removeItem('simple_user')
        setUser(null)
        window.location.href = '/' // Force redirect
        return { error: null }
    }

    const value = {
        signUp,
        signIn,
        signOut,
        user,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
