const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const products = [
    {
        name: "ACC Cement 50kg",
        category: "cement",
        brand: "ACC",
        unit: "Bag (50kg)",
        price: 385.00,
        stock: 5000,
        min_order_qty: 10,
        quality_grade: "Premium Grade",
        description: "High-quality ACC cement for strong construction. Perfect for residential and commercial projects.",
        image_url: "https://placehold.co/600x400/e63946/ffffff?text=ACC+Cement"
    },
    {
        name: "Ultratech Cement 50kg",
        category: "cement",
        brand: "Ultratech",
        unit: "Bag (50kg)",
        price: 375.00,
        stock: 4500,
        min_order_qty: 10,
        quality_grade: "Premium Grade",
        description: "Trusted Ultratech cement with superior binding strength.",
        image_url: "https://placehold.co/600x400/e63946/ffffff?text=Ultratech+Cement"
    },
    {
        name: "Red Clay Bricks",
        category: "bricks",
        brand: "JagritiBricks",
        unit: "Per piece",
        price: 8.00,
        stock: 100000,
        min_order_qty: 500,
        quality_grade: "First Class",
        description: "Factory-direct red clay bricks. Strong, uniform, and affordable. Perfect for walls and construction.",
        image_url: "https://placehold.co/600x400/d4573b/ffffff?text=Red+Bricks"
    },
    {
        name: "Fly Ash Bricks",
        category: "bricks",
        brand: "JagritiBricks",
        unit: "Per piece",
        price: 6.50,
        stock: 75000,
        min_order_qty: 500,
        quality_grade: "Premium",
        description: "Eco-friendly fly ash bricks with excellent strength and thermal insulation.",
        image_url: "https://placehold.co/600x400/8b7355/ffffff?text=Fly+Ash+Bricks"
    },
    {
        name: "TMT Steel Sariya 8mm",
        category: "sariya",
        brand: "Tata Steel",
        unit: "Kg",
        price: 65.00,
        stock: 10000,
        min_order_qty: 100,
        quality_grade: "Fe 550D",
        description: "High-strength TMT steel bars for reinforced concrete construction.",
        image_url: "https://placehold.co/600x400/5a5a5a/ffffff?text=TMT+8mm"
    },
    {
        name: "TMT Steel Sariya 12mm",
        category: "sariya",
        brand: "Tata Steel",
        unit: "Kg",
        price: 63.50,
        stock: 8000,
        min_order_qty: 100,
        quality_grade: "Fe 550D",
        description: "12mm TMT bars for pillars and beams. Corrosion resistant.",
        image_url: "https://placehold.co/600x400/5a5a5a/ffffff?text=TMT+12mm"
    },
    {
        name: "M-Sand (Manufactured Sand)",
        category: "sand",
        brand: "Local Supplier",
        unit: "Trolley",
        price: 2500.00,
        stock: 100,
        min_order_qty: 1,
        quality_grade: "Grade-I",
        description: "High-quality manufactured sand for construction. One trolley = ~100 cubic feet.",
        image_url: "https://placehold.co/600x400/c2b280/ffffff?text=M-Sand"
    },
    {
        name: "River Sand",
        category: "sand",
        brand: "Local Supplier",
        unit: "Cubic Feet",
        price: 45.00,
        stock: 5000,
        min_order_qty: 50,
        quality_grade: "Natural",
        description: "Natural river sand for plastering and masonry work.",
        image_url: "https://placehold.co/600x400/daa520/ffffff?text=River+Sand"
    },
    {
        name: "Ambuja Cement",
        category: "cement",
        brand: "Ambuja",
        unit: "Bag",
        price: 350.00,
        stock: 1000,
        min_order_qty: 50,
        quality_grade: "PPC",
        description: "High strength PPC cement for durable construction.",
        image_url: "https://images.unsplash.com/photo-1590937276225-10597839ebe7?auto=format&fit=crop&q=80&w=600"
    },
    {
        name: "Red Clay Bricks",
        category: "bricks",
        brand: "Jagriti",
        unit: "Piece",
        price: 8.00,
        stock: 50000,
        min_order_qty: 1000,
        quality_grade: "Class A",
        description: "Standard red clay bricks, kiln-fired for strength.",
        image_url: "https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=600"
    },
    {
        name: "TMT Bar 12mm",
        category: "sariya",
        brand: "Tata",
        unit: "Kg",
        price: 65.00,
        stock: 5000,
        min_order_qty: 100,
        quality_grade: "Fe 550",
        description: "Fe 550 grade TMT bar for superior reinforcement.",
        image_url: "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&q=80&w=600"
    },
    {
        name: "River Sand",
        category: "sand",
        brand: "Local",
        unit: "CFT",
        price: 45.00,
        stock: 2000,
        min_order_qty: 100,
        quality_grade: "Washed",
        description: "Clean, washed river sand ideal for plastering and concrete.",
        image_url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600"
    }
];

async function seed() {
    try {
        console.log('🌱 Seeding database...');

        // Check if products exist
        const { rows } = await pool.query('SELECT count(*) FROM products');
        const count = parseInt(rows[0].count);

        if (count > 0) {
            console.log(`⚠️  Database already has ${count} products. Skipping product seed.`);
        } else {
            console.log('📦 Inserting products...');
            for (const p of products) {
                await pool.query(
                    `INSERT INTO products (name, category, brand, unit, price, stock, min_order_qty, quality_grade, description, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    [p.name, p.category, p.brand, p.unit, p.price, p.stock, p.min_order_qty, p.quality_grade, p.description, p.image_url]
                );
            }
            console.log(`✅ Inserted ${products.length} products`);
        }

        console.log('✨ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
