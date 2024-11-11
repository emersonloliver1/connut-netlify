-- Create sample_collections table
create table if not exists public.sample_collections (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users not null,
    meal_name text not null,
    collection_date timestamp with time zone default timezone('utc'::text, now()) not null,
    responsible text not null,
    photo_url text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.sample_collections enable row level security;

-- Create policies
create policy "Users can view their own sample collections"
    on sample_collections for select
    using (auth.uid() = user_id);

create policy "Users can insert their own sample collections"
    on sample_collections for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own sample collections"
    on sample_collections for update
    using (auth.uid() = user_id);

create policy "Users can delete their own sample collections"
    on sample_collections for delete
    using (auth.uid() = user_id);

-- Create storage bucket for sample photos
insert into storage.buckets (id, name, public)
values ('sample-photos', 'sample-photos', true);

-- Enable storage policies
create policy "Sample photos are publicly accessible"
    on storage.objects for select
    using ( bucket_id = 'sample-photos' );

create policy "Users can upload sample photos"
    on storage.objects for insert
    with check (
        bucket_id = 'sample-photos'
        and auth.role() = 'authenticated'
    );