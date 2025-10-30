-- Minimal schemas aligned to src/types

create table if not exists packages (
  id text primary key,
  trackingNumber text not null,
  areaCode text not null,
  senderName text not null,
  senderPhone text not null,
  recipientName text not null,
  recipientPhone text not null,
  destination text not null,
  weight numeric not null,
  status text not null,
  registeredBy text not null,
  registeredAt text not null,
  station text not null,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists users (
  id text primary key,
  name text not null,
  role text not null,
  email text,
  phoneNumber text,
  status text not null,
  createdAt text,
  updatedAt text,
  lastLogin text,
  department text,
  assignedStation text
);

create table if not exists clients (
  id text primary key,
  name text not null,
  phoneNumber text,
  email text,
  address text
);

create table if not exists stations (
  id text primary key,
  name text not null,
  code text not null,
  region text not null,
  location text not null,
  status text not null,
  manager text,
  contact text not null,
  capacity numeric,
  currentInventory numeric
);

create table if not exists area_codes (
  id text primary key,
  code text not null,
  name text not null,
  region text not null,
  minRange integer not null,
  maxRange integer not null,
  status text not null,
  assignedTo text,
  notes text
);

-- Suggested RLS (enable and allow anon read/write for demo; tighten later)
-- alter table packages enable row level security;
-- create policy "public read" on packages for select using (true);
-- create policy "public write" on packages for insert with check (true);
-- create policy "public update" on packages for update using (true);
-- create policy "public delete" on packages for delete using (true);

