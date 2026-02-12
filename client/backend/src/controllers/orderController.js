import { supabase } from '../config/supabase.js'

// Create new order
// Create new order
export const createOrder = async (req, res) => {
    try {
        const { user_id, cart, delivery_address, payment_mode, notes } = req.body

        // Validate cart
        if (!cart || cart.length === 0) {
            return res.status(400).json({ success: false, error: 'Cart is empty' })
        }

        // 1. Get product IDs from cart
        const productIds = cart.map(item => item.id)

        // 2. Fetch current prices from database
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, price')
            .in('id', productIds)

        if (productsError) throw productsError

        // 3. Create price map and validate all products exist
        const priceMap = {}
        products.forEach(p => {
            priceMap[p.id] = p.price
        })

        // Check if all items in cart exist in database
        const missingProducts = cart.filter(item => !priceMap[item.id])
        if (missingProducts.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Some products are no longer available: ${missingProducts.map(i => i.id).join(', ')}`
            })
        }

        // 4. Recalculate total using database prices
        let total_amount = 0
        const orderItemsData = cart.map(item => {
            const price = priceMap[item.id]
            total_amount += price * item.quantity
            return {
                product_id: item.id,
                quantity: item.quantity,
                unit_price: price // Use verified price
            }
        })

        // 5. Create order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: user_id || null,
                status: 'placed',
                total_amount,
                delivery_address,
                payment_mode: payment_mode || 'cod',
                notes
            }])
            .select()
            .single()

        if (orderError) throw orderError

        // 6. Create order items with order_id
        const orderItems = orderItemsData.map(item => ({
            ...item,
            order_id: orderData.id
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) throw itemsError

        res.status(201).json({ success: true, data: orderData })
    } catch (error) {
        console.error('Error creating order:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Get all orders (with optional user filter)
export const getAllOrders = async (req, res) => {
    try {
        const { user_id, status } = req.query

        let query = supabase
            .from('orders')
            .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
            .order('created_at', { ascending: false })

        if (user_id) {
            query = query.eq('user_id', user_id)
        }

        if (status) {
            query = query.eq('status', status)
        }

        const { data, error } = await query

        if (error) throw error

        res.json({ success: true, data })
    } catch (error) {
        console.error('Error fetching orders:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params

        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
            .eq('id', id)
            .single()

        if (error) throw error

        if (!data) {
            return res.status(404).json({ success: false, error: 'Order not found' })
        }

        res.json({ success: true, data })
    } catch (error) {
        console.error('Error fetching order:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const validStatuses = ['placed', 'confirmed', 'dispatched', 'delivered', 'completed', 'cancelled']

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' })
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, data })
    } catch (error) {
        console.error('Error updating order status:', error)
        res.status(500).json({ success: false, error: error.message })
    }
}
