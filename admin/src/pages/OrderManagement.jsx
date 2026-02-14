import { useState, useEffect } from 'react'

import { supabase } from '../lib/supabaseClient'

export default function OrderManagement() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedOrders, setSelectedOrders] = useState([])

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (
                            name,
                            unit
                        )
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data)
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId)

            if (error) throw error
            fetchOrders()
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Failed to update status')
        }
    }

    const handleDateUpdate = async (orderId, date) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ delivery_date: date })
                .eq('id', orderId)

            if (error) throw error
            fetchOrders()
            alert('Delivery date updated')
        } catch (error) {
            console.error('Error updating date:', error)
            alert('Failed to update date')
        }
    }

    const toggleSelectOrder = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        )
    }

    const toggleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([])
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id))
        }
    }

    const handleBulkUpdate = async (newStatus) => {
        if (!window.confirm(`Update ${selectedOrders.length} orders to '${newStatus}'?`)) return

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .in('id', selectedOrders)

            if (error) throw error
            fetchOrders()
            setSelectedOrders([])
            alert('Bulk update successful!')
        } catch (error) {
            console.error('Error bulk updating:', error)
            alert('Failed to update orders')
        }
    }

    const handleExportCSV = () => {
        const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Status', 'Total Amount', 'Delivery Date']
        const csvRows = [headers.join(',')]

        const ordersToExport = selectedOrders.length > 0
            ? orders.filter(o => selectedOrders.includes(o.id))
            : filteredOrders

        for (const order of ordersToExport) {
            const address = typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address
            const row = [
                order.id,
                new Date(order.created_at).toLocaleDateString(),
                `"${address?.name || ''}"`,
                `"${address?.phone || ''}"`,
                `"${(address?.address || '') + ' ' + (address?.city || '')}"`,
                order.status,
                order.total_amount,
                order.delivery_date || ''
            ]
            csvRows.push(row.join(','))
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus

        const customerName = typeof order.delivery_address === 'string'
            ? JSON.parse(order.delivery_address)?.name
            : order.delivery_address?.name || ''

        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerName.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesStatus && matchesSearch
    })

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
        </div>
    )

    const tabs = [
        { id: 'all', label: 'All Orders' },
        { id: 'placed', label: 'Placed' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'dispatched', label: 'Dispatched' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' },
    ]

    return (
        <div className="p-4 dora-fade-in">

            {/* Controls Header */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4">
                {/* Top Row: Search & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer Name..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red sm:text-sm transition duration-150 ease-in-out"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto">
                        {selectedOrders.length > 0 && (
                            <div className="flex items-center space-x-2 animate-fadeIn bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                                <span className="text-xs font-semibold text-yellow-800 whitespace-nowrap">{selectedOrders.length} selected</span>
                                <select
                                    className="border-none bg-transparent text-sm text-yellow-800 font-medium focus:ring-0 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.value) handleBulkUpdate(e.target.value)
                                    }}
                                    value=""
                                >
                                    <option value="" disabled>Bulk Action</option>
                                    <option value="confirmed">Mark Confirmed</option>
                                    <option value="dispatched">Mark Dispatched</option>
                                    <option value="delivered">Mark Delivered</option>
                                    <option value="completed">Mark Completed</option>
                                </select>
                            </div>
                        )}

                        <button
                            onClick={handleExportCSV}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium whitespace-nowrap"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export
                        </button>

                        <button
                            onClick={() => window.location.href = '/orders/create'}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full hover:shadow-lg transition font-medium whitespace-nowrap hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Order
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 overflow-x-auto hide-scrollbar">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterStatus(tab.id)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${filterStatus === tab.id
                                        ? 'border-brand-red text-brand-red'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                `}
                            >
                                {tab.label}
                                {tab.id === 'placed' && orders.filter(o => o.status === 'placed').length > 0 && (
                                    <span className="ml-2 bg-yellow-100 text-yellow-600 py-0.5 px-2 rounded-full text-xs">
                                        {orders.filter(o => o.status === 'placed').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {/* Select All Header */}
                {filteredOrders.length > 0 && (
                    <div className="flex items-center px-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-5 w-5 text-brand-red rounded focus:ring-brand-red border-gray-300"
                                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                onChange={toggleSelectAll}
                            />
                            <span className="text-sm font-medium text-gray-600">Select All ({filteredOrders.length})</span>
                        </label>
                    </div>
                )}

                {filteredOrders.map((order) => (
                    <div key={order.id} className={`dora-table-row bg-white rounded-xl shadow-sm overflow-hidden border transition-all hover:shadow-md ${selectedOrders.includes(order.id) ? 'border-brand-orange ring-1 ring-brand-orange/20' : 'border-gray-100'}`}>
                        <div className="p-6 flex flex-col lg:flex-row justify-between items-start gap-4">
                            {/* Left: Checkbox & Info */}
                            <div className="flex items-start space-x-4 w-full lg:w-3/5">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-5 w-5 text-brand-red rounded focus:ring-brand-red border-gray-300 flex-shrink-0"
                                    checked={selectedOrders.includes(order.id)}
                                    onChange={() => toggleSelectOrder(order.id)}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center flex-wrap gap-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            #{order.id.slice(0, 8)}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            • {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </span>
                                        {new Date(order.created_at) > new Date(Date.now() - 86400000) && (
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">New</span>
                                        )}
                                    </div>

                                    <div className="mt-2 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                        <div className="flex items-center text-gray-900 font-medium">
                                            <span className="text-gray-500 mr-2">Customer:</span>
                                            {(typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address)?.name || 'Guest'}
                                        </div>
                                        <div className="flex items-center text-gray-900 font-bold">
                                            <span className="text-gray-500 mr-2">Total:</span>
                                            ₹{order.total_amount}
                                        </div>
                                    </div>

                                    {/* Quick Items Preview */}
                                    <p className="mt-2 text-xs text-gray-500 truncate max-w-md">
                                        {order.order_items?.map(i => `${i.products?.name} (${i.quantity})`).join(', ')}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Actions & Status */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 w-full lg:w-2/5">
                                <div className="flex flex-col items-end gap-2 w-full">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'}`}>
                                            {order.status}
                                        </span>

                                        <select
                                            className="border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-brand-red focus:border-brand-red py-1"
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        >
                                            <option value="placed">Placed</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="dispatched">Dispatched</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    {(order.status === 'confirmed' || order.status === 'dispatched') && (
                                        <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Est. Delivery:</span>
                                            <input
                                                type="date"
                                                className="border-none bg-transparent p-0 text-xs text-gray-900 font-medium focus:ring-0"
                                                value={order.delivery_date || ''}
                                                onChange={(e) => handleDateUpdate(order.id, e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Expandable Details Section */}
                        <details className="group border-t border-gray-50 bg-gray-50/50">
                            <summary className="list-none w-full px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-colors">
                                <span>Show Full Details</span>
                                <svg className="w-4 h-4 ml-1 transform group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </summary>
                            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-3 border-b pb-1">Delivery Address</h4>
                                    <div className="text-gray-600 space-y-1 pl-2">
                                        <p className="font-medium">{(typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address)?.name}</p>
                                        <p>{(typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address)?.phone}</p>
                                        <p className="whitespace-pre-wrap">{(typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address)?.address}</p>
                                        <p>{(typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address)?.city}, {(typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address)?.pincode}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-3 border-b pb-1">Order Items</h4>
                                    <ul className="space-y-2 pl-2">
                                        {order.order_items?.map((item) => (
                                            <li key={item.id} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 shadow-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{item.products?.name}</span>
                                                    <span className="text-xs text-gray-500">Qty: {item.quantity} {item.products?.unit}</span>
                                                </div>
                                                <span className="font-bold text-gray-900">₹{item.unit_price * item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </details>
                    </div>
                ))}
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    )
}
