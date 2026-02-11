import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabaseClient'

export default function ProductManagement() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        category: 'cement',
        brand: '',
        price: '',
        unit: 'bag',
        stock: '',
        min_order_quantity: 1,
        quality_grade: '',
        description: '',
        image_url: ''
    })

    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setProducts(data)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = async (e) => {
        try {
            const file = e.target.files[0]
            if (!file) return

            setUploading(true)
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, image_url: publicUrl }))
        } catch (error) {
            alert('Error uploading image: ' + error.message)
            console.log(error)
        } finally {
            setUploading(false)
        }
    }

    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct(product)
            setFormData({
                name: product.name,
                category: product.category,
                brand: product.brand || '',
                price: product.price,
                unit: product.unit,
                stock: product.stock,
                min_order_quantity: product.min_order_quantity || 1,
                quality_grade: product.quality_grade || '',
                description: product.description || '',
                image_url: product.image_url || ''
            })
        } else {
            setCurrentProduct(null)
            setFormData({
                name: '',
                category: 'cement',
                brand: '',
                price: '',
                unit: 'bag',
                stock: '',
                min_order_quantity: 1,
                quality_grade: '',
                description: '',
                image_url: ''
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (currentProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(formData)
                    .eq('id', currentProduct.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([formData])

                if (error) throw error
            }
            setIsModalOpen(false)
            fetchProducts()
        } catch (error) {
            console.error('Error saving product:', error)
            alert('Failed to save product: ' + error.message)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id)

                if (error) throw error
                fetchProducts()
            } catch (error) {
                console.error('Error deleting product:', error)
                alert('Failed to delete product')
            }
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <AdminLayout title="Product Management">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full px-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                >
                    + Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.image_url || 'https://via.placeholder.com/40'} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.brand}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₹{product.price} / {product.unit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.stock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <h2 className="text-2xl font-bold mb-6">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full border rounded p-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                                    <input name="brand" value={formData.brand} onChange={handleInputChange} className="mt-1 w-full border rounded p-2" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="mt-1 w-full border rounded p-2">
                                        <option value="cement">Cement</option>
                                        <option value="bricks">Bricks</option>
                                        <option value="sariya">Sariya</option>
                                        <option value="sand">Sand</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price</label>
                                    <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="mt-1 w-full border rounded p-2" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                                    <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} className="mt-1 w-full border rounded p-2" required />
                                </div>
                                <div>
                                    <input name="unit" value={formData.unit} onChange={handleInputChange} className="mt-1 w-full border rounded p-2" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Min Order Qty</label>
                                    <input name="min_order_quantity" type="number" value={formData.min_order_quantity} onChange={handleInputChange} className="mt-1 w-full border rounded p-2" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quality Grade</label>
                                    <input name="quality_grade" value={formData.quality_grade} onChange={handleInputChange} className="mt-1 w-full border rounded p-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    {formData.image_url && (
                                        <img src={formData.image_url} alt="Preview" className="h-16 w-16 object-cover rounded" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-brand-red file:text-white
                                            hover:file:bg-red-700"
                                        disabled={uploading}
                                    />
                                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={uploading} className="px-4 py-2 bg-brand-red text-white rounded hover:bg-red-700 disabled:opacity-50">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
