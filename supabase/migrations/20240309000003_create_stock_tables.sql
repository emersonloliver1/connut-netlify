-- Create products table
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users not null,
    code text not null,
    name text not null,
    description text,
    category text not null,
    unit text not null,
    min_stock numeric(10,2) not null default 0,
    current_stock numeric(10,2) not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(user_id, code)
);

-- Create stock_movements table
create table if not exists public.stock_movements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users not null,
    product_id uuid references public.products not null,
    type text not null check (type in ('entry', 'exit')),
    quantity numeric(10,2) not null,
    date date not null,
    document text,
    notes text,
    created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;

-- Create policies for products
create policy "Users can view their own products"
    on products for select
    using (auth.uid() = user_id);

create policy "Users can insert their own products"
    on products for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own products"
    on products for update
    using (auth.uid() = user_id);

create policy "Users can delete their own products"
    on products for delete
    using (auth.uid() = user_id);

-- Create policies for stock_movements
create policy "Users can view their own stock movements"
    on stock_movements for select
    using (auth.uid() = user_id);

create policy "Users can insert their own stock movements"
    on stock_movements for insert
    with check (auth.uid() = user_id);

-- Create indexes
create index products_user_id_idx on products(user_id);
create index products_code_idx on products(code);
create index stock_movements_user_id_idx on stock_movements(user_id);
create index stock_movements_product_id_idx on stock_movements(product_id);
create index stock_movements_date_idx on stock_movements(date);