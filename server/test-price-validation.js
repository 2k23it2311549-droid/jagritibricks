const API_URL = 'http://localhost:5000/api'

// Node 18+ has global fetch. No import needed.

async function testPriceValidation() {
    console.log('🚀 Starting Backend Price Validation Test...')

    try {
        // 1. Get a valid product
        console.log('\n📦 Fetching products...')
        const productsRes = await fetch(`${API_URL}/products`)
        const productsData = await productsRes.json()

        if (!productsData.success || !productsData.data || productsData.data.length === 0) {
            console.error('❌ Failed to fetch products or no products found.')
            // If connection refused, fetch throws before here.
            process.exit(1)
        }

        const product = productsData.data[0]
        console.log(`✅ Found product: ${product.name} (ID: ${product.id})`)
        console.log(`   Real Price: ₹${product.price}`)

        // 2. Attempt to create order with TAMPERED price
        const TAMPERED_PRICE = 1 // 1 Rupee!
        console.log(`\n🕵️ Attempting to place order with tampered price: ₹${TAMPERED_PRICE}...`)

        const orderPayload = {
            user_id: null,
            cart: [
                {
                    id: product.id,
                    price: TAMPERED_PRICE, // Malicious price
                    quantity: 1
                }
            ],
            delivery_address: {
                name: "Security Tester",
                phone: "0000000000",
                address: "Test Lab",
                city: "Cyber City",
                state: "Secure State",
                pincode: "000000"
            },
            payment_mode: "cod",
            notes: "Security Test Order"
        }

        const orderRes = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        })

        const orderData = await orderRes.json()

        if (!orderData.success) {
            console.error('❌ Order creation failed:', orderData.error)
            process.exit(1)
        }

        const createdOrder = orderData.data
        console.log(`✅ Order created! ID: ${createdOrder.id}`)
        console.log(`   Order Total Amount: ₹${createdOrder.total_amount}`)

        // 3. Verify the result
        // order total should be product price * quantity (which is 1)
        if (createdOrder.total_amount === product.price) {
            console.log('\n✨ SUCCESS: Backend ignored client price and used database price!')
            console.log(`   Expected: ₹${product.price}`)
            console.log(`   Actual:   ₹${createdOrder.total_amount}`)
        } else {
            console.error('\n FAILURE: Price mismatch!')
            console.error(`   Expected: ₹${product.price}`)
            console.error(`   Actual:   ₹${createdOrder.total_amount}`)
            process.exit(1)
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.message)
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
            console.error('   Hint: Is the backend server running on port 5000?')
        }
    }
}

testPriceValidation()
