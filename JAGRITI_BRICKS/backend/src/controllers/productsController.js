const db = require('../config/database');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;

        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (category) {
            params.push(category);
            query += ` AND category = $${params.length}`;
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json({ products: result.rows });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product: result.rows[0] });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, category, brand, unit, price, stock, min_order_qty, quality_grade, description, image_url } = req.body;

        if (!name || !category || !unit || !price) {
            return res.status(400).json({ error: 'Please provide required fields' });
        }

        const result = await db.query(
            `INSERT INTO products (name, category, brand, unit, price, stock, min_order_qty, quality_grade, description, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [name, category, brand, unit, price, stock || 0, min_order_qty || 1, quality_grade, description, image_url]
        );

        res.status(201).json({ product: result.rows[0] });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, brand, unit, price, stock, min_order_qty, quality_grade, description, image_url } = req.body;

        const result = await db.query(
            `UPDATE products 
       SET name = COALESCE($1, name), 
           category = COALESCE($2, category), 
           brand = COALESCE($3, brand), 
           unit = COALESCE($4, unit), 
           price = COALESCE($5, price), 
           stock = COALESCE($6, stock), 
           min_order_qty = COALESCE($7, min_order_qty), 
           quality_grade = COALESCE($8, quality_grade), 
           description = COALESCE($9, description), 
           image_url = COALESCE($10, image_url),
           updated_at = NOW()
       WHERE id = $11 RETURNING *`,
            [name, category, brand, unit, price, stock, min_order_qty, quality_grade, description, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product: result.rows[0] });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
