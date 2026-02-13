import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Helmet } from 'react-helmet-async'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn, signOut, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(location.state?.from?.pathname || '/')
        }
    }, [user, navigate, location])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Convert any username format to safe email behind the scenes
            const displayName = username.trim()
            const safeUsername = displayName
                .toLowerCase()
                .replace(/\s+/g, '') // Remove all spaces
                .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric

            if (!safeUsername) throw new Error("Username is required")

            const email = `${safeUsername}@jagritibricks.com`
            const { data, error } = await signIn({ email, password })
            if (error) throw error

            // Admin check
            if (data?.user?.user_metadata?.role === 'admin') {
                await signOut()
                throw new Error('Administrator accounts restricted. Please use the Admin Portal.')
            }

            // Navigation handled by useEffect or here
            navigate('/')
        } catch (error) {
            console.error(error)

            // Enhanced error messages
            if (error.message === 'Invalid login credentials') {
                setError('Invalid username or password. Please check your credentials and try again.')
            } else if (error.message.includes('Email not confirmed')) {
                setError('Please verify your email address before logging in.')
            } else if (error.message.includes('Admin')) {
                setError(error.message)
            } else {
                setError(error.message || 'Login failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <Helmet>
                <title>Login - JagritiBricks</title>
            </Helmet>

            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-red/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <Link to="/" className="absolute top-8 left-8 z-10 text-gray-600 hover:text-brand-red flex items-center gap-2 transition-colors group">
                <div className="bg-white/80 p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </div>
                <span className="font-medium font-serif">Back to Home</span>
            </Link>

            <div className="max-w-md w-full glass rounded-3xl shadow-2xl p-8 transform transition-all duration-500 animate-fadeIn relative z-10 border border-white/40">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-red to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/20 transform hover:scale-105 transition-transform duration-300">
                        <span className="text-4xl filter drop-shadow-md">🧱</span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 font-medium">Sign in to manage your orders & account</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl animate-shake">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-bold">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    autoFocus
                                    className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-xl leading-5 bg-white/60 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red focus:bg-white transition-all duration-200 shadow-sm"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-10 pr-12 py-3.5 border border-gray-200 rounded-xl leading-5 bg-white/60 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red focus:bg-white transition-all duration-200 shadow-sm"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <div className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                                        {showPassword ? (
                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Signing In...</span>
                            </div>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-bold text-brand-red hover:text-red-700 transition-colors inline-block hover:scale-105 transform">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
