-- 20260803000001_initial_schema.sql
-- Initial schema for multi-tenant e-commerce

-- 1. Companies (tenants)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  custom_domain VARCHAR(200) UNIQUE,
  settings JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories (axis 1)
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  kind VARCHAR(50) NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Types (axis 2)
CREATE TABLE product_types (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0
);

-- 4. Formats (axis 3)
CREATE TABLE formats (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type_id VARCHAR(50) REFERENCES product_types(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0
);

-- 5. Variants (axis 4)
CREATE TABLE variants (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  format_id VARCHAR(50) REFERENCES formats(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0
);

-- 6. Products (each 4-axis combination = unique product)
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
  type_id VARCHAR(50) REFERENCES product_types(id) ON DELETE CASCADE,
  format_id VARCHAR(50) REFERENCES formats(id) ON DELETE CASCADE,
  variant_id VARCHAR(50) REFERENCES variants(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  stock INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Carts (anonymous sessions)
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'MXN',
  mp_preference_id VARCHAR(100),
  mp_payment_id VARCHAR(100),
  shipping_address JSONB,
  billing_address JSONB,
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  product_name VARCHAR(200) NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- 9. Payments (audit trail)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  mp_payment_id VARCHAR(100) UNIQUE,
  mp_preference_id VARCHAR(100),
  status VARCHAR(50),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'MXN',
  payment_method_id VARCHAR(50),
  payment_type_id VARCHAR(50),
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Hero slides
CREATE TABLE hero_slides (
  id VARCHAR(50) PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  subtitle VARCHAR(200),
  title VARCHAR(200) NOT NULL,
  cta_label VARCHAR(100),
  href VARCHAR(500),
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE
);

-- Composite indexes
CREATE INDEX idx_products_company_active ON products(company_id, active);
CREATE INDEX idx_products_company_type ON products(company_id, type_id);
CREATE INDEX idx_carts_company_session ON carts(company_id, session_id);
CREATE INDEX idx_orders_company_status ON orders(company_id, status);
CREATE INDEX idx_order_items_order ON order_items(order_id);