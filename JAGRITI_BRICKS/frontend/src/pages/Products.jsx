import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import { Helmet } from 'react-helmet-async'
import ProductCard from '../components/ProductCard'

export default function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
    const [sortBy, setSortBy] = useState('name')

    useEffect(() => {
        fetchProducts()
    }, [selectedCategory, sortBy])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            // Build query params
            const params = new URLSearchParams()
            if (selectedCategory !== 'all') {
                params.append('category', selectedCategory)
            }
            if (sortBy === 'price-low') {
                params.append('sortBy', 'price')
                params.append('order', 'asc')
            } else if (sortBy === 'price-high') {
                params.append('sortBy', 'price')
                params.append('order', 'desc')
            } else {
                params.append('sortBy', 'name')
                params.append('order', 'asc')
            }

            const { data } = await api.get(`/products?${params.toString()}`)
            setProducts(data.products || [])
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryChange = (category) => {
        setSelectedCategory(category)
        if (category === 'all') {
            searchParams.delete('category')
        } else {
            searchParams.set('category', category)
        }
        setSearchParams(searchParams)
    }

    const categories = [
        { value: 'all', label: 'All Products' },
        { value: 'cement', label: 'Cement' },
        { value: 'bricks', label: 'Bricks' },
        { value: 'sariya', label: 'Sariya (TMT)' },
        { value: 'sand', label: 'Sand' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>Our Products - JagritiBricks</title>
                <meta name="description" content="Browse our wide range of construction materials. High-quality cement, durable bricks, and more at competitive prices." />
            </Helmet>

            {/* Hero Mini Banner */}
            <section className="relative py-12 md:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-dark overflow-hidden">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-red/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-orange/10 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
                        Our Collection
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-yellow-400">Products</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-xl">Browse quality construction materials at factory-direct prices</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => handleCategoryChange(cat.value)}
                                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${selectedCategory === cat.value
                                        ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort + Count */}
                        <div className="flex items-center gap-4">
                            {!loading && products.length > 0 && (
                                <span className="text-sm text-gray-400 font-medium hidden sm:inline">
                                    {products.length} product{products.length !== 1 ? 's' : ''}
                                </span>
                            )}
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-500">Sort:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red bg-gray-50 transition-all"
                                >
                                    <option value="name">Name</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg font-medium mb-2">No products found</p>
                        <p className="text-gray-400 mb-6">Try selecting a different category</p>
                        <button
                            onClick={() => handleCategoryChange('all')}
                            className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                        >
                            Browse All Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
