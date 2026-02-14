-- 1. Create simple_users table
CREATE TABLE IF NOT EXISTS public.simple_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Storing as plain text/simple hash per request
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS but allow public access (weak security as requested)
ALTER TABLE public.simple_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to simple_users" 
ON public.simple_users FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. Update orders table to support simple_users
-- Add simple_user_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'simple_user_id') THEN
        ALTER TABLE public.orders ADD COLUMN simple_user_id UUID REFERENCES public.simple_users(id);
    END IF;
END $$;

-- Make user_id nullable if it's strictly linked to auth.users
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- disable RLS on orders to allow simple access
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
-- OR update policies to allow access based on simple_user_id (opting for disable for simplicity/speed as requested)

-- 4. Update order_items RLS
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
