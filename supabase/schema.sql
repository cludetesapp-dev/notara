-- ═══════════════════════════════════════════════════
-- NOTARA — Supabase Schema v1.0
-- Jalankan via Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- Enable UUID extension (biasanya sudah aktif)
create extension if not exists "pgcrypto";

-- ── products ───────────────────────────────────────
create table if not exists products (
  id           text        primary key,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  name         text        not null,
  category     text,
  unit         text        not null,
  buy_price    bigint      not null default 0,
  sell_price   bigint      not null default 0,
  stock        integer     not null default 0,
  is_archived  boolean     not null default false,
  sync_status  text        not null default 'synced',
  created_at   timestamptz not null,
  updated_at   timestamptz not null,
  deleted_at   timestamptz
);

alter table products enable row level security;

create policy "User owns products"
  on products for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── partners ───────────────────────────────────────
create table if not exists partners (
  id            text        primary key,
  user_id       uuid        not null references auth.users(id) on delete cascade,
  name          text        not null,
  type          text        not null,  -- CUSTOMER | SUPPLIER | BOTH
  phone         text,
  address       text,
  bank_name     text,
  account_no    text,
  account_name  text,
  is_archived   boolean     not null default false,
  sync_status   text        not null default 'synced',
  created_at    timestamptz not null,
  updated_at    timestamptz not null,
  deleted_at    timestamptz
);

alter table partners enable row level security;

create policy "User owns partners"
  on partners for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── transactions ───────────────────────────────────
create table if not exists transactions (
  id             text        primary key,
  user_id        uuid        not null references auth.users(id) on delete cascade,
  code           text        not null,
  type           text        not null,  -- SALE | PURCHASE
  status         text        not null,  -- DONE | CANCELLED
  partner_id     text        not null,
  date           text        not null,  -- YYYY-MM-DD
  notes          text,
  discount_type  text        not null,  -- nominal | percent
  discount_value bigint      not null default 0,
  discount       bigint      not null default 0,
  subtotal       bigint      not null default 0,
  total          bigint      not null default 0,
  pay_method     text        not null,  -- CASH | TRANSFER | DP
  dp_amount      bigint      not null default 0,
  due_date       text,
  sync_status    text        not null default 'synced',
  created_at     timestamptz not null,
  updated_at     timestamptz not null,
  deleted_at     timestamptz
);

alter table transactions enable row level security;

create policy "User owns transactions"
  on transactions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── transaction_items ──────────────────────────────
create table if not exists transaction_items (
  id             text    primary key,
  user_id        uuid    not null references auth.users(id) on delete cascade,
  transaction_id text    not null references transactions(id) on delete cascade,
  product_id     text    not null,
  product_name   text    not null,
  unit           text    not null,
  qty            integer not null,
  buy_price      bigint  not null,
  sell_price     bigint  not null,
  subtotal       bigint  not null,
  profit         bigint  not null
);

alter table transaction_items enable row level security;

create policy "User owns transaction_items"
  on transaction_items for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Indexes ────────────────────────────────────────
create index if not exists idx_products_user     on products(user_id, updated_at);
create index if not exists idx_partners_user     on partners(user_id, updated_at);
create index if not exists idx_transactions_user on transactions(user_id, updated_at);
create index if not exists idx_tx_items_tx       on transaction_items(transaction_id);
create index if not exists idx_tx_items_user     on transaction_items(user_id);
