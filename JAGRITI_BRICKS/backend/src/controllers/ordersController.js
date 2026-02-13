const db = require('../config/database');

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT o.*, 
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price,
                  'product_name', p.name,
                  'product_image', p.image_url
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        res.json({ orders: result.rows });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT o.*, 
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price,
                  'product_name', p.name,
                  'product_image', p.image_url
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order: result.rows[0] });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { items, total_amount, payment_mode, delivery_address, delivery_date } = req.body;

        if (!items || items.length === 0 || !total_amount) {
            return res.status(400).json({ error: 'Please provide order items and total amount' });
        }

        // Start transaction
        const client = await db.pool.connect();

        try {
            await client.query('BEGIN');

            // Create order
            const orderResult = await client.query(
                `INSERT INTO orders (user_id, total_amount, payment_mode, delivery_address, delivery_date) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [req.user.id, total_amount, payment_mode || 'COD', delivery_address, delivery_date]
            );

            const order = orderResult.rows[0];

            // Create order items
            for (const item of items) {
                await client.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
           VALUES ($1, $2, $3, $4)`,
                    [order.id, item.product_id, item.quantity, item.unit_price]
                );
            }

            await client.query('COMMIT');

            res.status(201).json({ order });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;

        let query = `
      SELECT o.*, 
             u.name as user_name,
             u.email as user_email,
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price,
                 'product_name', p.name
               )
             ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE 1=1
    `;

        const params = [];

        if (status) {
            params.push(status);
            query += ` AND o.status = $${params.length}`;
        }

        query += ' GROUP BY o.id, u.name, u.email ORDER BY o.created_at DESC';

        const result = await db.query(query, params);
        res.json({ orders: result.rows });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, delivery_date } = req.body;

        if (!status && !delivery_date) {
            return res.status(400).json({ error: 'Please provide status or delivery date' });
        }

        let query = 'UPDATE orders SET updated_at = NOW()';
        const params = [id];
        let paramCount = 1;

        if (status) {
            paramCount++;
            query += `, status = $${paramCount}`;
            params.push(status);
        }

        if (delivery_date) {
            paramCount++;
            query += `, delivery_date = $${paramCount}`;
            params.push(delivery_date);
        }

        query += ` WHERE id = $1 RETURNING *`;

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order: result.rows[0] });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Create order (Admin)
// @route   POST /api/admin/orders
// @access  Private/Admin
const createAdminOrder = async (req, res) => {
    try {
        const { user_id, items, total_amount, payment_mode, delivery_address, delivery_date, notes } = req.body;

        if (!items || items.length === 0 || !total_amount) {
            return res.status(400).json({ error: 'Please provide order items and total amount' });
        }

        // Start transaction
        const client = await db.pool.connect();

        try {
            await client.query('BEGIN');

            // Create order
            const orderResult = await client.query(
                `INSERT INTO orders (user_id, total_amount, payment_mode, delivery_address, delivery_date, status, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [user_id || null, total_amount, payment_mode || 'COD', delivery_address, delivery_date, 'confirmed', notes]
            );

            const order = orderResult.rows[0];

            // Create order items
            for (const item of items) {
                await client.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
           VALUES ($1, $2, $3, $4)`,
                    [order.id, item.product_id, item.quantity, item.unit_price]
                );
            }

            await client.query('COMMIT');

            res.status(201).json({ order });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Create admin order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getUserOrders,
    getOrder,
    createOrder,
    getAllOrders,
    updateOrderStatus,
    createAdminOrder
};
