import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const { user, loading } = useAuth()

    useEffect(() => {
        // Wait for auth check
        if (loading) return

        // If user is already logged in, don't show
        if (user) return

        // Check if already visited
        const hasVisited = localStorage.getItem('hasVisited')

        // Show after a short delay for better UX
        if (!hasVisited) {
            const timer = setTimeout(() => {
                setIsOpen(true)
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [user, loading])

    const handleSignup = () => {
        setIsOpen(false)
        navigate('/signup')
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-bounce-in border border-white/20">

                {/* Decorative Pattern */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand-red to-orange-500 opacity-10"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-red/20 rounded-full blur-3xl"></div>

                <div className="relative p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-red to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-red/20 transform rotate-3 hover:rotate-6 transition-transform">
                        <span className="text-4xl filter drop-shadow-md">🧱</span>
                    </div>

                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
                        Welcome to JagritiBricks!
                    </h2>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Join our community of builders! Create an account to <span className="font-bold text-brand-red">track orders</span>, save addresses, and get <span className="font-bold text-brand-red">exclusive deals</span> on construction materials.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={handleSignup}
                            className="w-full py-4 px-6 bg-gradient-to-r from-brand-red to-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span>Create Free Account</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>

                        <button
                            onClick={handleClose}
                            className="w-full py-3 px-6 text-gray-500 font-medium hover:text-gray-800 transition-colors"
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
