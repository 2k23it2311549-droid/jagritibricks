import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log("AuthProvider: Initializing...")

        // Timeout fallback - ensure we don't hang forever
        const timeout = setTimeout(() => {
            console.warn("AuthProvider: Session check timed out after 5s")
            setLoading(false)
        }, 5000)

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            clearTimeout(timeout)
            console.log("AuthProvider: Session check complete", session ? "Session found" : "No session")
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }).catch((err) => {
            clearTimeout(timeout)
            console.error("Session check failed:", err)
            setLoading(false)
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("AuthProvider: Auth state change:", _event)
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => {
            clearTimeout(timeout)
            subscription.unsubscribe()
        }
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
    )
}
