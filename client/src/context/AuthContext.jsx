import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (data) => {
        try {
            const result = await supabase.auth.signInWithPassword(data)
            if (result.error) throw result.error
            return result
        } catch (error) {
            console.error("Login error:", error.message)
            return { error }
        }
    }

    const signOut = async () => {
        try {
            await supabase.auth.signOut()
            setSession(null)
            setUser(null)
        } catch (error) {
            console.error("Logout error:", error.message)
        }
    }

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn,
        signOut,
        user,
        session,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
