# Frontend Files Requiring Manual Updates

The following files still have Supabase imports and need to be updated to use the new API client. They won't cause errors on load anymore since we fixed the critical imports, but their data fetching functions won't work until the backend is connected to a database.

## Files Already Fixed ✅

1. **Hero.jsx** - Updated to use `api.get('/site/content?section=hero')`
2. **AnnouncementBar.jsx** - Updated to use `api.get('/site/content?section=announcement')`  
3. **Products.jsx** - Updated to use `api.get('/products?category=x&sortBy=y')`

## Files That Need Updates ⚠️

### 1. ProductDetails.jsx
**Line 3**: Remove `import { supabase } from '../lib/supabaseClient'`  
**Add**: `import api from '../lib/api'`

**Update `fetchProduct` function (lines 20-53):**
```javascript
const fetchProduct = async () => {
    setLoading(true)
    try {
        // Fetch main product
        const { data } = await api.get(`/products/${id}`)
        
        if (data && data.product) {
            setProduct(data.product)
            setQuantity(data.product.min_order_quantity || 1)

            // Fetch related products
            const { data: relatedData } = await api.get(`/products?category=${data.product.category}&limit=4`)
            if (relatedData && relatedData.products) {
                setRelatedProducts(relatedData.products.filter(p => p.id !== id))
            }
        }
    } catch (error) {
        console.error('Error fetching product:', error)
    } finally {
        setLoading(false)
    }
}
```

### 2. Orders.jsx
**Line 3**: Remove `import { supabase } from '../lib/supabaseClient'`  
**Add**: `import api from '../lib/api'` and `import { useAuth } from '../context/AuthContext'`

**Update entire component:**
```javascript
const { user } = useAuth()

// Update fetchOrders (lines 15-46):
const fetchOrders = async () => {
    try {
        if (!user) {
            navigate('/login')
            return
        }

        const { data } = await api.get('/orders')
        setOrders(data.orders || [])
    } catch (error) {
        console.error('Error fetching orders:', error)
    } finally {
        setLoading(false)
    }
}
```

### 3. Contact.jsx
**Line 3**: Remove `import { supabase } from '../lib/supabaseClient'`  
**Add**: `import api from '../lib/api'`

**Update `handleSubmit` function (lines 21-47):**
```javascript
const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
        await api.post('/contact', {
            name: formData.name,
            phone: formData.phone,
            message: formData.message
        })

        setStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
        console.error('Error submitting form:', error)
        setStatus('error')
    } finally {
        setLoading(false)
    }
}
```

### 4. Checkout.jsx
**Line 5**: Remove `import { supabase } from '../lib/supabaseClient'`  
**Add**: `import api from '../lib/api'` and `import { useAuth } from '../context/AuthContext'`

**Update `handlePlaceOrder` function (lines 44-102):**
``

`javascript
const { user } = useAuth()

const handlePlaceOrder = async () => {
    setLoading(true)
    try {
        const orderData = {
            delivery_address: {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
            },
            notes: formData.notes,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            }))
        }

        const { data } = await api.post('/orders', orderData)
        
        if (data && data.order) {
            setOrderId(data.order.id)
            setOrderPlaced(true)
            clearCart()
        }
    } catch (error) {
        console.error('Error placing order:', error)
        alert('Failed to place order. Please try again.')
    } finally {
        setLoading(false)
    }
}
```

## Current Status

✅ The frontend will now load without errors  
⚠️ Data fetching won't work until:
  1. Backend is connected to a PostgreSQL database
  2. The above files are manually updated
  3. Backend server is running

## Next Steps

1. Set up PostgreSQL database (local or Railway)
2. Run `backend/database/schema.sql` to create tables
3. Start backend server: `cd backend && npm run dev`
4. Update the 4 files above following the guide
5. Test the full application
