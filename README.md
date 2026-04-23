# EziNotes Full App

## Quick Start

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create new project (choose Sydney region for NDIS compliance)
3. Note your URL and anon key

### 2. Set Up Database
Run this SQL in Supabase SQL Editor:

```sql
-- Users table (extends Supabase auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  organisation text,
  plan text default 'free',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can only see their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Clients table
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  ndis_number text,
  created_at timestamp with time zone default now()
);

alter table public.clients enable row level security;

create policy "Users can manage own clients" on public.clients
  for all using (auth.uid() = user_id);

-- Notes table
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  client_id uuid references public.clients(id),
  transcript text,
  polished_note text,
  service_type text,
  duration_minutes int,
  created_at timestamp with time zone default now()
);

alter table public.notes enable row level security;

create policy "Users can manage own notes" on public.notes
  for all using (auth.uid() = user_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 3. Deploy to Vercel
1. Push this code to GitHub
2. Go to https://vercel.com
3. Import the repo
4. Add environment variables from .env.example
5. Deploy!

### 4. Development
```bash
npm install
npm run dev
```

Visit http://localhost:3000

### 4.1 Add Notes Table (if not already added)

```sql
-- Notes table (if not in main schema)
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  client_id uuid references public.clients(id),
  transcript text,
  polished_note text not null,
  service_type text default 'Social & Domestic Support',
  duration_minutes int default 60,
  created_at timestamp with time zone default now()
);

alter table public.notes enable row level security;

create policy "Users can manage own notes" on public.notes
  for all using (auth.uid() = user_id);
```
