import dotenv from 'dotenv'

dotenv.config()

// Simple admin authentication middleware
export const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized - No credentials provided' })
    }

    try {
        const base64Credentials = authHeader.split(' ')[1]
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
        const [username, password] = credentials.split(':')

        const adminUsername = process.env.ADMIN_USERNAME || 'admin'
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123'

        if (username === adminUsername && password === adminPassword) {
            next()
        } else {
            res.status(401).json({ error: 'Unauthorized - Invalid credentials' })
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized - Invalid authorization header' })
    }
}

// Alternative: Token-based admin auth (for future enhancement)
export const tokenAuth = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ error: 'No token provided' })
    }

    // TODO: Verify token with Supabase Auth
    // For now, just pass through
    next()
}
