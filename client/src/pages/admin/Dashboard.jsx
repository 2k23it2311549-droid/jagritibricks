import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabaseClient'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts'

function StatsCard({ title, value, icon, color }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-gray-100 transition hover:shadow-md">
            <div className={`p-4 rounded-full ${color} text-white bg-opacity-90 shadow-sm`}>
                <span className="text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        recentOrders: [],
        chartData: [],
        topProducts: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // 1. Basic Counts
            const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true })
            const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true })

            // 2. Recent Orders & Revenue Calculation
            const { data: allOrders } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })

            const recentOrders = allOrders.slice(0, 5)
            const totalRevenue = allOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0)

            // 3. Prepare Chart Data (Last 7 Days)
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - i)
                return d.toISOString().split('T')[0]
            }).reverse()

            const chartData = last7Days.map(date => {
                const dayOrders = allOrders.filter(o => o.created_at.startsWith(date))
                return {
                    name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    orders: dayOrders.length,
                    revenue: dayOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
                }
            })

            // 4. Top Products (Mock calculation needed if no order_items view, fetch order_items for accuracy)
            // Fetching a sample of order items to approximate top products
            const { data: orderItems } = await supabase
                .from('order_items')
                .select('*, products(name)')
                .limit(100)

            const productCounts = {}
            orderItems?.forEach(item => {
                const name = item.products?.name || 'Unknown'
                productCounts[name] = (productCounts[name] || 0) + item.quantity
            })

            const topProducts = Object.entries(productCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }))


            setStats({
                totalOrders: totalOrders || 0,
                totalRevenue: totalRevenue || 0,
                totalProducts: totalProducts || 0,
                recentOrders: recentOrders || [],
                chartData,
                topProducts
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
            </div>
        )
    }

    return (
        <AdminLayout title="Dashboard">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Total Orders" value={stats.totalOrders} icon="📦" color="bg-gradient-to-br from-blue-500 to-blue-600" />
                <StatsCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon="💰" color="bg-gradient-to-br from-green-500 to-green-600" />
                <StatsCard title="Products" value={stats.totalProducts} icon="🧱" color="bg-gradient-to-br from-orange-500 to-orange-600" />
                <StatsCard title="Avg. Order Value" value={`₹${stats.totalOrders ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}`} icon="📊" color="bg-gradient-to-br from-purple-500 to-purple-600" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trends (Last 7 Days)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Volume Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Order Volume</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders - Takes 2 cols */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                        <a href="/admin/orders" className="text-sm text-brand-red font-semibold hover:underline">View All</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                                    <th className="pb-3 pl-2">Order ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="py-3 pl-2 text-sm font-medium text-gray-900">#{order.id.slice(0, 6)}</td>
                                        <td className="py-3 text-sm text-gray-600">
                                            {typeof order.delivery_address === 'string'
                                                ? JSON.parse(order.delivery_address)?.name
                                                : order.delivery_address?.name || 'Guest'}
                                        </td>
                                        <td className="py-3 text-sm font-bold text-gray-900">₹{order.total_amount}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'placed' ? 'bg-yellow-100 text-yellow-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products - Takes 1 col */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Top Products</h2>
                    <ul className="space-y-4">
                        {stats.topProducts.map((product, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{product.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{product.count} Sold</span>
                            </li>
                        ))}
                        {stats.topProducts.length === 0 && (
                            <li className="text-sm text-gray-500 text-center py-4">No sales data yet</li>
                        )}
                    </ul>
                </div>
            </div>
        </AdminLayout>
    )
}
