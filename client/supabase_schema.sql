-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS Table (SYNCED WITH AUTH.USERS VIA TRIGGERS OR MANAGED MANUALLY)
-- Note: In Supabase, usually we use public.profiles linked to auth.users. 
-- Following PRD 'users' table requirement, but mapping it to handle Supabase Auth.

create table public.users (
  id uuid references auth.users not null primary key,
  name text,
  phone text,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null, -- 'cement', 'bricks', 'sariya', 'sand'
  unit text not null,
  price numeric not null,
  stock integer default 0,
  min_order_quantity integer default 1,
  quality_grade text,
  description text,
  image_url text, -- URL to Supabase Storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  status text default 'pending' check (status in ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  total_amount numeric not null,
  payment_mode text default 'COD',
  delivery_address text,
  delivery_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS Table
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity numeric not null,
  unit_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Users
alter table public.users enable row level security;
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.users for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

-- Products
alter table public.products enable row level security;
create policy "Anyone can view products" on public.products for select using (true);
create policy "Admins can insert products" on public.products for insert using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Admins can update products" on public.products for update using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete products" on public.products for delete using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Orders
alter table public.orders enable row level security;
create policy "Users can view their own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can update orders" on public.orders for update using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Order Items
alter table public.order_items enable row level security;
create policy "Users can view their own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = public.order_items.order_id and user_id = auth.uid())
);
create policy "Admins can view all order items" on public.order_items for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Users can insert order items" on public.order_items for insert with check (
   exists (select 1 from public.orders where id = public.order_items.order_id and user_id = auth.uid())
);

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA (Optional)
insert into public.products (name, category, unit, price, description, image_url) values
('Ambuja Cement', 'cement', 'Bag', 350, 'High strength PPC cement', 'https://placehold.co/400'),
('Red Bricks', 'bricks', 'Piece', 8, 'Standard red clay bricks', 'https://placehold.co/400'),
('TMT Bar 10mm', 'sariya', 'Kg', 65, 'Fe 550 grade TMT bar', 'https://placehold.co/400'),
('River Sand', 'sand', 'CFT', 45, 'Clean river sand for plastering', 'https://placehold.co/400');
