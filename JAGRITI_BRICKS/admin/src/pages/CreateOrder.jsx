
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import api from '../lib/api'

export default function CreateOrder() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // Data Sources
    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])

    // Form State
    const [selectedUser, setSelectedUser] = useState(null) // null = Guest
    const [guestData, setGuestData] = useState({ name: '', phone: '', address: '', city: 'Jaipur', state: 'Rajasthan', pincode: '' })
    const [orderItems, setOrderItems] = useState([]) // Array of { product, quantity }
    const [orderStatus, setOrderStatus] = useState('confirmed')
    const [deliveryDate, setDeliveryDate] = useState('') // New Delivery Date State
    const [orderNotes, setOrderNotes] = useState('')

    // Search State
    const [userSearch, setUserSearch] = useState('')
    const [productSearch, setProductSearch] = useState('')

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        try {
            const [usersRes, productsRes] = await Promise.all([
                api.get('/admin/users?role=customer'),
                api.get('/products')
            ])

            if (usersRes.data.users) setCustomers(usersRes.data.users)
            if (productsRes.data.products) setProducts(productsRes.data.products)
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }

    // Product Handling
    const addToOrder = (product) => {
        setOrderItems(prev => {
            const existing = prev.find(item => item.product.id === product.id)
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
            }
            return [...prev, { product, quantity: 1 }]
        })
        setProductSearch('')
    }

    const updateQuantity = (productId, newQty) => {
        if (newQty < 1) {
            setOrderItems(prev => prev.filter(item => item.product.id !== productId))
        } else {
            setOrderItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: newQty } : item))
        }
    }

    // Calculations
    const calculateTotal = () => {
        return orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    }

    // Submit
    const handleCreateOrder = async () => {
        if (orderItems.length === 0) return alert('Please add at least one product.')
        if (!selectedUser && (!guestData.name || !guestData.phone)) return alert('Please provide customer details.')
        if (orderStatus === 'confirmed' && !deliveryDate) return alert('Please set a Delivery Date for confirmed orders.')

        setLoading(true)
        try {
            // 1. Prepare Delivery Address
            const deliveryAddress = selectedUser ? {
                name: selectedUser.name || selectedUser.email,
                phone: selectedUser.phone || '',
                address: selectedUser.address || '',
                city: selectedUser.city || 'Jaipur',
                state: selectedUser.state || 'Rajasthan',
                pincode: selectedUser.pincode || ''
            } : guestData

            // 2. Prepare Payload
            const payload = {
                user_id: selectedUser ? selectedUser.id : null,
                items: orderItems.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    unit_price: item.product.price
                })),
                total_amount: calculateTotal(),
                payment_mode: 'COD',
                delivery_address: deliveryAddress,
                notes: orderNotes,
                delivery_date: deliveryDate || null
            }

            await api.post('/admin/orders', payload)

            alert('Order created successfully!')
            navigate('/orders')
        } catch (error) {
            console.error('Error creating order:', error)
            alert('Failed to create order. Check console.')
        } finally {
            setLoading(false)
        }
    }

    // Filtered Lists
    const filteredCustomers = customers.filter(c =>
        (c.name?.toLowerCase().includes(userSearch.toLowerCase()) || '') ||
        (c.phone?.includes(userSearch) || '') ||
        (c.email?.toLowerCase().includes(userSearch.toLowerCase()) || '')
    ).slice(0, 5)

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    )

    return (
        <AdminLayout title="Create Manual Order">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Selection */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. Customer Selection */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center">
                            <span className="bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
                            Customer Details
                        </h2>

                        <div className="flex space-x-4 mb-4">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className={`px - 4 py - 2 rounded - lg border ${!selectedUser ? 'bg-brand-red text-white border-brand-red' : 'border-gray-300 text-gray-700'} `}
                            >
                                Guest / New
                            </button>
                            <button
                                onClick={() => setUserSearch('')}
                                className={`px - 4 py - 2 rounded - lg border ${selectedUser ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-700'} `}
                            >
                                Registered User
                            </button>
                        </div>

                        {!selectedUser ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                                <input type="text" placeholder="Full Name *" className="border p-2 rounded" value={guestData.name} onChange={e => setGuestData({ ...guestData, name: e.target.value })} />
                                <input type="text" placeholder="Phone Number *" className="border p-2 rounded" value={guestData.phone} onChange={e => setGuestData({ ...guestData, phone: e.target.value })} />
                                <input type="text" placeholder="Address *" className="border p-2 rounded md:col-span-2" value={guestData.address} onChange={e => setGuestData({ ...guestData, address: e.target.value })} />
                                <input type="text" placeholder="City" className="border p-2 rounded" value={guestData.city} onChange={e => setGuestData({ ...guestData, city: e.target.value })} />
                                <input type="text" placeholder="Pincode" className="border p-2 rounded" value={guestData.pincode} onChange={e => setGuestData({ ...guestData, pincode: e.target.value })} />
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fadeIn">
                                <input
                                    type="text"
                                    placeholder="Search by name, phone or email..."
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
                                    value={userSearch}
                                    onChange={e => setUserSearch(e.target.value)}
                                />
                                {userSearch && (
                                    <ul className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                                        {filteredCustomers.map(c => (
                                            <li key={c.id} onClick={() => { setSelectedUser(c); setUserSearch(''); }} className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between">
                                                <span>{c.name || 'Unknown'} ({c.email})</span>
                                                <span className="text-gray-500">{c.phone}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-indigo-900">{selectedUser.name || 'Unnamed User'}</p>
                                        <p className="text-sm text-indigo-700">{selectedUser.email}</p>
                                        <p className="text-sm text-indigo-700">{selectedUser.phone}</p>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className="text-sm text-red-600 hover:underline">Change</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Product Selection */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center">
                            <span className="bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
                            Add Products
                        </h2>

                        <div className="mb-4 relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full border p-2 rounded pl-10"
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                            />
                            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="border rounded p-3 flex justify-between items-center hover:shadow-sm transition">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                                            {product.image_url && <img src={product.image_url} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{product.name}</p>
                                            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToOrder(product)}
                                        className="text-brand-red font-bold text-sm bg-red-50 px-3 py-1 rounded hover:bg-brand-red hover:text-white transition"
                                    >
                                        Add +
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        <div className="space-y-4 mb-6 min-h-[100px]">
                            {orderItems.length === 0 ? (
                                <p className="text-gray-400 text-center italic py-4">No items added</p>
                            ) : (
                                orderItems.map((item) => (
                                    <div key={item.product.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.product.name}</p>
                                            <p className="text-xs text-gray-500">₹{item.product.price} / {item.product.unit}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 bg-white border rounded flex items-center justify-center text-gray-600 hover:bg-gray-100">-</button>
                                            <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 bg-white border rounded flex items-center justify-center text-gray-600 hover:bg-gray-100">+</button>
                                        </div>
                                        <p className="font-bold text-sm ml-3">₹{item.product.price * item.quantity}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Amount</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Set Order Status</label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={orderStatus}
                                    onChange={e => setOrderStatus(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="placed">Placed</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="dispatched">Dispatched</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Expected Delivery Date {orderStatus === 'confirmed' && '*'}</label>
                                <input
                                    type="date"
                                    className="w-full border rounded p-2"
                                    value={deliveryDate}
                                    onChange={e => setDeliveryDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Internal Notes</label>
                                <textarea
                                    className="w-full border rounded p-2 text-sm"
                                    rows="2"
                                    placeholder="e.g. Phone order, fast delivery requested..."
                                    value={orderNotes}
                                    onChange={e => setOrderNotes(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                onClick={handleCreateOrder}
                                disabled={loading}
                                className="w-full py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition shadow-md disabled:bg-gray-400"
                            >
                                {loading ? 'Creating...' : 'Create Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
