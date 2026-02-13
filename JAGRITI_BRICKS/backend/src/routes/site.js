const express = require('express');
const router = express.Router();
const { getAllContent, updateContent, getSettings, updateSettings } = require('../controllers/siteController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.get('/content', getAllContent);
router.get('/', getSettings);

// Admin only routes
router.put('/content/:id', authMiddleware, adminMiddleware, updateContent);
router.put('/', authMiddleware, adminMiddleware, updateSettings);

module.exports = router;
