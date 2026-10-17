-- ==============================================================================
-- BOLA WARDROBE — SUPABASE SCHEMA & SECURITY POLICIES
-- Target Database: PostgreSQL 15+ (Supabase)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. REUSABLE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. TABLE: categories
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT NOT NULL,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. TABLE: products
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  variants JSONB DEFAULT '[]'::jsonb,
  availability TEXT DEFAULT 'in_stock' CHECK (availability IN ('in_stock', 'low_stock', 'preorder', 'out_of_stock')),
  label TEXT CHECK (label IN ('New Arrival', 'Staff Pick', 'Bestseller', 'The Edit') OR label IS NULL),
  specifications JSONB DEFAULT '{}'::jsonb,
  care_instructions TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_published_featured ON public.products(is_published, is_featured);

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 5. TABLE: bookings (Consultation & Styling Sessions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  consultation_type TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  category_interest TEXT NOT NULL,
  budget_range TEXT,
  preferred_style TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'completed', 'cancelled')),
  internal_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 6. TABLE: orders (WhatsApp / Storefront Order Requests)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  selected_options JSONB DEFAULT '{}'::jsonb,
  quantity INTEGER DEFAULT 1 NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  customer_notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'fulfilled', 'closed')),
  internal_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 7. TABLE: messages (Contact Inquiries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

CREATE TRIGGER set_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 8. TABLE: site_settings (Single-row store settings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  brand_name TEXT NOT NULL DEFAULT 'Bola Wardrobe',
  tagline TEXT NOT NULL DEFAULT 'Curated Nigerian & African Contemporary Fashion',
  supporting_statement TEXT NOT NULL DEFAULT 'Artisanal ready-to-wear, handcrafted genuine leather bags, and intentional beauty essentials curated for discerning style.',
  announcement_text TEXT NOT NULL DEFAULT 'Exclusive Ramadan & Spring Edit is now live — Inquire directly on WhatsApp for custom sizing.',
  whatsapp_number TEXT NOT NULL DEFAULT 'https://wa.link/ghucjd',
  business_email TEXT NOT NULL DEFAULT 'ismailrofiatbolanle@gmail.com',
  instagram_url TEXT DEFAULT 'https://instagram.com/bolawardrobe',
  facebook_url TEXT DEFAULT 'https://facebook.com/bolawardrobe',
  tiktok_url TEXT DEFAULT 'https://tiktok.com/@bolawardrobe',
  consultation_enabled BOOLEAN DEFAULT true NOT NULL,
  business_hours TEXT DEFAULT 'Mon – Sat: 9:00 AM – 7:00 PM (WAT)',
  footer_note TEXT DEFAULT 'Handcrafted with pride in Lagos, Nigeria. Worldwide concierge shipping available.',
  meta_title TEXT DEFAULT 'Bola Wardrobe — Boutique Fashion & Lifestyle',
  meta_description TEXT DEFAULT 'Premium online fashion boutique offering classy ready-to-wear pieces, bags, feminine accessories, and cosmetics with seamless WhatsApp ordering.',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PUBLIC READ POLICIES (Storefront access for all visitors)
-- ------------------------------------------------------------------------------

-- Public can view all categories
CREATE POLICY "Public categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

-- Public can view only published products
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT 
USING (is_published = true);

-- Public can view site settings
CREATE POLICY "Site settings are viewable by everyone" 
ON public.site_settings FOR SELECT 
USING (true);

-- ------------------------------------------------------------------------------
-- PUBLIC INSERT POLICIES (Storefront visitor forms without login)
-- ------------------------------------------------------------------------------

-- Anyone can submit a consultation booking request
CREATE POLICY "Anyone can submit a booking" 
ON public.bookings FOR INSERT 
WITH CHECK (true);

-- Anyone can submit an order inquiry
CREATE POLICY "Anyone can submit an order request" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Anyone can send a contact message
CREATE POLICY "Anyone can send a contact message" 
ON public.messages FOR INSERT 
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- AUTHENTICATED ADMIN POLICIES (Full control for authenticated users)
-- ------------------------------------------------------------------------------

-- Full access for authenticated admins on categories
CREATE POLICY "Admins have full access to categories" 
ON public.categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Full access for authenticated admins on products
CREATE POLICY "Admins have full access to products" 
ON public.products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Full access for authenticated admins on bookings
CREATE POLICY "Admins have full access to bookings" 
ON public.bookings FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Full access for authenticated admins on orders
CREATE POLICY "Admins have full access to orders" 
ON public.orders FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Full access for authenticated admins on messages
CREATE POLICY "Admins have full access to messages" 
ON public.messages FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Full access for authenticated admins on site_settings
CREATE POLICY "Admins have full access to site_settings" 
ON public.site_settings FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
