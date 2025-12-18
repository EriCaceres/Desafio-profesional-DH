-- CATEGORÍAS
INSERT INTO categories (name, image) VALUES
  ('Lavados rápidos', 'lavados.png'),
  ('Protección y pulido', 'proteccion.png'),
  ('Detailing completo', 'detailing.png');

-- PRODUCTOS (10, como en el sprint)
INSERT INTO products (name, description, duration_min, price_from, category_id) VALUES
  ('Lavado Premium',
   'Exterior + Interior',
   90,
   20000,
   (SELECT id FROM categories WHERE name = 'Lavados rápidos')),

  ('Pulido y Encerado',
   'Pulido de pintura con cera protectora',
   120,
   45000,
   (SELECT id FROM categories WHERE name = 'Protección y pulido')),

  ('Lavado Express',
   'Lavado exterior rápido',
   30,
   8000,
   (SELECT id FROM categories WHERE name = 'Lavados rápidos')),

  ('Lavado Completo',
   'Exterior + Interior con aspirado',
   60,
   15000,
   (SELECT id FROM categories WHERE name = 'Lavados rápidos')),

  ('Detail Interior',
   'Limpieza profunda de tapizados y plásticos',
   150,
   55000,
   (SELECT id FROM categories WHERE name = 'Detailing completo')),

  ('Tratamiento Acrílico',
   'Protección de pintura con acrílico',
   180,
   70000,
   (SELECT id FROM categories WHERE name = 'Protección y pulido')),

  ('Descontaminado de pintura',
   'Clay bar + limpieza de superficie',
   90,
   35000,
   (SELECT id FROM categories WHERE name = 'Protección y pulido')),

  ('Pulido ópticas',
   'Recuperación de faros opacos',
   60,
   20000,
   (SELECT id FROM categories WHERE name = 'Protección y pulido')),

  ('Lavado Motor',
   'Limpieza segura de compartimiento',
   60,
   25000,
   (SELECT id FROM categories WHERE name = 'Lavados rápidos')),

  ('Ceramic Coating',
   'Protección cerámica larga duración',
   240,
   120000,
   (SELECT id FROM categories WHERE name = 'Detailing completo'));
