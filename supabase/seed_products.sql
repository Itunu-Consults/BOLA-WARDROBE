-- ==============================================================================
-- BOLA WARDROBE — SEED PRODUCTS INTO SUPABASE
-- Run in Supabase SQL Editor to populate all 10 boutique products
-- ==============================================================================

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

