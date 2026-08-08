-- TAKI3D - Schema Supabase
-- Pegá todo este script en: Supabase Dashboard -> SQL Editor -> New query -> Run
-- (los comandos son idempotentes, se pueden correr más de una vez)

-- ============ TABLAS ============

create table if not exists public.products (
  id text primary key,
  title text not null default '',
  price numeric not null default 0,
  stock_mode text not null default 'pedido' check (stock_mode in ('stock', 'pedido')),
  quantity int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  payer_name text not null default '',
  payer_email text not null default '',
  payer_phone text not null default '',
  delivery text not null default 'retiro',
  address text not null default '',
  notes text not null default '',
  total numeric not null default 0,
  payment_method text not null default 'mp',
  status text not null default 'pending',
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  cancelled_at timestamptz
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text not null default '',
  title text not null default '',
  quantity int not null default 1,
  unit_price numeric not null default 0,
  stock_mode text not null default 'pedido'
);

create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- ============ RPCs ============

-- Crea/actualiza un producto de catálogo. La cantidad SOLO se setea si el
-- producto aún no existe (así una reserva hecha en Postgres no se pisa al
-- sincronizar desde Sanity).
create or replace function public.sync_product(
  p_id text,
  p_title text,
  p_price numeric,
  p_stock_mode text,
  p_qty int
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing int;
begin
  select count(*) into v_existing from public.products where id = p_id;
  if v_existing = 0 then
    insert into public.products (id, title, price, stock_mode, quantity)
    values (p_id, p_title, p_price, p_stock_mode, p_qty);
  else
    update public.products
      set title = p_title, price = p_price, stock_mode = p_stock_mode, updated_at = now()
      where id = p_id;
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

-- Reserva stock (atómico) e inserta el pedido + sus items en una transacción.
-- Si no alcanza stock, hace rollback de todo y devuelve error STOCK_INSUFICIENTE.
create or replace function public.place_order(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id text := p_payload->>'order_id';
  v_item jsonb;
  v_total numeric := 0;
begin
  for v_item in select * from jsonb_array_elements(p_payload->'items') loop
    if (v_item->>'stock_mode') = 'stock' then
      update public.products
        set quantity = quantity - (v_item->>'quantity')::int
        where id = (v_item->>'id') and quantity >= (v_item->>'quantity')::int;
      if not found then
        raise exception 'STOCK_INSUFICIENTE:%', v_item->>'id';
      end if;
    end if;
    v_total := v_total + (v_item->>'quantity')::int * (v_item->>'unit_price')::numeric;
  end loop;

  insert into public.orders (
    id, payer_name, payer_email, payer_phone, delivery, address, notes,
    total, payment_method, status, mp_preference_id
  ) values (
    v_order_id,
    coalesce(p_payload->>'payer_name', ''),
    coalesce(p_payload->>'payer_email', ''),
    coalesce(p_payload->>'payer_phone', ''),
    coalesce(p_payload->>'delivery', 'retiro'),
    coalesce(p_payload->>'address', ''),
    coalesce(p_payload->>'notes', ''),
    v_total,
    coalesce(p_payload->>'payment_method', 'mp'),
    'pending',
    p_payload->>'mp_preference_id'
  );

  insert into public.order_items (order_id, product_id, title, quantity, unit_price, stock_mode)
  select v_order_id,
         t->>'id',
         coalesce(t->>'title', ''),
         (t->>'quantity')::int,
         (t->>'unit_price')::numeric,
         coalesce(t->>'stock_mode', 'pedido')
  from jsonb_array_elements(p_payload->'items') as t;

  return jsonb_build_object('ok', true, 'order_id', v_order_id, 'total', v_total);
end;
$$;

-- Marca el pedido como pagado (solo si estaba pendiente).
create or replace function public.confirm_order(p_order_id text, p_payment_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  select status into v_status from public.orders where id = p_order_id;
  if v_status is null then
    raise exception 'NOT_FOUND';
  end if;
  if v_status = 'pending' then
    update public.orders
      set status = 'paid', paid_at = now(), mp_payment_id = p_payment_id
      where id = p_order_id;
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

-- Cancela (o reembolsa) un pedido y devuelve el stock reservado.
create or replace function public.cancel_order(p_order_id text, p_status text default 'cancelled')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_item record;
begin
  select status into v_status from public.orders where id = p_order_id;
  if v_status is null then
    raise exception 'NOT_FOUND';
  end if;
  if v_status = 'paid' and p_status = 'cancelled' then
    raise exception 'ALREADY_PAID';
  end if;
  if v_status not in ('cancelled', 'refunded') then
    for v_item in
      select product_id, quantity, stock_mode
      from public.order_items
      where order_id = p_order_id
    loop
      if v_item.stock_mode = 'stock' then
        update public.products
          set quantity = quantity + v_item.quantity
          where id = v_item.product_id;
      end if;
    end loop;
    if p_status = 'refunded' then
      update public.orders set status = 'refunded', cancelled_at = now() where id = p_order_id;
    else
      update public.orders set status = 'cancelled', cancelled_at = now() where id = p_order_id;
    end if;
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

-- Cancela pedidos pendientes que quedaron abandonados (pago MP iniciado y no
-- completado, o pedidos por WhatsApp sin coordinar) y libera el stock reservado.
create or replace function public.expire_pending_orders(p_age_hours int default 24)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cutoff timestamptz := now() - (p_age_hours || ' hours')::interval;
  v_order record;
  v_item record;
  v_count int := 0;
begin
  for v_order in
    select id from public.orders
    where status = 'pending' and created_at < v_cutoff
    order by created_at
  loop
    for v_item in
      select product_id, quantity, stock_mode
      from public.order_items
      where order_id = v_order.id
    loop
      if v_item.stock_mode = 'stock' then
        update public.products
          set quantity = quantity + v_item.quantity
          where id = v_item.product_id;
      end if;
    end loop;
    update public.orders set status = 'cancelled', cancelled_at = now() where id = v_order.id;
    v_count := v_count + 1;
  end loop;
  return jsonb_build_object('ok', true, 'cancelled', v_count);
end;
$$;

-- ============ SEGURIDAD ============

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Solo el service_role (clave secreta del server) puede tocar todo esto.
revoke all on table public.products from anon, authenticated;
revoke all on table public.orders from anon, authenticated;
revoke all on table public.order_items from anon, authenticated;
revoke execute on function public.sync_product(text, text, numeric, text, int) from anon, authenticated;
revoke execute on function public.place_order(jsonb) from anon, authenticated;
revoke execute on function public.confirm_order(text, text) from anon, authenticated;
revoke execute on function public.cancel_order(text, text) from anon, authenticated;
revoke execute on function public.expire_pending_orders(int) from anon, authenticated;

grant all on table public.products to service_role;
grant all on table public.orders to service_role;
grant all on table public.order_items to service_role;
grant usage on sequence public.order_items_id_seq to service_role;
grant execute on function public.sync_product(text, text, numeric, text, int) to service_role;
grant execute on function public.place_order(jsonb) to service_role;
grant execute on function public.confirm_order(text, text) to service_role;
grant execute on function public.cancel_order(text, text) to service_role;
grant execute on function public.expire_pending_orders(int) to service_role;
