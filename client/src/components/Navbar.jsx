import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, signOut } = useAuth()
    const { getCartCount, openCart } = useCart()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location.pathname])

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Bricks', path: '/products' },
        { name: 'Contact', path: '/contact' },
        { name: 'Orders', path: '/orders' },
    ]

    const isActive = (path) => location.pathname === path

    const handleLogout = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/98 backdrop-blur-xl shadow-xl border-b border-gray-100'
                : 'bg-white shadow-md border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 shrink-0 group transition-transform hover:scale-105 duration-200">
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-red to-red-600 rounded-lg flex items-center justify-center shadow-md shadow-brand-red/30 group-hover:shadow-lg group-hover:shadow-brand-red/40 transition-all duration-200">
                            <span className="text-white text-lg">🧱</span>
                        </div>
                        <span className="text-xl font-serif font-bold text-gray-900 tracking-wide">
                            Jagriti<span className="text-brand-red">Bricks</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                    ? 'text-brand-red bg-brand-red/5 font-semibold shadow-sm'
                                    : 'text-gray-700 hover:text-brand-red hover:bg-brand-red/5 hover:scale-105'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-2 shrink-0">
                        {/* Cart Button */}
                        <button
                            onClick={openCart}
                            className="relative p-2.5 text-gray-700 hover:text-brand-red hover:bg-brand-red/5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                            aria-label="Open cart"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-gradient-to-br from-brand-red to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-brand-red/40 animate-pulse">
                                    {getCartCount()}
                                </span>
                            )}
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/orders"
                                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-brand-red hover:bg-gray-50 rounded-lg transition-all duration-200"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-brand-red hover:bg-gray-50 rounded-lg transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-brand-red to-red-600 text-white text-sm font-semibold rounded-lg hover:shadow-xl hover:shadow-brand-red/30 hover:scale-105 active:scale-95 shadow-md shadow-brand-red/20 transition-all duration-200"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-brand-red hover:bg-gray-50 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
                    }`}
            >
                <div className="px-4 py-4 space-y-1 bg-white">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                                ? 'text-brand-red bg-brand-red/5 font-semibold'
                                : 'text-gray-600 hover:text-brand-red hover:bg-gray-50'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="border-t border-gray-100 pt-3 mt-3">
                        {user ? (
                            <>
                                <Link
                                    to="/orders"
                                    className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-red hover:bg-gray-50"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:text-brand-red hover:bg-gray-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3 px-4 py-2">
                                <Link
                                    to="/login"
                                    className="flex-1 text-center py-2.5 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="flex-1 text-center py-2.5 border border-brand-red text-brand-red text-sm font-semibold rounded-lg hover:bg-brand-red/5 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
