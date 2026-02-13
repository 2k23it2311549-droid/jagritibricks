const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

// Public contact form submission
router.post('/', submitContact);

module.exports = router;
