import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
    const { addToCart } = useCart()

    const handleAddToCart = (e) => {
        e.preventDefault() // Prevent navigation if clicked on button
        addToCart(product, 1)
    }

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-brand-red/30 dora-card dora-glow-cursor">
            <Link to={`/products/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative h-48 sm:h-64 overflow-hidden bg-gray-100">
                    <img
                        src={product.image_url || 'https://placehold.co/400x300/e63946/ffffff?text=Product'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.stock > 0 && product.stock < 50 && (
                            <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                Low Stock
                            </span>
                        )}
                        {product.price > 10000 && (
                            <span className="bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                Premium
                            </span>
                        )}
                    </div>

                    {/* Out of Stock Overlay */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[4px] flex items-center justify-center z-20">
                            <span className="bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-xl transform -rotate-12 border-2 border-white">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    <div className="mb-3 sm:mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-red transition-colors line-clamp-1">
                                {product.name}
                            </h3>
                            {product.quality_grade && (
                                <span className="ml-2 inline-block text-[10px] uppercase tracking-wider font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                                    {product.quality_grade}
                                </span>
                            )}
                        </div>
                        {product.brand && (
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{product.brand}</p>
                        )}
                    </div>

                    <div className="flex items-end justify-between mb-4 sm:mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl sm:text-2xl font-bold font-serif text-brand-red">₹{product.price}</span>
                            <span className="text-sm text-gray-400 font-medium">/ {product.unit}</span>
                        </div>
                        {product.min_order_quantity > 1 && (
                            <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                Min: {product.min_order_quantity}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 transform active:scale-95 shadow-lg dora-spring-btn
                            ${product.stock === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-brand-red to-red-600 text-white hover:from-red-600 hover:to-brand-red hover:shadow-brand-red/30'
                            }`}
                    >
                        {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                    </button>
                </div>
            </Link>
        </div>
    )
}
