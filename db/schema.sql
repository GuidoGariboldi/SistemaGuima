-- ============================================================
-- SistemaGuima (TEOS) — Esquema completo de base de datos
-- PostgreSQL 15+
-- Correr una sola vez sobre una base vacía: sistemaguima
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- 1. PERSONAS
-- ============================================================

create table socios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  email text unique not null,
  password_hash text,                                 -- null si el socio se registró con Google
  fecha_nac date,                                      -- null si vino de Google (no lo pedimos ahí)
  telefono text,
  foto_url text,
  google_id text unique,                              -- id de cuenta de Google, si inició sesión así
  dni text unique,                                     -- obligatorio para comprar entradas; Google no lo provee
  bloqueado boolean not null default false,            -- baneo de acceso al boliche (ej. pelea)
  motivo_bloqueo text,
  bloqueado_hasta date,                                -- null = indefinido
  member_number text unique,
  nivel text not null default 'General' check (nivel in ('General','VIP','Premium')),
  puntos int not null default 0,
  created_at timestamptz not null default now()
);

create sequence if not exists seq_member_number start 1;

create or replace function fn_set_member_number() returns trigger language plpgsql as $$
begin
  if new.member_number is null then
    new.member_number := 'TEOS-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('seq_member_number')::text, 4, '0');
  end if;
  return new;
end $$;

create trigger trg_socios_member_number
before insert on socios
for each row execute function fn_set_member_number();

create table staff (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  email text unique not null,
  password_hash text not null,
  rol text not null check (rol in ('admin','caja','seguridad')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. TARJETA / BILLETERA
-- ============================================================

create table tarjetas (
  id uuid primary key default gen_random_uuid(),
  card_uid text unique not null,                    -- UID físico NFC/RFID
  socio_id uuid references socios,                   -- null = tarjeta sin vincular
  saldo numeric(12,2) not null default 0 check (saldo >= 0),
  nivel text not null default 'General',
  estado text not null default 'sin_asignar' check (estado in ('sin_asignar','activa','bloqueada','perdida')),
  created_at timestamptz not null default now()
);

create table movimientos_saldo (
  id uuid primary key default gen_random_uuid(),
  tarjeta_id uuid not null references tarjetas,
  tipo text not null check (tipo in ('carga','consumo','ajuste','devolucion')),
  monto numeric(12,2) not null,
  medio_pago text,                                   -- 'mercadopago' | 'efectivo' | 'tarjeta' | 'transferencia' | 'saldo'
  referencia_pago text,                               -- id de pago de Mercado Pago
  venta_id uuid,
  cajero_id uuid references staff,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 3. CAJAS Y TURNOS (apertura / cierre)
-- ============================================================

create table cajas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,                               -- 'Caja 1', 'Caja 2', 'Caja 3'
  ubicacion text,
  activa boolean not null default true
);

create table turnos_caja (
  id uuid primary key default gen_random_uuid(),
  caja_id uuid not null references cajas,
  numero bigint not null,
  cajero_apertura_id uuid not null references staff,
  cajero_cierre_id uuid references staff,
  fondo_inicial numeric(12,2) not null default 0,
  abierto_at timestamptz not null default now(),
  cerrado_at timestamptz,
  estado text not null default 'abierto' check (estado in ('abierto','cerrado')),
  total_ventas numeric(12,2),
  cantidad_ventas int,
  total_efectivo numeric(12,2),
  total_mp numeric(12,2),
  total_tarjeta numeric(12,2),
  total_transferencia numeric(12,2),
  total_saldo numeric(12,2),
  efectivo_declarado numeric(12,2),
  diferencia numeric(12,2),
  unique (caja_id, numero)
);

-- Va acá (y no en la definición de movimientos_saldo, más arriba) porque
-- turnos_caja todavía no existía en ese punto del script.
alter table movimientos_saldo add column turno_id uuid references turnos_caja;

-- ============================================================
-- 4. POS / BAR
-- ============================================================

create table productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null,
  precio numeric(12,2) not null,                      -- IVA incluido (consumidor final)
  costo numeric(12,2),
  stock int not null default 0 check (stock >= 0),
  alicuota_iva numeric(4,2) not null default 21.00,
  activo boolean not null default true
);

create table ventas (
  id uuid primary key default gen_random_uuid(),
  caja_id uuid references cajas,
  turno_id uuid references turnos_caja,
  cajero_id uuid references staff,
  socio_id uuid references socios,
  tarjeta_id uuid references tarjetas,
  medio_pago text not null check (medio_pago in ('efectivo','mercadopago','tarjeta','transferencia','saldo')),
  total numeric(12,2) not null default 0,
  estado text not null default 'completada' check (estado in ('completada','anulada')),
  created_at timestamptz not null default now()
);

create table venta_items (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid not null references ventas on delete cascade,
  producto_id uuid references productos,
  nombre text not null,                                -- snapshot del nombre al momento de vender
  cantidad int not null check (cantidad > 0),
  precio_unit numeric(12,2) not null,
  alicuota_iva numeric(4,2) not null default 21.00
);

-- ============================================================
-- 5. FISCAL (ARCA) — se completa cuando exista el backend
-- ============================================================

create table comprobantes (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid references ventas,
  tipo_comprobante smallint,                           -- código AFIP/ARCA: 6=Fac B, 11=Fac C, 8/13=NC...
  punto_venta int,
  numero bigint,
  cae text,
  cae_vto date,
  fecha date,
  neto numeric(12,2),
  iva numeric(12,2),
  total numeric(12,2),
  doc_tipo smallint default 99,                        -- 99=Consumidor Final, 96=DNI, 80=CUIT
  doc_nro bigint default 0,
  condicion_iva_receptor smallint,                      -- obligatorio RG 5616
  qr_afip_url text,
  raw_response jsonb,
  estado text not null default 'pendiente' check (estado in ('pendiente','autorizado','error','contingencia')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 6. EVENTOS Y ENTRADAS
-- ============================================================

create table eventos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  dj text,
  fecha date not null,
  hora time,
  categoria text,
  imagen_url text,
  destacado boolean not null default false,
  activo boolean not null default true
);

create table tipos_entrada (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos on delete cascade,
  nombre text not null,                                 -- General / VIP / Premium
  precio numeric(12,2) not null,
  cupo int not null default 0,
  vendidas int not null default 0,
  beneficios text[]
);

create table entradas (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid references socios,
  tipo_entrada_id uuid not null references tipos_entrada,
  evento_id uuid not null references eventos,
  precio numeric(12,2) not null,
  qr_code text unique not null default encode(gen_random_bytes(12), 'hex'),
  medio_pago text,
  comprobante_id uuid references comprobantes,
  estado text not null default 'valida' check (estado in ('valida','usada','anulada')),
  created_at timestamptz not null default now(),
  used_at timestamptz
);

-- descuenta cupo automáticamente y evita sobreventa
create or replace function fn_entradas_check() returns trigger language plpgsql as $$
declare te tipos_entrada;
begin
  select * into te from tipos_entrada where id = new.tipo_entrada_id for update;
  if te.vendidas >= te.cupo then
    raise exception 'Sin cupo disponible para %', te.nombre;
  end if;
  update tipos_entrada set vendidas = vendidas + 1 where id = te.id;
  return new;
end $$;

create trigger trg_entradas_insert
before insert on entradas
for each row execute function fn_entradas_check();

-- ============================================================
-- 7. TRASLADOS
-- ============================================================

create table rutas (
  id uuid primary key default gen_random_uuid(),
  origen text not null,
  destino text not null default 'TEOS Club',
  hora_ida time,
  hora_vuelta time,
  precio numeric(12,2) not null,
  asientos int not null,
  disponibles int not null,
  tipo text check (tipo in ('Combi','Micro')),
  evento_id uuid references eventos,
  activo boolean not null default true
);

create table reservas_traslado (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid references socios,
  ruta_id uuid not null references rutas,
  asientos int not null default 1 check (asientos > 0),
  precio numeric(12,2) not null,
  comprobante_id uuid references comprobantes,
  estado text not null default 'confirmada',
  created_at timestamptz not null default now()
);

-- descuenta asientos disponibles y evita sobreventa
create or replace function fn_reserva_traslado_check() returns trigger language plpgsql as $$
declare r rutas;
begin
  select * into r from rutas where id = new.ruta_id for update;
  if r.disponibles < new.asientos then
    raise exception 'No hay suficientes asientos disponibles en la ruta';
  end if;
  update rutas set disponibles = disponibles - new.asientos where id = r.id;
  return new;
end $$;

create trigger trg_reservas_traslado_insert
before insert on reservas_traslado
for each row execute function fn_reserva_traslado_check();

-- ============================================================
-- 8. CONFIGURACIÓN
-- ============================================================

create table configuracion (
  key text primary key,
  value jsonb not null
);

insert into configuracion (key, value) values
  ('fiscal', '{"cuit_emisor": null, "punto_venta": 1, "condicion_emisor": "monotributo", "umbral_identificacion_cf": 344274}');

-- ============================================================
-- 9. OPERACIONES DE PLATA (RPC)
-- ============================================================

-- Cargar saldo a una tarjeta (terminal /carga tras confirmar el pago, o un
-- cajero cargando efectivo). turno_id/cajero_id solo se completan cuando
-- la carga la hace un cajero con turno abierto — así el cierre de caja
-- puede sumar el efectivo real que entró por cargas.
create or replace function fn_cargar_saldo(
  p_card_uid text, p_monto numeric, p_medio text, p_ref text,
  p_turno_id uuid default null, p_cajero_id uuid default null
)
returns tarjetas language plpgsql as $$
declare t tarjetas;
begin
  select * into t from tarjetas where card_uid = p_card_uid for update;
  if not found then raise exception 'Tarjeta % no existe', p_card_uid; end if;
  if t.estado != 'activa' then
    raise exception 'Tarjeta % no está activa (estado: %)', p_card_uid, t.estado;
  end if;

  update tarjetas set saldo = saldo + p_monto
   where card_uid = p_card_uid returning * into t;

  insert into movimientos_saldo (tarjeta_id, tipo, monto, medio_pago, referencia_pago, turno_id, cajero_id)
  values (t.id, 'carga', p_monto, p_medio, p_ref, p_turno_id, p_cajero_id);

  return t;
end $$;

-- Abrir turno de caja
create or replace function fn_abrir_turno(p_caja_id uuid, p_cajero uuid, p_fondo numeric)
returns turnos_caja language plpgsql as $$
declare t turnos_caja;
begin
  if exists (select 1 from turnos_caja where caja_id = p_caja_id and estado = 'abierto') then
    raise exception 'Esa caja ya tiene un turno abierto';
  end if;
  insert into turnos_caja (caja_id, numero, cajero_apertura_id, fondo_inicial)
  values (p_caja_id, coalesce((select max(numero) + 1 from turnos_caja where caja_id = p_caja_id), 1), p_cajero, p_fondo)
  returning * into t;
  return t;
end $$;

-- Registrar una venta de caja: valida stock, descuenta, cobra con saldo si aplica
-- y deja el comprobante fiscal en 'pendiente'
create or replace function fn_registrar_venta(
  p_cajero uuid, p_caja_id uuid, p_turno_id uuid, p_medio text, p_items jsonb, p_card_uid text default null
) returns uuid language plpgsql as $$
declare v_venta uuid; v_total numeric := 0; it jsonb; p productos; v_tarjeta tarjetas;
begin
  insert into ventas (caja_id, turno_id, cajero_id, medio_pago, total)
  values (p_caja_id, p_turno_id, p_cajero, p_medio, 0)
  returning id into v_venta;

  for it in select * from jsonb_array_elements(p_items) loop
    select * into p from productos where id = (it->>'producto_id')::uuid for update;
    if p.stock < (it->>'cantidad')::int then
      raise exception 'Sin stock: %', p.nombre;
    end if;
    update productos set stock = stock - (it->>'cantidad')::int where id = p.id;
    insert into venta_items (venta_id, producto_id, nombre, cantidad, precio_unit, alicuota_iva)
    values (v_venta, p.id, p.nombre, (it->>'cantidad')::int, p.precio, p.alicuota_iva);
    v_total := v_total + p.precio * (it->>'cantidad')::int;
  end loop;

  update ventas set total = v_total where id = v_venta;

  if p_medio = 'saldo' and p_card_uid is not null then
    select * into v_tarjeta from tarjetas where card_uid = p_card_uid for update;
    if not found then raise exception 'Tarjeta % no existe', p_card_uid; end if;
    if v_tarjeta.estado != 'activa' then
      raise exception 'Tarjeta % no está activa (estado: %)', p_card_uid, v_tarjeta.estado;
    end if;
    update tarjetas set saldo = saldo - v_total where card_uid = p_card_uid returning * into v_tarjeta;
    insert into movimientos_saldo (tarjeta_id, tipo, monto, medio_pago, venta_id, cajero_id)
    values (v_tarjeta.id, 'consumo', v_total, 'saldo', v_venta, p_cajero);
  end if;

  insert into comprobantes (venta_id, total, estado) values (v_venta, v_total, 'pendiente');
  return v_venta;
end $$;

-- Cerrar turno de caja (arqueo)
create or replace function fn_cerrar_turno(p_turno_id uuid, p_cajero uuid, p_efectivo_declarado numeric)
returns turnos_caja language plpgsql as $$
declare t turnos_caja;
begin
  select * into t from turnos_caja where id = p_turno_id and estado = 'abierto';
  if not found then raise exception 'Turno no encontrado o ya cerrado'; end if;

  update turnos_caja set
    cajero_cierre_id = p_cajero,
    cerrado_at = now(),
    estado = 'cerrado',
    cantidad_ventas = (select count(*) from ventas where turno_id = p_turno_id and estado = 'completada'),
    total_ventas = (select coalesce(sum(total), 0) from ventas where turno_id = p_turno_id and estado = 'completada'),
    -- Las ventas ya no se cobran en efectivo (todo se paga con saldo de
    -- tarjeta); el efectivo real que maneja el cajero entra por las cargas.
    total_efectivo = (
      (select coalesce(sum(total), 0) from ventas where turno_id = p_turno_id and medio_pago = 'efectivo' and estado = 'completada')
      + (select coalesce(sum(monto), 0) from movimientos_saldo where turno_id = p_turno_id and tipo = 'carga' and medio_pago = 'efectivo')
    ),
    total_mp = (select coalesce(sum(total), 0) from ventas where turno_id = p_turno_id and medio_pago = 'mercadopago' and estado = 'completada'),
    total_tarjeta = (select coalesce(sum(total), 0) from ventas where turno_id = p_turno_id and medio_pago = 'tarjeta' and estado = 'completada'),
    total_transferencia = (select coalesce(sum(total), 0) from ventas where turno_id = p_turno_id and medio_pago = 'transferencia' and estado = 'completada'),
    total_saldo = (select coalesce(sum(total), 0) from ventas where turno_id = p_turno_id and medio_pago = 'saldo' and estado = 'completada'),
    efectivo_declarado = p_efectivo_declarado
  where id = p_turno_id;

  update turnos_caja
  set diferencia = efectivo_declarado - (fondo_inicial + total_efectivo)
  where id = p_turno_id
  returning * into t;

  return t;
end $$;

-- ============================================================
-- 10. ÍNDICES
-- ============================================================

create index idx_ventas_caja on ventas (caja_id);
create index idx_ventas_turno on ventas (turno_id);
create index idx_ventas_socio on ventas (socio_id);
create index idx_venta_items_venta on venta_items (venta_id);
create index idx_movimientos_saldo_tarjeta on movimientos_saldo (tarjeta_id);
create index idx_tipos_entrada_evento on tipos_entrada (evento_id);
create index idx_entradas_evento on entradas (evento_id);
create index idx_entradas_socio on entradas (socio_id);
create index idx_reservas_traslado_ruta on reservas_traslado (ruta_id);
create index idx_turnos_caja_caja on turnos_caja (caja_id);
