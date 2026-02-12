import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { Helmet } from 'react-helmet-async'

export default function ProductDetails() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const { addToCart } = useCart()

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        setLoading(true)
        try {
            // Fetch main product
            const { data: productData, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error

            if (productData) {
                setProduct(productData)
                setQuantity(productData.min_order_quantity || 1)

                // Fetch related products
                const { data: relatedData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', productData.category)
                    .neq('id', id)
                    .limit(4)

                if (relatedData) {
                    setRelatedProducts(relatedData)
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity)
            // Optional: Show toast notification
            alert(`Added ${quantity} ${product.unit} of ${product.name} to cart!`)
        }
    }

    const handleBuyNow = () => {
        if (product) {
            addToCart(product, quantity)
            window.location.href = '/checkout'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
                    <Link to="/products" className="text-brand-red hover:underline">
                        ← Back to Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <Link to="/" className="hover:text-brand-red">Home</Link>
                    <span className="mx-2">›</span>
                    <Link to="/products" className="hover:text-brand-red">Products</Link>
                    <span className="mx-2">›</span>
                    <span className="text-gray-900">{product.name}</span>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg shadow-md p-8 mb-12">
                    {/* Product Image */}
                    <div>
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={product.image_url || 'https://placehold.co/600x600/e63946/ffffff?text=' + product.name}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
                            {product.brand && (
                                <p className="text-lg text-gray-600">Brand: {product.brand}</p>
                            )}
                            {product.quality_grade && (
                                <span className="inline-block mt-2 text-sm bg-accent-blue text-white px-3 py-1 rounded">
                                    {product.quality_grade}
                                </span>
                            )}
                        </div>

                        <div className="border-t border-b py-4">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-4xl font-bold font-mono text-brand-red">₹{product.price}</span>
                                <span className="text-xl text-gray-600">/ {product.unit}</span>
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.stock > 0 ? (
                                <p className="text-green-600 font-medium">
                                    ✓ In Stock ({product.stock} {product.unit} available)
                                </p>
                            ) : (
                                <p className="text-red-600 font-medium">✗ Out of Stock</p>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-gray-700">{product.description}</p>
                            </div>
                        )}

                        {/* Minimum Order */}
                        {product.min_order_quantity && product.min_order_quantity > 1 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ Minimum order quantity: {product.min_order_quantity} {product.unit}
                                </p>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div>
                            <label className="block font-semibold mb-2">Quantity</label>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setQuantity(Math.max(product.min_order_quantity || 1, quantity - 1))}
                                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(product.min_order_quantity || 1, parseInt(e.target.value) || 1))}
                                    className="w-20 text-center border border-gray-300 rounded-lg py-2 font-semibold"
                                    min={product.min_order_quantity || 1}
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                >
                                    +
                                </button>
                                <span className="text-gray-600">× ₹{product.price} = ₹{(quantity * product.price).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex - 1 py - 3 rounded - lg font - semibold transition ${product.stock === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-white border-2 border-brand-red text-brand-red hover:bg-brand-cream'
                                    } `}
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className={`flex - 1 py - 3 rounded - lg font - semibold transition ${product.stock === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-brand-red text-white hover:bg-red-700'
                                    } `}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-serif font-bold mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
