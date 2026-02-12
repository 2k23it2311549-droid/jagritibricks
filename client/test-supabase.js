import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log("Testing Supabase Connection...")
console.log("URL:", supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    try {
        const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true })
        if (error) {
            console.error("Connection Error:", error)
        } else {
            console.log("Connection Successful! Status:", 200)
        }
    } catch (e) {
        console.error("Exception:", e)
    }
}

testConnection()
