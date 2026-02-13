import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function Checkout() {
    const { cart, getCartTotal, clearCart } = useCart()
    const { settings } = useSiteSettings()
    const { user } = useAuth()
    // ...
    // Helper to calculate totals
    const subtotal = getCartTotal()
    const deliveryFee = settings.loading ? 0 : (subtotal >= (settings.free_shipping_threshold || 500) ? 0 : (settings.delivery_fee || 40))
    const totalAmount = subtotal + deliveryFee

    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)
    const [orderId, setOrderId] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: ''
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const validateStep1 = () => {
        return formData.name && formData.phone && formData.address && formData.city && formData.state && formData.pincode
    }

    const handlePlaceOrder = async () => {
        setLoading(true)
        try {
            // Prepare order data for the backend API
            const orderData = {
                delivery_address: {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                },
                notes: formData.notes,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price
                }))
            }

            const response = await api.post('/orders', orderData)
            const order = response.data.order

            // Success!
            setOrderId(order.id)
            setOrderPlaced(true)
            clearCart()
        } catch (error) {
            console.error('Error placing order:', error)
            if (error.response?.status === 401) {
                navigate('/login')
            } else {
                alert('Failed to place order. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }


    if (cart.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        )
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                        Your order ID is: <span className="font-mono font-semibold text-brand-red">{orderId?.slice(0, 8)}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-6">
                        We'll deliver your materials to the address you provided. Our team will contact you soon to confirm the delivery date.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/products')}
                            className="w-full py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 transition font-semibold"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 border-2 border-brand-red text-brand-red rounded-lg hover:bg-brand-cream transition font-semibold"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex-1 flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? 'bg-brand-red text-white' : 'bg-gray-300 text-gray-600'
                                    }`}>
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-brand-red' : 'bg-gray-300'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <span className={step >= 1 ? 'text-brand-red font-semibold' : 'text-gray-600'}>Address</span>
                        <span className={step >= 2 ? 'text-brand-red font-semibold' : 'text-gray-600'}>Review</span>
                        <span className={step >= 3 ? 'text-brand-red font-semibold' : 'text-gray-600'}>Payment</span>
                    </div>
                </div>

                {/* Step Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Step 1: Address */}
                        {step === 1 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-semibold mb-6">Delivery Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Address *</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                            placeholder="Street address, building name, floor"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                            placeholder="400001"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Delivery Notes (Optional)</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                            placeholder="Any specific delivery instructions..."
                                        ></textarea>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!validateStep1()}
                                    className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${validateStep1()
                                        ? 'bg-brand-red text-white hover:bg-red-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Continue to Review
                                </button>
                            </div>
                        )}

                        {/* Step 2: Review */}
                        {step === 2 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-semibold mb-6">Review Order</h2>

                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Delivery Address</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium">{formData.name}</p>
                                        <p className="text-gray-600">{formData.phone}</p>
                                        <p className="text-gray-600 mt-2">{formData.address}</p>
                                        <p className="text-gray-600">{formData.city}, {formData.state} - {formData.pincode}</p>
                                        {formData.notes && (
                                            <p className="text-sm text-gray-500 mt-2 italic">{formData.notes}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-brand-red text-sm hover:underline mt-2"
                                    >
                                        Edit Address
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Order Items</h3>
                                    <div className="space-y-3">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between border-b pb-3">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={item.image_url || 'https://placehold.co/60x60'}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-600">{item.quantity} × ₹{item.price}</p>
                                                    </div>
                                                </div>
                                                <p className="font-mono font-semibold">₹{(item.quantity * item.price).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 border-2 border-brand-red text-brand-red rounded-lg hover:bg-brand-cream transition font-semibold"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex-1 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 transition font-semibold"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>

                                <div className="border-2 border-brand-red rounded-lg p-6 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Cash on Delivery (COD)</p>
                                                <p className="text-sm text-gray-600">Pay when you receive the materials</p>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
                                        ℹ️ Online payment options will be available soon. Currently, we only accept Cash on Delivery.
                                    </p>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-3 border-2 border-brand-red text-brand-red rounded-lg hover:bg-brand-cream transition font-semibold"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="flex-1 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400"
                                    >
                                        {loading ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary - Sticky */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span className="font-mono">₹{getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Delivery</span>
                                    <span className="text-accent-orange">TBD</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="font-mono text-brand-red">₹{getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="text-xs text-gray-600 space-y-1">
                                <p>✓ COD available</p>
                                <p>✓ Local delivery</p>
                                <p>✓ Quality assured</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
