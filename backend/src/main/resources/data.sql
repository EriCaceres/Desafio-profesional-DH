-- CATEGORÍAS
INSERT INTO categories (id, name, image) VALUES (1, 'Lavados rápidos', 'lavados.png');
INSERT INTO categories (id, name, image) VALUES (2, 'Protección y pulido', 'proteccion.png');
INSERT INTO categories (id, name, image) VALUES (3, 'Detailing completo', 'detailing.png');

-- CARACTERÍSTICAS
INSERT INTO features (id, name, icon) VALUES (1, 'Aspirado interior', 'vacuum');
INSERT INTO features (id, name, icon) VALUES (2, 'Cera incluida', 'shield');
INSERT INTO features (id, name, icon) VALUES (3, 'Secado a mano', 'hand');
INSERT INTO features (id, name, icon) VALUES (4, 'Ambientador', 'star');
INSERT INTO features (id, name, icon) VALUES (5, 'Tratamiento cerámico', 'layers');
INSERT INTO features (id, name, icon) VALUES (6, 'Clay bar', 'tool');

-- PRODUCTOS
INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (1, 'Lavado Premium', 'Exterior + Interior', 90, 20000, 1);

INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (2, 'Pulido y Encerado', 'Pulido de pintura con cera protectora', 120, 45000, 2);

INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (3, 'Lavado Express', 'Lavado exterior rápido', 30, 8000, 1);

INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (4, 'Lavado Completo', 'Exterior + Interior con aspirado', 60, 15000, 1);

INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (5, 'Detail Interior', 'Limpieza profunda de tapizados y plásticos', 150, 55000, 3);

INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (6, 'Tratamiento Acrílico', 'Protección de pintura con acrílico', 180, 70000, 2);

INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (7, 'Descontaminado de pintura', 'Clay bar + limpieza de superficie', 90, 35000, 2);

INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (8, 'Pulido ópticas', 'Recuperación de faros opacos', 60, 20000, 2);

INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (9, 'Lavado Motor', 'Limpieza segura de compartimiento', 60, 25000, 1);

INSERT INTO products (id, name, description, duration_min, price_from, category_id) VALUES
  (10, 'Ceramic Coating', 'Protección cerámica larga duración', 240, 120000, 3);

-- RELACIONES PRODUCTO ↔ CARACTERÍSTICAS
-- (tabla intermedia que JPA genera, normalmente product_features o products_features)
-- Lavado Premium: aspirado + secado a mano + ambientador
INSERT INTO product_features (product_id, feature_id) VALUES (1, 1);
INSERT INTO product_features (product_id, feature_id) VALUES (1, 3);
INSERT INTO product_features (product_id, feature_id) VALUES (1, 4);

-- Pulido y Encerado: cera + secado a mano
INSERT INTO product_features (product_id, feature_id) VALUES (2, 2);
INSERT INTO product_features (product_id, feature_id) VALUES (2, 3);

-- Lavado Express: secado a mano
INSERT INTO product_features (product_id, feature_id) VALUES (3, 3);

-- Lavado Completo: aspirado + secado a mano + ambientador
INSERT INTO product_features (product_id, feature_id) VALUES (4, 1);
INSERT INTO product_features (product_id, feature_id) VALUES (4, 3);
INSERT INTO product_features (product_id, feature_id) VALUES (4, 4);

-- Detail Interior: aspirado + ambientador
INSERT INTO product_features (product_id, feature_id) VALUES (5, 1);
INSERT INTO product_features (product_id, feature_id) VALUES (5, 4);

-- Tratamiento Acrílico: cera + secado a mano
INSERT INTO product_features (product_id, feature_id) VALUES (6, 2);
INSERT INTO product_features (product_id, feature_id) VALUES (6, 3);

-- Descontaminado de pintura: clay bar + secado a mano
INSERT INTO product_features (product_id, feature_id) VALUES (7, 6);
INSERT INTO product_features (product_id, feature_id) VALUES (7, 3);

-- Pulido ópticas: secado a mano
INSERT INTO product_features (product_id, feature_id) VALUES (8, 3);

-- Lavado Motor: secado a mano
INSERT INTO product_features (product_id, feature_id) VALUES (9, 3);

-- Ceramic Coating: tratamiento cerámico + clay bar + cera
INSERT INTO product_features (product_id, feature_id) VALUES (10, 5);
INSERT INTO product_features (product_id, feature_id) VALUES (10, 6);
INSERT INTO product_features (product_id, feature_id) VALUES (10, 2);

-- ROLES
INSERT INTO role (id, name) VALUES (1, 'USER');
INSERT INTO role (id, name) VALUES (2, 'ADMIN');

-- USUARIO ADMIN PRECARGADO
INSERT INTO users (id, first_name, last_name, email, password)
VALUES (1, 'Admin', 'ShineLab', 'admin@shinelab.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnK57pjz1c6');

-- ASIGNAR ROLES AL ADMIN
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2);