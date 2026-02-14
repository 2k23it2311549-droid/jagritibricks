-- Create a secure function to check if the current user is an admin
-- SECURITY DEFINER allows this function to bypass RLS on the users table
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

-- Update Users Policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (is_admin());

-- Update Products Policies
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (is_admin());

-- Update Orders Policies
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (is_admin());

-- Update Order Items Policies (if any)
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (is_admin());

-- Update Site Content Policies
DROP POLICY IF EXISTS "Admin full access" ON public.site_content;
CREATE POLICY "Admin full access" ON public.site_content FOR ALL USING (is_admin());

-- Update Site Settings Policies
DROP POLICY IF EXISTS "Admin full access" ON public.site_settings;
CREATE POLICY "Admin full access" ON public.site_settings FOR ALL USING (is_admin());

-- Update Contact Messages Policies
DROP POLICY IF EXISTS "Admins can view messages" ON public.contact_messages;
CREATE POLICY "Admins can view messages" ON public.contact_messages FOR SELECT USING (is_admin());
