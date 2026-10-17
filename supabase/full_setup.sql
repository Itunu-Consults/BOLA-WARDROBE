-- ==============================================================================
-- BOLA WARDROBE — COMPLETE ALL-IN-ONE SUPABASE SETUP SCRIPT
-- Tables, Triggers, RLS Security Policies & Storefront Seed Data
-- 100% IDEMPOTENT: Safe to run or re-run anytime
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. TABLE: site_settings (Storefront Brand & Configuration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  brand_name TEXT NOT NULL DEFAULT 'Bola Wardrobe',
  tagline TEXT NOT NULL DEFAULT 'Your Style, Beautifully Within Reach.',
  supporting_statement TEXT NOT NULL DEFAULT 'Discover thoughtfully selected fashion pieces that make everyday dressing feel special, without stretching your budget.',
  announcement_text TEXT NOT NULL DEFAULT 'Everyday elegance, thoughtfully curated.',
  whatsapp_number TEXT NOT NULL DEFAULT 'https://wa.link/ghucjd',
  business_email TEXT NOT NULL DEFAULT 'ismailrofiatbolanle@gmail.com',
  instagram_url TEXT DEFAULT 'https://instagram.com/bolawardrobe',
  facebook_url TEXT DEFAULT 'https://facebook.com/bolawardrobe',
  tiktok_url TEXT DEFAULT 'https://tiktok.com/@bolawardrobe',
  consultation_enabled BOOLEAN DEFAULT true NOT NULL,
  business_hours TEXT DEFAULT 'Monday – Saturday: 9:00 AM – 7:00 PM (WAT)',
  footer_note TEXT DEFAULT 'Feminine ready-to-wear, bags, jewelry, and beauty essentials crafted for confident everyday living.',
  meta_title TEXT DEFAULT 'Bola Wardrobe — Boutique Fashion & Lifestyle',
  meta_description TEXT DEFAULT 'Premium online fashion boutique offering classy ready-to-wear pieces, bags, feminine accessories, and cosmetics with seamless WhatsApp ordering.',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. TABLE: categories (Boutique Collections)
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

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 5. TABLE: products (Wears, Bags, Accessories, Cosmetics)
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

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 6. TABLE: bookings (Styling & Consultation Requests)
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

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 7. TABLE: orders (WhatsApp & Storefront Order Inquiries)
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

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 8. TABLE: messages (Contact Inquiries)
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

DROP TRIGGER IF EXISTS set_messages_updated_at ON public.messages;
CREATE TRIGGER set_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can submit a booking" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can submit an order request" ON public.orders;
DROP POLICY IF EXISTS "Anyone can send a contact message" ON public.messages;
DROP POLICY IF EXISTS "Admins have full access to categories" ON public.categories;
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
DROP POLICY IF EXISTS "Admins have full access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
DROP POLICY IF EXISTS "Admins have full access to messages" ON public.messages;
DROP POLICY IF EXISTS "Admins have full access to site_settings" ON public.site_settings;

-- Public READ
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

-- Public INSERT (Forms without account)
CREATE POLICY "Anyone can submit a booking" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit an order request" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can send a contact message" ON public.messages FOR INSERT WITH CHECK (true);

-- Authenticated Admin Access
CREATE POLICY "Admins have full access to categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to bookings" ON public.bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to messages" ON public.messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins have full access to site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 10. INITIAL SEED DATA
-- ==============================================================================

-- A. SEED SITE SETTINGS
INSERT INTO public.site_settings (
  id, brand_name, tagline, supporting_statement, announcement_text,
  whatsapp_number, business_email, instagram_url, facebook_url, tiktok_url,
  consultation_enabled, business_hours, footer_note, meta_title, meta_description
) VALUES (
  'default',
  $brand$Bola Wardrobe$brand$,
  $tagline$Your Style, Beautifully Within Reach.$tagline$,
  $statement$Discover thoughtfully selected fashion pieces that make everyday dressing feel special, without stretching your budget.$statement$,
  $announcement$Everyday elegance, thoughtfully curated.$announcement$,
  $wa$https://wa.link/ghucjd$wa$,
  $email$ismailrofiatbolanle@gmail.com$email$,
  $ig$https://instagram.com/bolawardrobe$ig$,
  $fb$https://facebook.com/bolawardrobe$fb$,
  $tiktok$https://tiktok.com/@bolawardrobe$tiktok$,
  true,
  $hours$Monday – Saturday: 9:00 AM – 7:00 PM (WAT)$hours$,
  $footer$Feminine ready-to-wear, bags, jewelry, and beauty essentials crafted for confident everyday living.$footer$,
  $title$Bola Wardrobe — Boutique Fashion & Lifestyle$title$,
  $desc$Premium online fashion boutique offering classy ready-to-wear pieces, bags, feminine accessories, and cosmetics with seamless WhatsApp ordering.$desc$
) ON CONFLICT (id) DO UPDATE SET
  brand_name = EXCLUDED.brand_name,
  whatsapp_number = EXCLUDED.whatsapp_number,
  business_email = EXCLUDED.business_email,
  updated_at = NOW();

-- B. SEED CATEGORIES
INSERT INTO public.categories (id, slug, name, tagline, description, image, display_order)
VALUES (
  'cat-wears', 'wears', $name$Wears$name$, $tagline$Artisanal Adire, Batik & Ready-to-Wear$tagline$,
  $desc$Effortless statement co-ords, tiered maxi skirts, and contemporary dresses crafted for everyday elegance.$desc$, '/images/categories/category-wears.jpg', 1
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

INSERT INTO public.categories (id, slug, name, tagline, description, image, display_order)
VALUES (
  'cat-bags', 'bags', $name$Bags$name$, $tagline$Structured Satchels, Buckets & Totes$tagline$,
  $desc$Polished handbags, croc-embossed satchels, and versatile crossbody styles that elevate every ensemble.$desc$, '/images/categories/category-bags.jpg', 2
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

INSERT INTO public.categories (id, slug, name, tagline, description, image, display_order)
VALUES (
  'cat-accessories', 'accessories', $name$Accessories$name$, $tagline$Jewelry, Cuffs, Clutches & Scarves$tagline$,
  $desc$Refined finishing accents, artisan-crafted bangles, and chic evening clutches to complete your personal style.$desc$, '/images/categories/category-accessories.jpg', 3
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

INSERT INTO public.categories (id, slug, name, tagline, description, image, display_order)
VALUES (
  'cat-cosmetics', 'cosmetics', $name$Cosmetics$name$, $tagline$Radiant Skin, Lip Stains & Elixirs$tagline$,
  $desc$Thoughtfully curated clean beauty essentials designed to enhance your natural beauty and confidence.$desc$, '/images/categories/category-cosmetics.jpg', 4
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- C. SEED PRODUCTS
INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-wears-1', 'adire-swirl-two-piece-set', $name$Adire Swirl Two-Piece Set$name$, 'wears',
  $short$Artisanal hand-dyed Adire swirl print blouse with coordinating wide-leg trousers.$short$, $desc$Crafted in breathable cotton poplin, this statement two-piece set showcases an energetic swirl motif in rich emerald green, cobalt blue, and crisp ivory. Featuring an airy relaxed-fit top with side ties and fluid high-waisted wide-leg trousers, it transitions seamlessly from daytime social events to festive evening gatherings.$desc$,
  ARRAY['/uploads/WhatsAppImage2026-10-16at16392-1792267549498.jpg'], $variants$[{"name":"Size","values":["UK 8 / S","UK 10 / M","UK 12 / L","UK 14 / XL","UK 16 / XXL"]},{"name":"Color","values":["Emerald & Cobalt Swirl","Royal Blue & Indigo"]}]$variants$::jsonb,
  'in_stock', 'New Arrival', $specs${"Material":"100% Premium Cotton Poplin","Top Closure":"V-neckline with adjustable side-tie drawstrings","Trouser Waist":"Comfort elasticated waist with wide-leg sweep","Origin":"Hand-dyed & crafted in Nigeria"}$specs$::jsonb,
  $care$Hand wash cold with mild detergent or dry clean. Hang dry away from direct sunlight. Warm iron on reverse.$care$, true, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-wears-2', 'tri-color-batik-tiered-maxi-skirt', $name$Tri-Color Batik Tiered Maxi Skirt$name$, 'wears',
  $short$Tiered full-length maxi skirt featuring contrasting graphic batik block panels.$short$, $desc$A celebration of modern African craftsmanship, this tiered skirt pairs three contrasting block prints in botanical green, deep vermilion red, and dramatic onyx black. The elasticated smocked waistband ensures all-day comfort and a flattering drape that moves gracefully with every step.$desc$,
  ARRAY['/uploads/WhatsAppImage2026-10-16at16392-1792267534624.jpg'], $variants$[{"name":"Size","values":["S (UK 8–10)","M (UK 12–14)","L (UK 16–18)"]}]$variants$::jsonb,
  'in_stock', 'Staff Pick', $specs${"Fabric":"100% Breathable Dyed Cotton","Waistband":"Smocked elastic with subtle gather","Length":"Full floor-skimming maxi sweep","Details":"Three distinct contrast tier blocks"}$specs$::jsonb,
  $care$Gentle machine wash cold. Do not bleach. Line dry in shade. Warm iron.$care$, true, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-wears-3', 'heritage-linear-striped-coord-set', $name$Heritage Linear Striped Buba & Trouser Set$name$, 'wears',
  $short$Contemporary striped tunic top paired with matching straight-cut trousers.$short$, $desc$Drawing inspiration from traditional loom woven aesthetics, this two-piece set features dynamic vertical and horizontal bands of vivid azure, crimson red, teal, and jet black. Designed for the modern woman who values distinction and effortless cultural elegance.$desc$,
  ARRAY['/uploads/WhatsAppImage2026-10-16at16391-1792267513869.jpg'], $variants$[{"name":"Size","values":["UK 8","UK 10","UK 12","UK 14","UK 16"]}]$variants$::jsonb,
  'in_stock', 'Bestseller', $specs${"Material":"Soft structured woven cotton blend","Neckline":"Split V-neck with woven accent border","Sleeves":"Three-quarter kimono sleeves","Trousers":"Straight-leg tailored fit"}$specs$::jsonb,
  $care$Dry clean recommended or gentle hand wash.$care$, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-bags-1', 'riviera-canvas-bucket-bag', $name$Riviera Canvas & Vegan Leather Bucket Bag$name$, 'bags',
  $short$Refined two-tone canvas bucket bag with cognac saddle leather trim and gold drawstring.$short$, $desc$The quintessential warm-weather and everyday companion. Crafted from durable woven oat canvas accented with rich cognac vegan leather and brushed champagne gold hardware. Includes both a comfortable top handle and an adjustable crossbody strap.$desc$,
  ARRAY['/uploads/WhatsAppImage2026-10-16at16385-1792267805646.jpg'], $variants$[{"name":"Color","values":["Tan Saddle & Oat Canvas","Ebony Black & Oat Canvas"]}]$variants$::jsonb,
  'in_stock', 'The Edit', $specs${"Dimensions":"22cm H × 20cm W × 14cm D","Strap Drop":"Adjustable 48cm–58cm crossbody strap","Interior":"Suedette lining with zippered slip pocket","Closure":"Braided leather drawstring cinch with gold grommets"}$specs$::jsonb,
  $care$Spot clean canvas with a damp cloth. Wipe leather trim with a dry soft cloth.$care$, true, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-bags-2', 'croc-embossed-executive-satchel', $name$Croc-Embossed Executive Satchel$name$, 'bags',
  $short$High-shine structured handbag with signature buckle strap detailing and detachable shoulder strap.$short$, $desc$Exude poise and polished sophistication. Made from premium crocodile-embossed vegan leather with a lustrous patent finish, dual rolled top handles, and sleek metal bar strap accents. Spacious enough for your daily essentials, tablet, and cosmetics.$desc$,
  ARRAY['/uploads/WhatsAppImage2026-10-16at16385-1792267819527.jpg'], $variants$[{"name":"Color","values":["Glossy Onyx","Rich Cognac","Deep Wine / Burgundy","Creamy Nude","Ivory White","Sage Olive"]}]$variants$::jsonb,
  'in_stock', 'Bestseller', $specs${"Dimensions":"30cm W × 24cm H × 13cm D","Material":"High-grade patent croc-embossed composite leather","Hardware":"Protective metal feet and reinforced buckle clasps","Compartments":"Triple compartment with central zip divider"}$specs$::jsonb,
  $care$Wipe clean with a soft microfiber cloth. Store in dustbag when not in use.$care$, true, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-bags-3', 'verona-structured-dome-handbag-set', $name$Verona Structured Dome Handbag Set$name$, 'bags',
  $short$Dual-piece set with a pebbled dome satchel and coordinating crescent coin pouch.$short$, $desc$A versatile 2-in-1 pairing featuring our signature pebbled leatherette dome handbag with sleek angled strap hardware and an accompanying half-moon organizer pouch. Perfect for effortless transition from boardroom meetings to weekend dinners.$desc$,
  ARRAY['/uploads/WhatsAppImage2026-10-16at163jp-1792267834878.jpg'], $variants$[{"name":"Color","values":["Jet Black","Mocha Chocolate","Sand Beige","Ruby Crimson"]}]$variants$::jsonb,
  'in_stock', 'New Arrival', $specs${"Handbag Size":"28cm W × 21cm H × 12cm D","Pouch Size":"18cm W × 11cm H crescent coin purse","Finish":"Scratch-resistant pebbled leatherette","Accessories":"Detachable & adjustable shoulder strap included"}$specs$::jsonb,
  $care$Avoid direct heat. Store with stuffing to retain structured silhouette.$care$, true, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-acc-1', 'artisan-textured-silver-bangle', $name$Artisan Textured Silver Bangle$name$, 'accessories',
  $short$Twisted cable cuff bracelet in polished sterling silver finish.$short$, $desc$A timeless wrist piece with intricate ribbed cable detailing and smooth spherical endcaps. Stacks effortlessly with watches or shines on its own as a refined signature touch for both traditional and western attire.$desc$,
  ARRAY['/images/products/hammered-silver-bangles.jpg'], $variants$[{"name":"Finish","values":["Polished Sterling Silver","Champagne Gold Tone"]}]$variants$::jsonb,
  'in_stock', 'Staff Pick', $specs${"Material":"Rhodium-plated hypoallergenic alloy","Diameter":"62mm flexible comfort-fit cuff","Weight":"28g solid weighted feel"}$specs$::jsonb,
  $care$Keep away from perfume and moisture. Store in a soft pouch.$care$, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-acc-2', 'croc-embossed-monogram-clutch', $name$Croc-Embossed Monogram Clutch$name$, 'accessories',
  $short$Compact ivory croc-embossed crossbody clutch with sleek metallic emblem.$short$, $desc$Designed to carry your evening essentials with understated elegance. Features an embossed crocodile texture, detachable link chain strap, and secure magnetic flap closure.$desc$,
  ARRAY['/images/products/verona-dome-beige.jpg'], $variants$[{"name":"Color","values":["Alabaster Ivory","Midnight Black"]}]$variants$::jsonb,
  'in_stock', 'The Edit', $specs${"Dimensions":"19cm W × 13cm H × 5cm D","Chain Strap":"115cm detachable metal link chain","Closure":"Concealed magnetic snap clasp"}$specs$::jsonb,
  $care$Wipe gently with dry cotton cloth.$care$, true, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-cos-1', 'radiant-glow-hydrating-primer-mist', $name$Radiant Glow Hydrating Primer Mist$name$, 'cosmetics',
  $short$Dewy setting spray and prep mist infused with rosewater and hyaluronic acid.$short$, $desc$Prep, hydrate, and lock in your look with this ultra-fine illuminating mist. Enriched with botanical extracts and niacinamide, it leaves skin with a natural healthy glow suitable for tropical and temperate climates alike.$desc$,
  ARRAY['/images/products/botanical-elixir.jpg'], $variants$[{"name":"Volume","values":["100ml / 3.4 fl oz","50ml Travel Size"]}]$variants$::jsonb,
  'in_stock', 'New Arrival', $specs${"Key Ingredients":"Hyaluronic Acid, Rose Damascena Water, Aloe Vera Extract","Formula":"Alcohol-free, paraben-free, non-comedogenic","Finish":"Dewy, radiant skin finish"}$specs$::jsonb,
  $care$Store in a cool place away from direct sunlight.$care$, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

INSERT INTO public.products (
  id, slug, name, category, short_description, description,
  images, variants, availability, label, specifications, care_instructions,
  is_published, is_featured
) VALUES (
  'prod-cos-2', 'velvet-matte-longwear-lip-stain', $name$Velvet Matte Longwear Lip Stain$name$, 'cosmetics',
  $short$Weightless non-drying liquid lip stain with rich pigment payoff.$short$, $desc$Formulated with nourishing shea butter and jojoba oil to deliver intense, soft-focus matte color that stays comfortable and transfer-resistant throughout your day.$desc$,
  ARRAY['/images/products/velvet-matte-lip.jpg'], $variants$[{"name":"Shade","values":["Nude Allure (Warm Mauve)","Red Velvet (True Crimson)","Berry Sovereign (Deep Plum)","Caramel Kiss (Warm Brown)"]}]$variants$::jsonb,
  'in_stock', 'Bestseller', $specs${"Finish":"Soft velvet matte","Wear Time":"Up to 12 hours comfortable wear","Features":"Infused with Vitamin E and Jojoba Seed Oil"}$specs$::jsonb,
  $care$Close cap tightly after each use.$care$, true, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  availability = EXCLUDED.availability,
  label = EXCLUDED.label,
  specifications = EXCLUDED.specifications,
  care_instructions = EXCLUDED.care_instructions,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  updated_at = NOW();

