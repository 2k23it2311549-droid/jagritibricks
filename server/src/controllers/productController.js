import { supabase } from '../config/supabase.js'

// Get all products with optional filters
export const getAllProducts = async (req, res) => {
    try {
        const { category, search, sortBy = 'name', order = 'asc' } = req.query

        let query = supabase.from('products').select('*')

        // Filter by category
        if (category && category !== 'all') {
            query = query.eq('category', category)
        }

        // Search by name
        if (search) {
            query = query.ilike('name', `%${search}%`)
        }

        // Sort
        query = query.order(sortBy, { ascending: order === 'asc' })

        const { data, error } = await query

        if (error) throw error

        res.json({ success: true, data })
    } catch (error) {
        console.error('Error fetching products:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        if (!data) {
            return res.status(404).json({ success: false, error: 'Product not found' })
        }

        res.json({ success: true, data })
    } catch (error) {
        console.error('Error fetching product:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Create new product (admin only)
export const createProduct = async (req, res) => {
    try {
        const productData = req.body

        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single()

        if (error) throw error

        res.status(201).json({ success: true, data })
    } catch (error) {
        console.error('Error creating product:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Update product (admin only)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, data })
    } catch (error) {
        console.error('Error updating product:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) throw error

        res.json({ success: true, message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Error deleting product:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
