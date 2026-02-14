import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout({ children, title }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, loading, signOut } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        }
    }, [user, loading, navigate])

    const handleLogout = () => {
        signOut()
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user) return null

    const navItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/products', icon: '📦', label: 'Products' },
        { path: '/orders', icon: '🛍️', label: 'Orders' },
        { path: '/customers', icon: '👥', label: 'Customers' },
        { path: '/site-editor', icon: '🎨', label: 'Site Editor' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
    ]

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen flex bg-transparent">
            {/* Sidebar with Vibrant/Clay Theme */}
            <aside className="w-72 bg-white/90 backdrop-blur-xl border-r border-white/40 flex-shrink-0 hidden md:flex flex-col relative z-20 shadow-2xl">
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center space-x-3 mb-10 animate-fadeIn pl-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-vibrant flex items-center justify-center text-xl shadow-lg shadow-orange-500/30 text-white font-bold animate-bounce-subtle">
                            JB
                        </div>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-vibrant tracking-tight">
                            JagritiBricks
                        </span>
                    </div>

                    <nav className="space-y-3 dora-stagger visible">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${location.pathname === item.path
                                    ? 'bg-gradient-vibrant text-white shadow-lg shadow-pink-500/20 scale-105 font-semibold'
                                    : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600 hover:pl-7'
                                    }`}
                            >
                                <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${location.pathname === item.path ? 'animate-pulse' : ''}`}>{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white/50">
                    <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-10 h-10 bg-gradient-ocean rounded-full flex items-center justify-center text-white shadow-md">
                            👤
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm text-gray-800 truncate">{user?.email?.split('@')[0] || 'Admin'}</p>
                            <p className="text-xs text-blue-500 font-medium">Super Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow-md"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden">
                    <span className="font-bold text-lg">Admin Panel</span>
                    <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
                </div>

                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    )
}
