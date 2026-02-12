import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import adminRouter from './routes/admin.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
})

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'JagritiBricks API Server',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            orders: '/api/orders',
            admin: '/api/admin'
        }
    })
})

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal server error', message: err.message })
})

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
})
