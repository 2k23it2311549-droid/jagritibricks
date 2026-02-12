const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
    console.log('🚀 Starting API Verification...');

    try {
        // 1. Test Products API
        console.log('\n📦 Testing GET /products...');
        const productsRes = await axios.get(`${API_URL}/products`);
        if (productsRes.data.success) {
            console.log(`✅ Success! Found ${productsRes.data.data.length} products.`);
        } else {
            console.error('❌ Failed to fetch products');
        }

        // 2. Test Create Order
        console.log('\n🛍️ Testing POST /orders...');
        const orderData = {
            user_id: null,
            cart: [
                { id: 'placeholder-id', price: 100, quantity: 2 } // This will fail if foreign keys are enforced and ID doesn't exist
            ],
            delivery_address: {
                name: "Test User",
                phone: "1234567890",
                address: "Test Address",
                city: "Test City",
                state: "Test State",
                pincode: "123456"
            },
            payment_mode: "cod",
            total_amount: 200
        };

        // We expect this to fail if we don't have real product IDs. 
        // For a real test, we should fetch a product first.
        if (productsRes.data.data.length > 0) {
            const product = productsRes.data.data[0];
            orderData.cart = [{ id: product.id, price: product.price, quantity: 1 }];
            orderData.total_amount = product.price;

            try {
                const orderRes = await axios.post(`${API_URL}/orders`, orderData);
                if (orderRes.data.success) {
                    console.log(`✅ Success! Created Order #${orderRes.data.data.id}`);
                }
            } catch (err) {
                console.error('❌ Failed to create order:', err.response?.data || err.message);
            }
        } else {
            console.log('⚠️ Skipping order test: No products found to purchase.');
        }

        // 3. Test Admin Login
        console.log('\n🔐 Testing POST /admin/login...');
        try {
            const loginRes = await axios.post(`${API_URL}/admin/login`, {
                username: 'admin',
                password: 'admin@123'
            });

            if (loginRes.data.success) {
                console.log('✅ Success! Admin logged in.');
                const token = loginRes.data.data.token;

                // 4. Test Protected Route (Dashboard)
                console.log('\n📊 Testing GET /admin/dashboard (Protected)...');
                const dashboardRes = await axios.get(`${API_URL}/admin/dashboard`, {
                    headers: { 'Authorization': `Basic ${token}` }
                });

                if (dashboardRes.data.success) {
                    console.log('✅ Success! Accessed dashboard stats.');
                    console.log('   Stats:', dashboardRes.data.data);
                }

            }
        } catch (err) {
            console.error('❌ Failed admin login:', err.response?.data || err.message);
        }

    } catch (error) {
        console.error('❌ API Test Failed (Global Error):', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   Hint: Is the backend server running on port 5000?');
        }
    }
}

testAPI();
