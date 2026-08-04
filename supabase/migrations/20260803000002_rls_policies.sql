-- 20260803000002_rls_policies.sql
-- RLS policies for multi-tenant isolation

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Function to get current company_id from request context
-- This will be set by Edge Functions via SET LOCAL
CREATE OR REPLACE FUNCTION current_company_id() RETURNS UUID
LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    NULLIF(current_setting('app.current_company_id', true), '')::UUID,
    NULLIF(current_setting('request.jwt.claims', true)::jsonb ->> 'company_id', '')::UUID
  );
$$;

-- Companies: only accessible by own company (admin) or super admin
CREATE POLICY "companies_tenant_isolation" ON companies
  FOR ALL USING (
    id = current_company_id()
    OR current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'service_role'
  );

-- Categories: filtered by company_id
CREATE POLICY "categories_tenant_isolation" ON categories
  FOR ALL USING (company_id = current_company_id());

-- Product types
CREATE POLICY "product_types_tenant_isolation" ON product_types
  FOR ALL USING (company_id = current_company_id());

-- Formats
CREATE POLICY "formats_tenant_isolation" ON formats
  FOR ALL USING (company_id = current_company_id());

-- Variants
CREATE POLICY "variants_tenant_isolation" ON variants
  FOR ALL USING (company_id = current_company_id());

-- Products
CREATE POLICY "products_tenant_isolation" ON products
  FOR ALL USING (company_id = current_company_id());

-- Carts
CREATE POLICY "carts_tenant_isolation" ON carts
  FOR ALL USING (company_id = current_company_id());

-- Cart items (via cart)
CREATE POLICY "cart_items_tenant_isolation" ON cart_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM carts WHERE company_id = current_company_id())
  );

-- Orders
CREATE POLICY "orders_tenant_isolation" ON orders
  FOR ALL USING (company_id = current_company_id());

-- Order items (via order)
CREATE POLICY "order_items_tenant_isolation" ON order_items
  FOR ALL USING (
    order_id IN (SELECT id FROM orders WHERE company_id = current_company_id())
  );

-- Payments
CREATE POLICY "payments_tenant_isolation" ON payments
  FOR ALL USING (
    order_id IN (SELECT id FROM orders WHERE company_id = current_company_id())
  );

-- Hero slides
CREATE POLICY "hero_slides_tenant_isolation" ON hero_slides
  FOR ALL USING (company_id = current_company_id());

-- Allow service_role to bypass RLS (for admin operations)
-- This is handled by Supabase automatically for service_role key