-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Drop existing tables and triggers in correct order
drop trigger if exists handle_profiles_updated_at on public.profiles;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.handle_updated_at() cascade;
drop table if exists public.checklists cascade;
drop table if exists public.clients cascade;
drop table if exists public.profiles cascade;

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql security definer;

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text,
    role text default 'user'::text,
    avatar_url text
);

-- Create clients table
create table public.clients (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text,
    phone text,
    document text,
    birth_date date,
    cep text,
    street text,
    address_number text,
    complement text,
    city text,
    state text,
    user_id uuid references auth.users not null
);

-- Create checklists table
create table public.checklists (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    client_id uuid references public.clients not null,
    type text not null check (type in ('rdc216', 'hygiene')),
    inspection_date date not null,
    observed_area text not null,
    crn_number text not null,
    values jsonb not null default '{}'::jsonb,
    observations jsonb not null default '{}'::jsonb,
    images jsonb not null default '{}'::jsonb,
    performance numeric(5,2) not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profile creation trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name)
    values (new.id, new.raw_user_meta_data->>'full_name');
    return new;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute procedure public.handle_updated_at();

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.checklists enable row level security;

-- Drop existing policies
drop policy if exists "Users can view their own profile" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;
drop policy if exists "Users can view their own clients" on clients;
drop policy if exists "Users can insert their own clients" on clients;
drop policy if exists "Users can update their own clients" on clients;
drop policy if exists "Users can delete their own clients" on clients;
drop policy if exists "Users can view their own checklists" on checklists;
drop policy if exists "Users can insert their own checklists" on checklists;
drop policy if exists "Users can update their own checklists" on checklists;
drop policy if exists "Users can delete their own checklists" on checklists;

-- Profiles policies
create policy "Users can view their own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on profiles for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

-- Clients policies
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

-- Checklists policies
create policy "Users can view their own checklists"
    on checklists for select
    using (auth.uid() = user_id);

create policy "Users can insert their own checklists"
    on checklists for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own checklists"
    on checklists for update
    using (auth.uid() = user_id);

create policy "Users can delete their own checklists"
    on checklists for delete
    using (auth.uid() = user_id);

-- Create indexes for better performance
create index clients_user_id_idx on public.clients(user_id);
create index checklists_user_id_idx on public.checklists(user_id);
create index checklists_client_id_idx on public.checklists(client_id);
create index checklists_type_idx on public.checklists(type);
create index checklists_inspection_date_idx on public.checklists(inspection_date);