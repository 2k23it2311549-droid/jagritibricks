import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ isOpen, onClose }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn, signOut } = useAuth()
    const navigate = useNavigate()

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const cleanUsername = username.trim().toLowerCase().replace(/\s/g, '')
            if (!cleanUsername) throw new Error("Username is required")

            const email = `${cleanUsername}@jagritibricks.com`
            const { data, error } = await signIn({ email, password })
            if (error) throw error

            // Check if user is an admin
            if (data?.user?.user_metadata?.role === 'admin') {
                await signOut()
                throw new Error('Administrator accounts restricted. Please use the Admin Portal.')
            }

            // On success, close the modal. 
            onClose()
        } catch (error) {
            setError(error.message === 'Invalid login credentials' ? 'Invalid username or password' : error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-white/20">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100 z-10"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-[-20%] left-[-20%] w-40 h-40 bg-brand-red/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute bottom-[-20%] right-[-20%] w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="text-center sm:mt-5 relative z-10">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red/10 to-red-50 mb-4 animate-bounce shadow-inner">
                                <span className="text-3xl">🛒</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-gray-900" id="modal-title">
                                Please Login First
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 font-medium">
                                    You need to be signed in to add items to your cart.
                                </p>
                            </div>
                        </div>

                        <form className="mt-8 space-y-5 relative z-10" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-3 rounded text-sm text-red-700 font-bold animate-shake">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="modal-username" className="sr-only">Username</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="modal-username"
                                        name="username"
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red focus:bg-white transition-all duration-200 shadow-sm sm:text-sm"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="modal-password" className="sr-only">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="modal-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full pl-10 pr-12 py-3.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red focus:bg-white transition-all duration-200 shadow-sm sm:text-sm"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <div className="p-1 hover:bg-gray-200 rounded-md transition-colors">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing In...</span>
                                    </div>
                                ) : 'Sign In & Continue'}
                            </button>
                        </form>
                    </div>
                    <div className="bg-gray-50/80 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 justify-center rounded-b-3xl">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                onClick={onClose}
                                className="font-bold text-brand-red hover:text-red-700 transition-colors inline-block hover:scale-105 transform"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
