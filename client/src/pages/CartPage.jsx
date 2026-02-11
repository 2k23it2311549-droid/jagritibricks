import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart()

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to get started!</p>
                    <Link
                        to="/products"
                        className="inline-block px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Product Info Section */}
                                    <div className="flex items-center gap-4 flex-grow w-full sm:w-auto">
                                        <img
                                            src={item.image_url || 'https://placehold.co/100x100'}
                                            alt={item.name}
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded flex-shrink-0"
                                        />

                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-600">{item.brand}</p>
                                            <p className="text-brand-red font-mono font-bold">₹{item.price} / {item.unit}</p>
                                        </div>
                                    </div>

                                    {/* Controls & Price Section */}
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(item.min_order_quantity || 1, item.quantity - 1))}
                                                disabled={item.quantity <= (item.min_order_quantity || 1)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${item.quantity <= (item.min_order_quantity || 1) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-right min-w-[80px]">
                                            <p className="font-bold font-mono">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-600 hover:text-red-800 text-sm mt-1"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span>Items ({getCartCount()})</span>
                                    <span className="font-mono">₹{getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-accent-orange">TBD</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="font-mono text-brand-red">₹{getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full block text-center py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 transition font-semibold"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                to="/products"
                                className="w-full block text-center py-3 mt-3 border-2 border-brand-red text-brand-red rounded-lg hover:bg-brand-cream transition font-semibold"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
