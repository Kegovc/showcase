-- 20260803000003_seed_data.sql
-- Seed data for 'sire' company

-- 1. Company
INSERT INTO companies (slug, name, active)
VALUES ('sire', 'Sire', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, active = EXCLUDED.active;

-- Get company_id for subsequent inserts
DO $$
DECLARE
  v_company_id UUID;
BEGIN
  SELECT id INTO v_company_id FROM companies WHERE slug = 'sire';

  -- 2. Categories (axis 1)
  INSERT INTO categories (id, name, kind, company_id) VALUES
    ('caballero', 'Caballero', 'caballero', v_company_id),
    ('dama', 'Dama', 'dama', v_company_id)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, kind = EXCLUDED.kind;

  -- 2. Product Types (axis 2)
  INSERT INTO product_types (id, name, category_id, company_id, sort_order) VALUES
    ('playera', 'Playera', 'caballero', v_company_id, 1),
    ('buff', 'Buff', 'caballero', v_company_id, 2),
    ('earcuffs', 'Earcuffs', 'dama', v_company_id, 1)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id, sort_order = EXCLUDED.sort_order;

  -- 3. Formats (axis 3)
  INSERT INTO formats (id, name, type_id, company_id, sort_order) VALUES
    ('pocatepetl', 'Pocatepetl', 'playera', v_company_id, 1),
    ('mariposa', 'Mariposa', 'playera', v_company_id, 2),
    ('montañas', 'Montañas', 'buff', v_company_id, 1),
    ('pocatepetl', 'Pocatepetl', 'buff', v_company_id, 2),
    ('montañas', 'Montañas', 'earcuffs', v_company_id, 1),
    ('mariposa', 'Mariposa', 'earcuffs', v_company_id, 2)
  ON CONFLICT (id, type_id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  -- 4. Variants (axis 4)
  INSERT INTO variants (id, name, format_id, company_id, sort_order) VALUES
    ('S', 'S', 'pocatepetl', v_company_id, 1),
    ('M', 'M', 'pocatepetl', v_company_id, 2),
    ('L', 'L', 'pocatepetl', v_company_id, 3),
    ('S', 'S', 'mariposa', v_company_id, 1),
    ('M', 'M', 'mariposa', v_company_id, 2),
    ('L', 'L', 'mariposa', v_company_id, 3),
    ('unitalla', 'Unitalla', 'montañas', v_company_id, 1),
    ('rojo', 'Rojo', 'montañas', v_company_id, 2),
    ('azul', 'Azul', 'montañas', v_company_id, 3),
    ('verde', 'Verde', 'montañas', v_company_id, 4),
    ('azul', 'Azul', 'pocatepetl', v_company_id, 1),
    ('verde', 'Verde', 'pocatepetl', v_company_id, 2),
    ('izquierdo', 'Izquierdo', 'montañas', v_company_id, 1),
    ('derecho', 'Derecho', 'montañas', v_company_id, 2),
    ('izquierdo', 'Izquierdo', 'mariposa', v_company_id, 1),
    ('derecho', 'Derecho', 'mariposa', v_company_id, 2)
  ON CONFLICT (id, format_id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  -- 5. Products (18 combinations)
  INSERT INTO products (id, sku, name, category_id, type_id, format_id, variant_id, price, image_url, stock, active, company_id) VALUES
    -- Caballero - Playera - Pocatepetl
    ('p1-1', 'CAB-PLAY-POC-S', 'Playera Pocatepetl S', 'caballero', 'playera', 'pocatepetl', 'S', 299.99, 'images/product-shirt.png', 100, true, v_company_id),
    ('p1-2', 'CAB-PLAY-POC-M', 'Playera Pocatepetl M', 'caballero', 'playera', 'pocatepetl', 'M', 319.99, 'images/product-shirt.png', 100, true, v_company_id),
    ('p1-3', 'CAB-PLAY-POC-L', 'Playera Pocatepetl L', 'caballero', 'playera', 'pocatepetl', 'L', 339.99, 'images/product-shirt.png', 100, true, v_company_id),
    -- Caballero - Playera - Mariposa
    ('p1-4', 'CAB-PLAY-MAR-M', 'Playera Mariposa M', 'caballero', 'playera', 'mariposa', 'M', 329.99, 'images/product-shirt.png', 100, true, v_company_id),
    ('p1-5', 'CAB-PLAY-MAR-L', 'Playera Mariposa L', 'caballero', 'playera', 'mariposa', 'L', 349.99, 'images/product-shirt.png', 100, true, v_company_id),
    -- Caballero - Buff - Montañas
    ('p2-1', 'CAB-BUF-MON-UNI', 'Buff Montañas Unitalla', 'caballero', 'buff', 'montañas', 'unitalla', 199.99, 'images/product-jacket.png', 50, true, v_company_id),
    ('p2-2', 'CAB-BUF-MON-ROJ', 'Buff Montañas Rojo', 'caballero', 'buff', 'montañas', 'rojo', 209.99, 'images/product-jacket.png', 50, true, v_company_id),
    -- Caballero - Buff - Pocatepetl
    ('p2-3', 'CAB-BUF-POC-AZU', 'Buff Pocatepetl Azul', 'caballero', 'buff', 'pocatepetl', 'azul', 219.99, 'images/product-jacket.png', 50, true, v_company_id),
    ('p2-4', 'CAB-BUF-POC-VER', 'Buff Pocatepetl Verde', 'caballero', 'buff', 'pocatepetl', 'verde', 219.99, 'images/product-jacket.png', 50, true, v_company_id),
    -- Dama - Playera - Mariposa
    ('p3-1', 'DAM-PLAY-MAR-S', 'Playera Mariposa S', 'dama', 'playera', 'mariposa', 'S', 309.99, 'images/product-dress.png', 100, true, v_company_id),
    ('p3-2', 'DAM-PLAY-MAR-M', 'Playera Mariposa M', 'dama', 'playera', 'mariposa', 'M', 329.99, 'images/product-dress.png', 100, true, v_company_id),
    -- Dama - Playera - Pocatepetl
    ('p3-3', 'DAM-PLAY-POC-M', 'Playera Pocatepetl M', 'dama', 'playera', 'pocatepetl', 'M', 335.99, 'images/product-dress.png', 100, true, v_company_id),
    ('p3-4', 'DAM-PLAY-POC-L', 'Playera Pocatepetl L', 'dama', 'playera', 'pocatepetl', 'L', 355.99, 'images/product-dress.png', 100, true, v_company_id),
    -- Dama - Earcuffs - Montañas
    ('p4-1', 'DAM-EAR-MON-IZQ', 'Earcuffs Montañas Izq', 'dama', 'earcuffs', 'montañas', 'izquierdo', 149.99, 'images/product-shirt.png', 50, true, v_company_id),
    ('p4-2', 'DAM-EAR-MON-DER', 'Earcuffs Montañas Der', 'dama', 'earcuffs', 'montañas', 'derecho', 149.99, 'images/product-shirt.png', 50, true, v_company_id),
    -- Dama - Earcuffs - Mariposa
    ('p4-3', 'DAM-EAR-MAR-IZQ', 'Earcuffs Mariposa Izq', 'dama', 'earcuffs', 'mariposa', 'izquierdo', 159.99, 'images/product-shirt.png', 50, true, v_company_id),
    ('p4-4', 'DAM-EAR-MAR-DER', 'Earcuffs Mariposa Der', 'dama', 'earcuffs', 'mariposa', 'derecho', 159.99, 'images/product-shirt.png', 50, true, v_company_id)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    image_url = EXCLUDED.image_url,
    stock = EXCLUDED.stock,
    active = EXCLUDED.active;

  -- 6. Hero slides
  INSERT INTO hero_slides (id, image_url, subtitle, title, cta_label, href, active, sort_order, company_id) VALUES
    ('s1', 'images/hero-collection.png', 'Nueva colección', 'Otoño / Invierno 2026', 'Ver colección', '#', true, 1, v_company_id),
    ('s2', 'images/hero-sale.png', 'Tiempo limitado', 'Hasta 40% de descuento', 'Comprar ofertas', '#', true, 2, v_company_id),
    ('s3', 'images/hero.png', 'Para él y para ella', 'Esenciales del guardarropa', 'Explorar', '#', true, 3, v_company_id)
  ON CONFLICT (id) DO UPDATE SET
    image_url = EXCLUDED.image_url,
    subtitle = EXCLUDED.subtitle,
    title = EXCLUDED.title,
    cta_label = EXCLUDED.cta_label,
    href = EXCLUDED.href,
    active = EXCLUDED.active;
END $$;