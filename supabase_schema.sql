-- Supabase SQL for Dapur AI

create table if not exists public.dapur_ai_profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  created_at timestamptz default now()
);

alter table public.dapur_ai_profiles enable row level security;

create policy "Users can view own profile"
  on public.dapur_ai_profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.dapur_ai_profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.dapur_ai_profiles (id, username)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.dapur_ai_saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.dapur_ai_profiles (id) on delete cascade,
  recipe_id text not null,
  recipe_title text not null,
  recipe_payload jsonb not null,
  created_at timestamptz default now()
);

alter table public.dapur_ai_saved_recipes enable row level security;

create policy "Users can view own saved recipes"
  on public.dapur_ai_saved_recipes for select using (auth.uid() = user_id);

create policy "Users can insert own saved recipes"
  on public.dapur_ai_saved_recipes for insert with check (auth.uid() = user_id);

create policy "Users can delete own saved recipes"
  on public.dapur_ai_saved_recipes for delete using (auth.uid() = user_id);
