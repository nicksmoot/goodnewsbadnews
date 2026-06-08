create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  avatar_url text,
  role text not null default 'RESIDENT' check (role in ('RESIDENT', 'CONTRIBUTOR', 'MODERATOR', 'ADMIN')),
  civic_score integer not null default 0 check (civic_score between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null,
  slug text unique not null
);

create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  name text not null,
  slug text not null,
  unique(city_id, slug)
);

create table if not exists public.signals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  signal_type text not null check (signal_type in ('GOOD', 'WARNING', 'OPPORTUNITY')),
  city_id uuid not null references public.cities(id),
  neighborhood_id uuid references public.neighborhoods(id),
  status text not null default 'PENDING' check (status in ('PENDING', 'PUBLISHED', 'REJECTED', 'RESOLVED')),
  confidence_level text not null default 'Community reported',
  user_id uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.corrections (
  id uuid primary key default gen_random_uuid(),
  signal_id uuid not null references public.signals(id) on delete cascade,
  requested_by uuid references public.users(id),
  reason text not null,
  status text not null default 'OPEN',
  created_at timestamptz not null default now()
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  signal_id uuid not null references public.signals(id) on delete cascade,
  organization text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null,
  status text not null
);

create table if not exists public.digest_preferences (
  user_id uuid primary key references public.users(id) on delete cascade,
  preference text not null default 'ALL' check (preference in ('GOOD', 'WARNING', 'OPPORTUNITY', 'ALL'))
);
