import express from 'express'
import { getDashboardStats, adminLogin } from '../controllers/adminController.js'
import { adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Public admin login
router.post('/login', adminLogin)

// Protected admin routes
router.get('/dashboard', adminAuth, getDashboardStats)

export default router
