-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to check admin role safely (Security Definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS for Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Admins can view all profiles') THEN
        -- Uses is_admin() to avoid infinite recursion
        CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (is_admin());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Trigger to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 2. PRODUCTS TABLE
-- ==========================================
-- Aligning with existing schema: id, name, category, brand, unit, price, stock, min_order_qty, quality_grade, description, image_url, created_at, updated_at
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cement', 'bricks', 'sariya', 'sand')),
  brand TEXT,
  unit TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0,
  min_order_qty INTEGER DEFAULT 1,
  quality_grade TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anyone can view products') THEN
        CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admins can manage products') THEN
        CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (is_admin());
    END IF;
END $$;

-- Seed Products (Upsert)
INSERT INTO public.products (name, category, brand, unit, price, stock, min_order_qty, quality_grade, description, image_url) VALUES
('Ambuja Cement', 'cement', 'Ambuja', 'Bag', 350, 1000, 50, 'PPC', 'High strength PPC cement for durable construction.', 'https://images.unsplash.com/photo-1590937276225-10597839ebe7?auto=format&fit=crop&q=80&w=600'),
('Red Clay Bricks', 'bricks', 'Jagriti', 'Piece', 8, 50000, 1000, 'Class A', 'Standard red clay bricks, kiln-fired for strength.', 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=600'),
('TMT Bar 12mm', 'sariya', 'Tata', 'Kg', 65, 5000, 100, 'Fe 550', 'Fe 550 grade TMT bar for superior reinforcement.', 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&q=80&w=600'),
('River Sand', 'sand', 'Local', 'CFT', 45, 2000, 100, 'Washed', 'Clean, washed river sand ideal for plastering and concrete.', 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600')
ON CONFLICT DO NOTHING; 

-- ==========================================
-- 3. ORDERS & ORDER ITEMS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  total_amount NUMERIC NOT NULL,
  payment_mode TEXT DEFAULT 'COD',
  delivery_address TEXT,
  delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view their own orders') THEN
        CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Admins can view all orders') THEN
        CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (is_admin());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Admins can update orders') THEN
        CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (is_admin());
    END IF;
END $$;

-- ==========================================
-- 4. SITE CONTENT (CMS)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- RLS for Site Content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_content' AND policyname = 'Public read access') THEN
        CREATE POLICY "Public read access" ON public.site_content FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_content' AND policyname = 'Admin full access') THEN
        CREATE POLICY "Admin full access" ON public.site_content FOR ALL USING (is_admin());
    END IF;
END $$;

-- Seed Site Content
INSERT INTO public.site_content (section, key, value, type) VALUES
-- Hero Section
('hero', 'title_1', 'Build Stronger.', 'text'),
('hero', 'subtitle_1', 'Premium construction materials delivered to your site.', 'text'),
('hero', 'image_1', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920', 'image'),

-- Announcement Bar
('announcement', 'text', 'Factory-Direct Pricing • Save up to 30%!', 'text'),
('announcement', 'promotion_ends_at', (NOW() + INTERVAL '7 days')::text, 'datetime'),

-- Contact Section
('contact', 'form_title', 'Get in Touch', 'text'),
('contact', 'form_subtitle', 'We are here to help you build your dream home.', 'text')

ON CONFLICT (section, key) DO UPDATE 
SET value = EXCLUDED.value, type = EXCLUDED.type;

-- ==========================================
-- 5. SITE SETTINGS (Global Config)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id SERIAL PRIMARY KEY,
  phone TEXT DEFAULT '+91 9876543210',
  email TEXT DEFAULT 'info@jagritibricks.com',
  address TEXT DEFAULT 'Jagriti Vihar, Meerut, Uttar Pradesh',
  facebook_url TEXT DEFAULT 'https://facebook.com',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  twitter_url TEXT DEFAULT 'https://twitter.com',
  whatsapp_number TEXT DEFAULT '919876543210',
  delivery_fee NUMERIC DEFAULT 0,
  free_shipping_threshold NUMERIC DEFAULT 5000,
  announcement_text TEXT,
  show_announcement BOOLEAN DEFAULT TRUE,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure email column exists (it was missing in schema check)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'email') THEN
        ALTER TABLE public.site_settings ADD COLUMN email TEXT DEFAULT 'info@jagritibricks.com';
    END IF;
END $$;

-- RLS for Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Public read access') THEN
        CREATE POLICY "Public read access" ON public.site_settings FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Admin full access') THEN
        CREATE POLICY "Admin full access" ON public.site_settings FOR ALL USING (is_admin());
    END IF;
END $$;

-- Seed Site Settings (Ensure exactly one row exists)
INSERT INTO public.site_settings (id, phone, email, address, facebook_url, instagram_url, twitter_url, whatsapp_number, delivery_fee, free_shipping_threshold, maintenance_mode)
VALUES (1, '+91 9876543210', 'info@jagritibricks.com', 'Jagriti Vihar, Meerut, Uttar Pradesh', 'https://facebook.com', 'https://instagram.com', 'https://twitter.com', '919876543210', 50, 5000, FALSE)
ON CONFLICT (id) DO UPDATE 
SET phone = EXCLUDED.phone, 
    email = EXCLUDED.email, 
    address = EXCLUDED.address,
    facebook_url = EXCLUDED.facebook_url,
    instagram_url = EXCLUDED.instagram_url,
    twitter_url = EXCLUDED.twitter_url,
    whatsapp_number = EXCLUDED.whatsapp_number,
    delivery_fee = EXCLUDED.delivery_fee,
    free_shipping_threshold = EXCLUDED.free_shipping_threshold;

-- ==========================================
-- 6. CONTACT MESSAGES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Contact Messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Admins can view messages') THEN
        CREATE POLICY "Admins can view messages" ON public.contact_messages FOR SELECT USING (is_admin());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Public can insert messages') THEN
        CREATE POLICY "Public can insert messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
    END IF;
END $$;
