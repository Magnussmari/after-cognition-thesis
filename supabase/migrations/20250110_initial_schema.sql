-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text check (role in ('admin', 'reviewer', 'guest')) default 'guest',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create thesis access table
create table public.thesis_access (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  thesis_id text not null default 'after-cognition',
  access_level text check (access_level in ('read', 'comment', 'admin')) default 'read',
  granted_by uuid references public.profiles(id),
  granted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,
  is_active boolean default true,
  unique(user_id, thesis_id)
);

-- Create audit log table
create table public.audit_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  action text not null,
  resource_type text not null,
  resource_id text not null,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.thesis_access enable row level security;
alter table public.audit_log enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for thesis_access
create policy "Users can view own thesis access" on public.thesis_access
  for select using (user_id = auth.uid());

create policy "Admins can manage all access" on public.thesis_access
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for audit_log
create policy "Admins can view audit logs" on public.audit_log
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "System can insert audit logs" on public.audit_log
  for insert with check (true);

-- Functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger for profiles updated_at
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Function to log audit events
create or replace function public.log_audit_event(
  p_action text,
  p_resource_type text,
  p_resource_id text,
  p_details jsonb default null,
  p_ip_address inet default null,
  p_user_agent text default null
)
returns void as $$
begin
  insert into public.audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent
  ) values (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    p_ip_address,
    p_user_agent
  );
end;
$$ language plpgsql security definer set search_path = public;

-- Function to check thesis access
create or replace function public.has_thesis_access(
  p_user_id uuid,
  p_thesis_id text,
  p_required_level text default 'read'
)
returns boolean as $$
declare
  user_access_level text;
  access_hierarchy jsonb := '{"read": 1, "comment": 2, "admin": 3}';
begin
  select access_level into user_access_level
  from public.thesis_access
  where user_id = p_user_id
    and thesis_id = p_thesis_id
    and is_active = true
    and (expires_at is null or expires_at > now());
  
  if user_access_level is null then
    return false;
  end if;
  
  return (access_hierarchy->user_access_level)::int >= (access_hierarchy->p_required_level)::int;
end;
$$ language plpgsql security definer set search_path = public;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to authenticated;
grant all on public.thesis_access to authenticated;
grant insert on public.audit_log to authenticated;
grant select on public.audit_log to authenticated;

-- Grant execute on functions
grant execute on function public.log_audit_event to authenticated;
grant execute on function public.has_thesis_access to authenticated;
