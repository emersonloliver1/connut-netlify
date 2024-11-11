-- Create clients table
create table if not exists public.clients (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text,
    phone text,
    cpf_cnpj text,
    birth_date date,
    cep text,
    address text,
    address_number text,
    complement text,
    city text,
    state text,
    user_id uuid references auth.users not null
);

-- Enable RLS
alter table public.clients enable row level security;

-- Create policies
create policy "Users can view their own clients"
    on clients for select
    using (auth.uid() = user_id);

create policy "Users can insert their own clients"
    on clients for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own clients"
    on clients for update
    using (auth.uid() = user_id);

create policy "Users can delete their own clients"
    on clients for delete
    using (auth.uid() = user_id);