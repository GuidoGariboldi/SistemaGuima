-- ============================================================
-- SistemaGuima (TEOS) — Datos de prueba
-- Correr después de schema.sql, sobre la base sistemaguima
-- ============================================================

insert into productos (nombre, categoria, precio, stock, alicuota_iva) values
  ('Gin Tonic',        'Tragos',      12000, 42, 21.00),
  ('Fernet con Coca',  'Tragos',      11000, 28, 21.00),
  ('Vodka Speed',      'Tragos',      10500, 19, 21.00),
  ('Cerveza IPA',      'Cervezas',     8000, 86, 21.00),
  ('Cerveza Lager',    'Cervezas',     7000, 64, 21.00),
  ('Agua mineral',     'Sin alcohol',  3500,  0, 21.00),
  ('Energizante',      'Sin alcohol',  6000, 16, 21.00),
  ('Botella Absolut',  'Botellas',    65000,  7, 21.00);
