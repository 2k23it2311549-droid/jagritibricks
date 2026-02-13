const db = require('../config/database');

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Please provide name, email, and message' });
        }

        const result = await db.query(
            `INSERT INTO contact_messages (name, email, phone, message) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, phone, message]
        );

        res.status(201).json({
            message: 'Contact message submitted successfully',
            contact: result.rows[0]
        });
    } catch (error) {
        console.error('Submit contact error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get all contact messages
// @route   GET /api/admin/messages
// @access  Private/Admin
const getAllMessages = async (req, res) => {
    try {
        const { status } = req.query;

        let query = 'SELECT * FROM contact_messages WHERE 1=1';
        const params = [];

        if (status) {
            params.push(status);
            query += ` AND status = $${params.length}`;
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json({ messages: result.rows });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update message status
// @route   PUT /api/admin/messages/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Please provide status' });
        }

        const result = await db.query(
            `UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json({ message: result.rows[0] });
    } catch (error) {
        console.error('Update message error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    submitContact,
    getAllMessages,
    updateMessageStatus
};
