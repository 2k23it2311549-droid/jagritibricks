import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Helmet } from 'react-helmet-async'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Determine if input is email, mobile, or username
            let email = username.toLowerCase().trim()
            // AuthContext handles the username/email parsing logic now

            const { error } = await signIn({ email, password })

            if (error) throw error

            navigate('/dashboard')
        } catch (err) {
            console.error('Login error:', err)
            setError(err.message || 'Invalid credentials or server error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            <Helmet>
                <title>Admin Login - JagritiBricks</title>
            </Helmet>

            {/* Particle Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(232,82,63,0.1),transparent_70%)] animate-pulse-glow" />
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white opacity-10 animate-particle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 2}px`,
                            height: `${Math.random() * 10 + 2}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`
                        }}
                    />
                ))}
            </div>

            <div className="glass-dark border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 dora-reveal visible">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-brand-orange to-red-600 p-8 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/90 backdrop-blur rounded-full mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                        <span className="text-4xl animate-bounce-subtle">🧱</span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-white tracking-wide drop-shadow-md">JagritiBricks</h2>
                    <p className="text-red-100 mt-2 font-medium tracking-wider uppercase text-xs">Admin Command Center</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    {error && (
                        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6 rounded-r backdrop-blur-sm animate-shake">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-200">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="dora-input-focus group">
                            <label className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-brand-orange transition-colors">
                                Username, Mobile or Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500 group-focus-within:text-brand-orange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your credentials"
                                    required
                                />
                            </div>
                        </div>

                        <div className="dora-input-focus group">
                            <label className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-brand-orange transition-colors">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500 group-focus-within:text-brand-orange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 bg-gradient-to-r from-brand-orange to-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-orange-500/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center relative overflow-hidden ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            <span className="relative z-10 flex items-center">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Accessing System...
                                    </>
                                ) : (
                                    <>
                                        Admin Login
                                        <svg className="w-5 h-5 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <a href="http://localhost:5173" className="text-sm text-gray-400 hover:text-white font-medium transition flex items-center justify-center group">
                            <svg className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Store
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
