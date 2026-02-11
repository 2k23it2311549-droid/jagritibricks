
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load env vars
const envPath = join(__dirname, '.env')
const envConfig = dotenv.parse(fs.readFileSync(envPath))

const supabaseUrl = envConfig.VITE_SUPABASE_URL
const supabaseKey = envConfig.VITE_SUPABASE_ANON_KEY // Actually need SERVICE_ROLE key to bypass email confirmation if possible? 
// But I don't have service role key in .env usually... check.
// If I use anon key, I need signUp.

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
    console.log('Creating admin user...')
    const email = 'admin@jagritibricks.com'
    const password = 'admin123'

    try {
        // 1. Sign Up
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: 'System Admin',
                    role: 'admin' // Helper metadata
                }
                // NOTE: If email confirmation is on, this might hang. 
                // But for standard Supabase setup, it might just allow login or require confirm.
                // Admin usually needs to be auto-confirmed.
            }
        })

        if (error) {
            console.error('Error creating auth user:', error.message)
            // If user already exists, we good.
        } else {
            console.log('Auth user created:', data.user?.id)
        }

        // 2. Ensure public.users entry has 'admin' role
        // This usually happens via trigger. Let's update it manually if possible (Row Level Security might block update if not logged in as that user).

        // BETTER APPROACH:
        // Login as the user we just created (or tried to)
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (loginError) {
            console.error('Login failed (maybe email not confirmed?):', loginError.message)
            return
        }

        console.log('Logged in as admin. Updating role...')

        // Update own role? RLS probably prevents simple users from promoting themselves.
        // But I made a policy "Admins can update all profiles".
        // AND "Users can update own data".
        // Does "Users can update own data" allow changing ROLE?
        // Usually NO.

        // I might need to run a SQL command via the tool to update the role, since I am the AI!
        // I can use `execute_sql` tool for that.

        console.log('User ID to promote:', loginData.user.id)

    } catch (err) {
        console.error('Unexpected error:', err)
    }
}

createAdmin()
