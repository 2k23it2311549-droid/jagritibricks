import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Helmet } from 'react-helmet-async'

export default function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        fetchOrders()
    }, [user])

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders')
            setOrders(response.data.orders || [])
        } catch (error) {
            console.error('Error fetching orders:', error)
            if (error.response?.status === 401) {
                navigate('/login')
            }
        } finally {
            setLoading(false)
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Hero placeholder */}
                <div className="py-12 md:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-dark"></div>
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
                </div>
            </div>
        )
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200'
            case 'shipped': case 'dispatched': return 'bg-blue-50 text-blue-700 border border-blue-200'
            case 'processing': return 'bg-purple-50 text-purple-700 border border-purple-200'
            default: return 'bg-amber-50 text-amber-700 border border-amber-200'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>My Orders - JagritiBricks</title>
            </Helmet>

            {/* Hero Mini Banner */}
            <section className="relative py-12 md:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-dark overflow-hidden">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-red/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-orange/10 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
                        Order History
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-yellow-400">Orders</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-xl">Track and review all your past and current orders</p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-14 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start building your dream project today. Browse our premium construction materials.</p>
                        <Link to="/products" className="inline-block px-8 py-3.5 bg-gradient-to-r from-brand-red to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-brand-red/25 transition-all hover:-translate-y-0.5">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-500">
                                {/* Order Header */}
                                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                    <div className="flex items-center gap-6 flex-wrap">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Order Placed</p>
                                            <p className="font-medium text-gray-800 text-sm">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Total</p>
                                            <p className="font-bold text-gray-900 text-sm">₹{Number(order.total_amount).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Ship To</p>
                                            <p className="font-medium text-gray-800 text-sm">
                                                {(typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address)?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2.5 py-1 rounded-md">
                                        #{order.id.slice(0, 8)}
                                    </span>
                                </div>

                                {/* Order Body */}
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-600">Status:</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Delivery Date Highlight */}
                                        {order.delivery_date && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                            <div className="flex items-center text-brand-red font-medium text-sm">
                                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Expected: {new Date(order.delivery_date).toDateString()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-3">
                                        {order.order_items?.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                                <div className="w-14 h-14 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                                                    {item.products?.image_url
                                                        ? <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 text-sm truncate">{item.products?.name}</h4>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity} {item.products?.unit}</p>
                                                </div>
                                                <div className="font-bold text-gray-900 text-sm">
                                                    ₹{(item.unit_price * item.quantity).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
