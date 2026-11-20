-- =============================================================
-- FAWAKIH — initial schema
-- Run once in Supabase SQL Editor.
-- =============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. Product availability enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_status') then
    create type product_status as enum ('available', 'limited', 'out_of_stock');
  end if;
end $$;

-- 2. Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  status product_status not null default 'available',
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_published_idx on public.products(is_published);

-- 4. updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- 5. Admin check
--    Reads app_metadata.role from the JWT. app_metadata can only be written
--    by service_role / dashboard — users CANNOT set this themselves.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- 6. Enable RLS
alter table public.categories enable row level security;
alter table public.products  enable row level security;

-- 7. Categories policies
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  using (true);

drop policy if exists "categories_admin_insert" on public.categories;
create policy "categories_admin_insert"
  on public.categories for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "categories_admin_update" on public.categories;
create policy "categories_admin_update"
  on public.categories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "categories_admin_delete" on public.categories;
create policy "categories_admin_delete"
  on public.categories for delete
  to authenticated
  using (public.is_admin());

-- 8. Products policies
--    Anonymous → only published rows
drop policy if exists "products_public_read_published" on public.products;
create policy "products_public_read_published"
  on public.products for select
  using (is_published = true);

--    Admins → see everything (including drafts / unpublished)
drop policy if exists "products_admin_read_all" on public.products;
create policy "products_admin_read_all"
  on public.products for select
  to authenticated
  using (public.is_admin());

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- 9. Storage bucket (public read, admin write)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read"  on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_insert"  on storage.objects;
create policy "product_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_update"  on storage.objects;
create policy "product_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_delete"  on storage.objects;
create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- 10. Sample categories
insert into public.categories (name, slug, display_order) values
  ('Tropical', 'tropical', 1),
  ('Berries',  'berries',  2),
  ('Citrus',   'citrus',   3),
  ('Melons',   'melons',   4),
  ('Orchard',  'orchard',  5)
on conflict (slug) do nothing;

-- 11. Sample products (clearly marked — delete from the admin panel later)
do $$
begin
  if not exists (select 1 from public.products) then
    insert into public.products
      (name, description, price, category_id, status, display_order)
    values
      ('Apple', 'Crisp and sweet red apples, freshly picked.',
        5.00, (select id from public.categories where slug = 'orchard'), 'available', 1),
      ('Mango', 'Ripe Malaysian mangoes with rich, tropical flavour.',
        6.50, (select id from public.categories where slug = 'tropical'), 'available', 2),
      ('Grape', 'Juicy seedless grapes, perfect for snacking.',
        7.00, (select id from public.categories where slug = 'berries'), 'available', 3),
      ('Pineapple', 'Golden pineapple, sweet and tangy.',
        4.00, (select id from public.categories where slug = 'tropical'), 'available', 4),
      ('Watermelon', 'Refreshing local watermelon, perfect for hot days.',
        2.50, (select id from public.categories where slug = 'melons'), 'limited', 5),
      ('Honeymelon', 'Delicate honey-sweet melon.',
        3.00, (select id from public.categories where slug = 'melons'), 'available', 6),
      ('Honeydew', 'Pale green, extra sweet and juicy.',
        3.50, (select id from public.categories where slug = 'melons'), 'available', 7),
      ('Guava', 'Fragrant guava with a soft, sweet interior.',
        4.50, (select id from public.categories where slug = 'tropical'), 'available', 8),
      ('Pomegranate', 'Ruby-red pomegranate, tart and sweet.',
        8.00, (select id from public.categories where slug = 'orchard'), 'out_of_stock', 9);
  end if;
end $$;

-- =============================================================
-- NOTE — promote an admin (run AFTER creating the user):
--
--   update auth.users
--   set raw_app_meta_data =
--     coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
--   where email = 'YOUR_ADMIN_EMAIL@example.com';
--
-- The user must sign out and sign back in for the JWT to include the role.
-- =============================================================
