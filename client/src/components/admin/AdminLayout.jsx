import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminLayout({ children, title }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkUser()
    }, [navigate])

    const checkUser = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                navigate('/admin/login')
                return
            }

            // Check if user is admin
            const { data: userData, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single()

            if (error || userData.role !== 'admin') {
                await supabase.auth.signOut()
                navigate('/admin/login')
                return
            }

            setUser({ ...session.user, ...userData })
        } catch (error) {
            console.error('Auth check error:', error)
            navigate('/admin/login')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/admin/login')
    }

    const navItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/products', icon: '📦', label: 'Products' },
        { path: '/admin/orders', icon: '🛍️', label: 'Orders' },
        { path: '/admin/customers', icon: '👥', label: 'Customers' },
        { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
    ]

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:block">
                <div className="p-6">
                    <div className="flex items-center space-x-2 mb-8">
                        <span className="text-2xl">🧱</span>
                        <span className="text-xl font-bold font-serif text-brand-red">Admin Panel</span>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${location.pathname === item.path
                                    ? 'bg-brand-red text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            👤
                        </div>
                        <div>
                            <p className="font-medium text-sm">{user?.email || 'Admin'}</p>
                            <p className="text-xs text-gray-500">Super Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 transition"
                    >
                        Logout
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
