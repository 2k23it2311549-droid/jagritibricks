const db = require('../config/database');

// @desc    Get all site content
// @route   GET /api/site-content
// @access  Public
const getAllContent = async (req, res) => {
    try {
        const { section } = req.query;

        let query = 'SELECT * FROM site_content WHERE 1=1';
        const params = [];

        if (section) {
            params.push(section);
            query += ` AND section = $${params.length}`;
        }

        query += ' ORDER BY section, key';

        const result = await db.query(query, params);
        res.json({ content: result.rows });
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update site content
// @route   PUT /api/site-content/:id
// @access  Private/Admin
const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;

        const result = await db.query(
            `UPDATE site_content SET value = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [value, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.json({ content: result.rows[0] });
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM site_settings LIMIT 1');

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Settings not found' });
        }

        res.json({ settings: result.rows[0] });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const {
            phone,
            email,
            address,
            facebook_url,
            instagram_url,
            twitter_url,
            whatsapp_number,
            delivery_fee,
            free_shipping_threshold,
            announcement_text,
            show_announcement,
            maintenance_mode
        } = req.body;

        const result = await db.query(
            `UPDATE site_settings 
       SET phone = COALESCE($1, phone),
           email = COALESCE($2, email),
           address = COALESCE($3, address),
           facebook_url = COALESCE($4, facebook_url),
           instagram_url = COALESCE($5, instagram_url),
           twitter_url = COALESCE($6, twitter_url),
           whatsapp_number = COALESCE($7, whatsapp_number),
           delivery_fee = COALESCE($8, delivery_fee),
           free_shipping_threshold = COALESCE($9, free_shipping_threshold),
           announcement_text = COALESCE($10, announcement_text),
           show_announcement = COALESCE($11, show_announcement),
           maintenance_mode = COALESCE($12, maintenance_mode),
           updated_at = NOW()
       WHERE id = 1 RETURNING *`,
            [phone, email, address, facebook_url, instagram_url, twitter_url, whatsapp_number,
                delivery_fee, free_shipping_threshold, announcement_text, show_announcement, maintenance_mode]
        );

        res.json({ settings: result.rows[0] });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllContent,
    updateContent,
    getSettings,
    updateSettings
};
