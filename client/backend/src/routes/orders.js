import express from 'express'
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
} from '../controllers/orderController.js'
import { adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/', createOrder)
router.get('/:id', getOrderById)

// Protected routes
router.get('/', getAllOrders) // Can filter by user_id in query
router.put('/:id/status', adminAuth, updateOrderStatus)

export default router
