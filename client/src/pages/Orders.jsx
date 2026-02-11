import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Helmet } from 'react-helmet-async'

export default function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate('/login')
                return
            }

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (
                            name,
                            unit,
                            image_url
                        )
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data)
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Helmet>
                <title>My Orders - JagritiBricks</title>
            </Helmet>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Start building your dream project today.</p>
                        <Link to="/products" className="inline-block px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 transition">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">ORDER PLACED</p>
                                        <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">TOTAL</p>
                                        <p className="font-medium text-gray-900">₹{order.total_amount}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">SHIP TO</p>
                                        <p className="font-medium text-gray-900">
                                            {(typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address)?.name}
                                        </p>
                                    </div>
                                    <div className="font-mono text-sm text-gray-500">
                                        #{order.id.slice(0, 8)}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                                                Status: <span className={`ml-2 px-3 py-1 rounded-full text-sm capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                    }`}>{order.status}</span>
                                            </h3>

                                            {/* Delivery Date Highlight */}
                                            {order.delivery_date && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                <div className="flex items-center text-brand-red font-medium mt-1 animate-pulse">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Expected Delivery: {new Date(order.delivery_date).toDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {order.order_items?.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden border">
                                                    {item.products?.image_url
                                                        ? <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                                                    }
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{item.products?.name}</h4>
                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity} {item.products?.unit}</p>
                                                </div>
                                                <div className="font-medium text-gray-900">
                                                    ₹{item.unit_price * item.quantity}
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
