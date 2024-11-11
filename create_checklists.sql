-- Drop existing table if it exists
drop table if exists public.checklists;

-- Create checklists table
create table public.checklists (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users,
    client_id uuid not null references public.clients,
    type text not null check (type in ('rdc216', 'hygiene')),
    inspection_date date not null,
    observed_area text not null,
    crn_number text not null,
    values jsonb not null default '{}'::jsonb,
    observations jsonb not null default '{}'::jsonb,
    images jsonb not null default '{}'::jsonb,
    performance numeric(5,2),
    created_at timestamptz not null default now()
);

-- Create indexes for better performance
create index checklists_user_id_idx on public.checklists(user_id);
create index checklists_client_id_idx on public.checklists(client_id);

-- Enable RLS
alter table public.checklists enable row level security;

-- Create policies
create policy "Users can view their own checklists"
    on public.checklists for select
    using (auth.uid() = user_id);

create policy "Users can insert their own checklists"
    on public.checklists for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own checklists"
    on public.checklists for update
    using (auth.uid() = user_id);

create policy "Users can delete their own checklists"
    on public.checklists for delete
    using (auth.uid() = user_id);