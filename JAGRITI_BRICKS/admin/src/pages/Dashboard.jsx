import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import api from '../lib/api'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts'

function StatsCard({ title, value, icon, gradient }) {
    return (
        <div className="clay-card p-6 flex items-center space-x-4 transition hover:scale-105 duration-300 dora-reveal relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${gradient}`}></div>
            <div className={`p-4 rounded-2xl ${gradient} text-white shadow-lg transform transition group-hover:rotate-12 duration-300`}>
                <span className="text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-semibold tracking-wide uppercase">{title}</p>
                <p className="text-3xl font-extrabold text-gray-800 animate-countUp">{value}</p>
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
            const { data } = await api.get('/admin/stats')
            if (data && data.stats) {
                setStats(data.stats)
            }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 dora-stagger visible">
                <StatsCard title="Total Orders" value={stats.totalOrders} icon="📦" gradient="bg-gradient-ocean" />
                <StatsCard title="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon="💰" gradient="bg-gradient-forest" />
                <StatsCard title="Products" value={stats.totalProducts} icon="🧱" gradient="bg-gradient-vibrant" />
                <StatsCard title="Avg. Order" value={`₹${stats.totalOrders ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}`} icon="📊" gradient="bg-gradient-sun" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="clay-card p-6 dora-reveal" style={{ transitionDelay: '0.1s' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Revenue Trends</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 7 Days</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F72585" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#F72585" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#F72585" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Volume Chart */}
                <div className="clay-card p-6 dora-reveal" style={{ transitionDelay: '0.2s' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Order Volume</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Weekly</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="orders" fill="#4361EE" radius={[8, 8, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders - Takes 2 cols */}
                <div className="lg:col-span-2 clay-card p-6 dora-reveal-left">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                        <a href="/orders" className="text-sm text-brand-red font-semibold hover:underline">View All</a>
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
                <div className="clay-card p-6 dora-reveal-right">
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
