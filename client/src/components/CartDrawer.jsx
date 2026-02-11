import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function CartDrawer() {
    const {
        cart,
        isCartOpen,
        closeCart,
        removeFromCart,
        updateQuantity,
        getCartTotal
    } = useCart()
    const { settings } = useSiteSettings()
    const navigate = useNavigate()

    const cartTotal = getCartTotal()
    const FREE_SHIPPING_THRESHOLD = settings.loading ? 500 : (settings.free_shipping_threshold || 500)
    const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isCartOpen])

    const handleCheckout = () => {
        closeCart()
        navigate('/checkout')
    }

    if (!isCartOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
                onClick={closeCart}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideInRight">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Your Cart ({cart.length})</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-900"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Free Shipping Bar */}
                {cart.length > 0 && (
                    <div className="bg-gray-50 p-4 border-b border-gray-100">
                        {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
                            <div className="flex items-center text-green-600 font-bold text-sm">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                You've unlocked FREE Delivery!
                            </div>
                        ) : (
                            <div className="text-sm">
                                <span className="text-gray-600">Add </span>
                                <span className="font-bold text-brand-red">₹{(FREE_SHIPPING_THRESHOLD - cartTotal).toLocaleString()}</span>
                                <span className="text-gray-600"> more for FREE Delivery</span>
                            </div>
                        )}
                        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-brand-red to-orange-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium mb-2">Your cart is empty</p>
                            <button
                                onClick={() => { closeCart(); navigate('/products'); }}
                                className="text-brand-red font-semibold hover:underline"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    <img
                                        src={item.image_url || 'https://placehold.co/100x100?text=Product'}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition px-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500">{item.brand}</p>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-8">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-2 text-gray-500 hover:bg-gray-200 h-full rounded-l-lg transition"
                                            >
                                                −
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-2 text-gray-500 hover:bg-gray-200 h-full rounded-r-lg transition"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-10 safe-area-bottom">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-medium">Subtotal</span>
                            <span className="text-2xl font-serif font-bold text-brand-red">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={handleCheckout}
                                className="w-full py-3.5 bg-gradient-to-r from-brand-red to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-brand-red/30 transition transform hover:-translate-y-0.5"
                            >
                                Checkout Now
                            </button>
                            <Link
                                to="/cart"
                                onClick={closeCart}
                                className="block w-full py-3 text-center border-2 border-transparent text-gray-500 hover:text-gray-900 text-sm font-semibold hover:underline transition"
                            >
                                View Detailed Cart
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
