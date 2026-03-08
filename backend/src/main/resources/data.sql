-- CATEGORÍAS (DEFAULT en lugar de IDs hardcodeados)
INSERT INTO categories (name, image) VALUES ('Lavados rápidos', 'lavados.png');
INSERT INTO categories (name, image) VALUES ('Protección y pulido', 'proteccion.png');
INSERT INTO categories (name, image) VALUES ('Detailing completo', 'detailing.png');

-- CARACTERÍSTICAS
INSERT INTO features (name, icon) VALUES ('Aspirado interior', 'vacuum');
INSERT INTO features (name, icon) VALUES ('Cera incluida', 'shield');
INSERT INTO features (name, icon) VALUES ('Secado a mano', 'hand');
INSERT INTO features (name, icon) VALUES ('Ambientador', 'star');
INSERT INTO features (name, icon) VALUES ('Tratamiento cerámico', 'layers');
INSERT INTO features (name, icon) VALUES ('Clay bar', 'tool');

-- PRODUCTOS
INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Lavado Premium', 'Exterior + Interior', 90, 20000, id FROM categories WHERE name = 'Lavados rápidos';

INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Pulido y Encerado', 'Pulido de pintura con cera protectora', 120, 45000, id FROM categories WHERE name = 'Protección y pulido';

INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Lavado Express', 'Lavado exterior rápido', 30, 8000, id FROM categories WHERE name = 'Lavados rápidos';

INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Lavado Completo', 'Exterior + Interior con aspirado', 60, 15000, id FROM categories WHERE name = 'Lavados rápidos';

INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Detail Interior', 'Limpieza profunda de tapizados y plásticos', 150, 55000, id FROM categories WHERE name = 'Detailing completo';

INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Tratamiento Acrílico', 'Protección de pintura con acrílico', 180, 70000, id FROM categories WHERE name = 'Protección y pulido';

INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Descontaminado de pintura', 'Clay bar + limpieza de superficie', 90, 35000, id FROM categories WHERE name = 'Protección y pulido';

INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Pulido ópticas', 'Recuperación de faros opacos', 60, 20000, id FROM categories WHERE name = 'Protección y pulido';

INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Lavado Motor', 'Limpieza segura de compartimiento', 60, 25000, id FROM categories WHERE name = 'Lavados rápidos';

INSERT INTO products (name, description, duration_min, price_from, category_id)
  SELECT 'Ceramic Coating', 'Protección cerámica larga duración', 240, 120000, id FROM categories WHERE name = 'Detailing completo';

-- RELACIONES PRODUCTO ↔ CARACTERÍSTICAS
-- Lavado Premium: aspirado + secado a mano + ambientador
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Lavado Premium' AND f.name = 'Aspirado interior';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Lavado Premium' AND f.name = 'Secado a mano';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Lavado Premium' AND f.name = 'Ambientador';

-- Pulido y Encerado: cera + secado a mano
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Pulido y Encerado' AND f.name = 'Cera incluida';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Pulido y Encerado' AND f.name = 'Secado a mano';

-- Lavado Express: secado a mano
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Lavado Express' AND f.name = 'Secado a mano';

-- Lavado Completo: aspirado + secado a mano + ambientador
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Lavado Completo' AND f.name = 'Aspirado interior';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Lavado Completo' AND f.name = 'Secado a mano';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Lavado Completo' AND f.name = 'Ambientador';

-- Detail Interior: aspirado + ambientador
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Detail Interior' AND f.name = 'Aspirado interior';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Detail Interior' AND f.name = 'Ambientador';

-- Tratamiento Acrílico: cera + secado a mano
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Tratamiento Acrílico' AND f.name = 'Cera incluida';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Tratamiento Acrílico' AND f.name = 'Secado a mano';

-- Descontaminado de pintura: clay bar + secado a mano
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Descontaminado de pintura' AND f.name = 'Clay bar';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Descontaminado de pintura' AND f.name = 'Secado a mano';

-- Pulido ópticas: secado a mano
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Pulido ópticas' AND f.name = 'Secado a mano';

-- Lavado Motor: secado a mano
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Lavado Motor' AND f.name = 'Secado a mano';

-- Ceramic Coating: tratamiento cerámico + clay bar + cera
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Ceramic Coating' AND f.name = 'Tratamiento cerámico';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Ceramic Coating' AND f.name = 'Clay bar';
INSERT INTO product_features (product_id, feature_id)
  SELECT p.id, f.id FROM products p, features f WHERE p.name = 'Ceramic Coating' AND f.name = 'Cera incluida';

-- ROLES
INSERT INTO role (name) VALUES ('USER');
INSERT INTO role (name) VALUES ('ADMIN');

-- USUARIO ADMIN PRECARGADO
INSERT INTO users (first_name, last_name, email, password)
VALUES ('Admin', 'ShineLab', 'admin@shinelab.com', '$2a$10$uHFVmWlxI6Qb/0EiX3ckke18yhsWKm6Ja5Yl9Wj8Qj06HwGnptgY2');

-- ASIGNAR ROLES AL ADMIN
INSERT INTO user_roles (user_id, role_id)
  SELECT u.id, r.id FROM users u, role r WHERE u.email = 'admin@shinelab.com' AND r.name = 'USER';
INSERT INTO user_roles (user_id, role_id)
  SELECT u.id, r.id FROM users u, role r WHERE u.email = 'admin@shinelab.com' AND r.name = 'ADMIN';
