import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Helmet } from 'react-helmet-async'
import Toast from '../components/Toast'

export default function Signup() {
    const [username, setUsername] = useState('')
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const { signUp } = useAuth()
    const navigate = useNavigate()

    // Password strength calculation
    const calculatePasswordStrength = (pwd) => {
        if (!pwd) return { strength: 0, label: '', color: '' }

        let strength = 0
        if (pwd.length >= 8) strength++
        if (pwd.length >= 12) strength++
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
        if (/\d/.test(pwd)) strength++
        if (/[^a-zA-Z0-9]/.test(pwd)) strength++

        if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' }
        if (strength <= 3) return { strength: 2, label: 'Medium', color: 'bg-yellow-500' }
        return { strength: 3, label: 'Strong', color: 'bg-green-500' }
    }

    const passwordStrength = calculatePasswordStrength(password)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Validation
        if (mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number')
            setLoading(false)
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (!acceptTerms) {
            setError('Please accept the terms and conditions')
            setLoading(false)
            return
        }

        try {
            // Accept any username format and convert to safe email behind the scenes
            const displayName = username.trim()
            const safeUsername = displayName
                .toLowerCase()
                .replace(/\s+/g, '') // Remove all spaces
                .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric characters

            if (!safeUsername) {
                throw new Error('Please enter a valid username')
            }

            const email = `${safeUsername}@jagritibricks.com`

            const { error } = await signUp({
                email,
                password,
                options: {
                    data: {
                        phone: mobile,
                        username: safeUsername,
                        display_name: displayName // Store original username for display
                    }
                }
            })

            if (error) throw error

            setToast({ message: '🎉 Registration successful! Please login to continue.', type: 'success' })
            setTimeout(() => navigate('/login'), 2000)
        } catch (error) {
            console.error(error)
            if (error.message.includes('already registered')) {
                setError('This username is already taken. Please choose another.')
            } else {
                setError(error.message || 'Registration failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <Helmet>
                <title>Sign Up - JagritiBricks</title>
            </Helmet>

            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-brand-red/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
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
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 tracking-tight">Create Account</h2>
                    <p className="text-gray-500 font-medium">Join JagritiBricks and start building</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
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

                    <div className="space-y-4">
                        {/* Username Input */}
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

                        {/* Mobile Input */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    required
                                    pattern="[0-9]{10}"
                                    className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-xl leading-5 bg-white/60 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red focus:bg-white transition-all duration-200 shadow-sm"
                                    placeholder="10-digit mobile number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                            </div>
                            {mobile && mobile.length !== 10 && (
                                <p className="mt-1 text-xs text-red-600 ml-1">Mobile number must be exactly 10 digits</p>
                            )}
                        </div>

                        {/* Password Input */}
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
                                    placeholder="Create a strong password"
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

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-xs font-medium ${passwordStrength.strength === 1 ? 'text-red-600' :
                                            passwordStrength.strength === 2 ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 ml-1">
                                        Use 8+ characters with mix of letters, numbers & symbols
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-10 pr-12 py-3.5 border border-gray-200 rounded-xl leading-5 bg-white/60 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red focus:bg-white transition-all duration-200 shadow-sm"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <div className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                                        {showConfirmPassword ? (
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
                            {confirmPassword && password !== confirmPassword && (
                                <p className="mt-1 text-xs text-red-600 ml-1">Passwords do not match</p>
                            )}
                            {confirmPassword && password === confirmPassword && (
                                <p className="mt-1 text-xs text-green-600 ml-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Passwords match
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded cursor-pointer"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-600 cursor-pointer">
                                    I accept the{' '}
                                    <a href="#" className="font-medium text-brand-red hover:text-red-700 transition-colors">
                                        Terms and Conditions
                                    </a>
                                    {' '}and{' '}
                                    <a href="#" className="font-medium text-brand-red hover:text-red-700 transition-colors">
                                        Privacy Policy
                                    </a>
                                </label>
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
                                <span>Creating Account...</span>
                            </div>
                        ) : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-brand-red hover:text-red-700 transition-colors inline-block hover:scale-105 transform">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}
