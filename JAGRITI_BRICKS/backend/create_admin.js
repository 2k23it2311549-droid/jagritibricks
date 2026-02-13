const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load .env from backend root

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // Check if admin exists
            const existing = await client.query("SELECT * FROM users WHERE email = 'admin@jagritibricks.com'");
            if (existing.rows.length > 0) {
                console.log('Admin user already exists.');
                // Update password just in case
                await client.query("UPDATE users SET password = $1, role = 'admin' WHERE email = 'admin@jagritibricks.com'", [hashedPassword]);
                console.log('Admin password updated.');
            } else {
                await client.query(
                    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
                    ['Admin User', 'admin@jagritibricks.com', hashedPassword, 'admin']
                );
                console.log('Admin user created successfully.');
            }
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await pool.end();
    }
}

createAdmin();
