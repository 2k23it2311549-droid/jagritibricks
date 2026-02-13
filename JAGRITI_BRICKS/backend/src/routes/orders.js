const express = require('express');
const router = express.Router();
const { getUserOrders, getOrder, createOrder } = require('../controllers/ordersController');
const { authMiddleware } = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

router.get('/', getUserOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);

module.exports = router;
