import express from 'express'
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js'
import { adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Admin routes (protected)
router.post('/', adminAuth, createProduct)
router.put('/:id', adminAuth, updateProduct)
router.delete('/:id', adminAuth, deleteProduct)

export default router
