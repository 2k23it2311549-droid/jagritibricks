const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Apply admin middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Import controllers
const { getAllOrders, updateOrderStatus } = require('../controllers/ordersController');
const { getAllMessages, updateMessageStatus } = require('../controllers/contactController');

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.post('/orders', require('../controllers/ordersController').createAdminOrder);

// Messages management
router.get('/messages', getAllMessages);
router.put('/messages/:id', updateMessageStatus);

// Users management
router.get('/users', async (req, res) => {
    try {
        const db = require('../config/database');
        const { role } = req.query;

        // Base query with order count
        let query = `
            SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at, 
                   COUNT(o.id)::int as orders_count
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
        `;

        const params = [];

        if (role) {
            query += ' WHERE u.role = $1';
            params.push(role);
        }

        query += ' GROUP BY u.id ORDER BY u.created_at DESC';

        const result = await db.query(query, params);
        res.json({ users: result.rows });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const db = require('../config/database');
        const result = await db.query(
            'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, phone, role',
            [role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Settings Management
router.get('/settings', async (req, res) => {
    try {
        const db = require('../config/database');
        const result = await db.query('SELECT * FROM site_settings WHERE id = 1');
        res.json(result.rows[0] || {});
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/settings', async (req, res) => {
    try {
        const db = require('../config/database');
        const {
            phone, email, address, facebook_url, instagram_url, twitter_url,
            whatsapp_number, delivery_fee, free_shipping_threshold,
            announcement_text, show_announcement, maintenance_mode
        } = req.body;

        const query = `
            INSERT INTO site_settings (
                id, phone, email, address, facebook_url, instagram_url, twitter_url, 
                whatsapp_number, delivery_fee, free_shipping_threshold, 
                announcement_text, show_announcement, maintenance_mode, updated_at
            ) VALUES (
                1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                phone = EXCLUDED.phone,
                email = EXCLUDED.email,
                address = EXCLUDED.address,
                facebook_url = EXCLUDED.facebook_url,
                instagram_url = EXCLUDED.instagram_url,
                twitter_url = EXCLUDED.twitter_url,
                whatsapp_number = EXCLUDED.whatsapp_number,
                delivery_fee = EXCLUDED.delivery_fee,
                free_shipping_threshold = EXCLUDED.free_shipping_threshold,
                announcement_text = EXCLUDED.announcement_text,
                show_announcement = EXCLUDED.show_announcement,
                maintenance_mode = EXCLUDED.maintenance_mode,
                updated_at = NOW()
            RETURNING *
        `;

        const values = [
            phone, email, address, facebook_url, instagram_url, twitter_url,
            whatsapp_number, delivery_fee, free_shipping_threshold,
            announcement_text, show_announcement, maintenance_mode
        ];

        const result = await db.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Site Content Management
router.get('/content', async (req, res) => {
    try {
        const db = require('../config/database');
        const result = await db.query('SELECT * FROM site_content ORDER BY key');
        res.json(result.rows);
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/content/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;
        const db = require('../config/database');

        const result = await db.query(
            'UPDATE site_content SET value = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [value, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Dashboard stats
// Dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const db = require('../config/database');

        // 1. Basic Counts
        const [usersCount, productsCount, ordersCount, messagesCount] = await Promise.all([
            db.query('SELECT COUNT(*) as count FROM users'),
            db.query('SELECT COUNT(*) as count FROM products'),
            db.query('SELECT COUNT(*) as count FROM orders'),
            db.query('SELECT COUNT(*) as count FROM contact_messages WHERE status = $1', ['new'])
        ]);

        // 2. Revenue
        const revenueResult = await db.query('SELECT SUM(total_amount) as total FROM orders WHERE status != $1', ['cancelled']);
        const totalRevenue = parseFloat(revenueResult.rows[0].total || 0);

        // 3. Recent Orders
        const recentOrders = await db.query(
            'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5'
        );

        // 4. Chart Data (Last 7 Days)
        const chartQuery = `
            SELECT 
                TO_CHAR(created_at, 'YYYY-MM-DD') as date,
                COUNT(*) as orders,
                SUM(total_amount) as revenue
            FROM orders
            WHERE created_at >= NOW() - INTERVAL '7 days'
            AND status != 'cancelled'
            GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
            ORDER BY date ASC
        `;
        const chartResult = await db.query(chartQuery);

        // Fill in missing dates
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const chartData = last7Days.map(date => {
            const dayData = chartResult.rows.find(r => r.date === date);
            return {
                name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                orders: parseInt(dayData?.orders || 0),
                revenue: parseFloat(dayData?.revenue || 0)
            };
        });

        // 5. Top Products
        const topProductsQuery = `
            SELECT p.name, SUM(oi.quantity) as count
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.name
            ORDER BY count DESC
            LIMIT 5
        `;
        const topProductsResult = await db.query(topProductsQuery);

        res.json({
            stats: {
                totalUsers: parseInt(usersCount.rows[0].count),
                totalProducts: parseInt(productsCount.rows[0].count),
                totalOrders: parseInt(ordersCount.rows[0].count),
                newMessages: parseInt(messagesCount.rows[0].count),
                totalRevenue,
                recentOrders: recentOrders.rows,
                chartData,
                topProducts: topProductsResult.rows
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
