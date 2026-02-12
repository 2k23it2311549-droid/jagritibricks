import { supabase } from '../config/supabase.js'

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Get total orders
        const { count: totalOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })

        // Get total revenue
        const { data: orders } = await supabase
            .from('orders')
            .select('total_amount')

        const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0

        // Get total products
        const { count: totalProducts } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })

        // Get recent orders (last 10)
        const { data: recentOrders } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (
          *,
          products (name)
        )
      `)
            .order('created_at', { ascending: false })
            .limit(10)

        // Get orders by status
        const { data: ordersByStatus } = await supabase
            .from('orders')
            .select('status')

        const statusCounts = ordersByStatus?.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1
            return acc
        }, {}) || {}

        res.json({
            success: true,
            data: {
                totalOrders: totalOrders || 0,
                totalRevenue: totalRevenue.toFixed(2),
                totalProducts: totalProducts || 0,
                recentOrders: recentOrders || [],
                ordersByStatus: statusCounts
            }
        })
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Admin login (simple auth)
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body

        const adminUsername = process.env.ADMIN_USERNAME || 'admin'
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123'

        if (username === adminUsername && password === adminPassword) {
            // Create a simple token (in production, use JWT)
            const token = Buffer.from(`${username}:${password}`).toString('base64')

            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        username: adminUsername,
                        role: 'admin'
                    }
                }
            })
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' })
        }
    } catch (error) {
        console.error('Error during admin login:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
