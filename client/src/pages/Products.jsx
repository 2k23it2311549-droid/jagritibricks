import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
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
            let query = supabase.from('products').select('*')

            // Filter by category
            if (selectedCategory !== 'all') {
                query = query.eq('category', selectedCategory)
            }

            // Sort mapping
            if (sortBy === 'price-low') {
                query = query.order('price', { ascending: true })
            } else if (sortBy === 'price-high') {
                query = query.order('price', { ascending: false })
            } else {
                query = query.order('name', { ascending: true })
            }

            const { data, error } = await query

            if (error) throw error
            setProducts(data)
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold mb-2">Our Products</h1>
                    <p className="text-gray-600">Browse quality construction materials at factory-direct prices</p>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => handleCategoryChange(cat.value)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${selectedCategory === cat.value
                                        ? 'bg-brand-red text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                            >
                                <option value="name">Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No products found in this category.</p>
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
