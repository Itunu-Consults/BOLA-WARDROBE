import React, { useState, useEffect } from 'react';

interface ProductVisualProps {
  slug: string;
  category: string;
  name: string;
  imageUrl?: string;
  className?: string;
  aspectRatio?: '4/3' | '1/1' | '3/4' | '16/9';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  slug,
  category,
  name,
  imageUrl,
  className = '',
  aspectRatio = '4/3',
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const cleanUrl = imageUrl?.trim();
  const hasCustomImage = Boolean(
    cleanUrl &&
    !imageError &&
    cleanUrl !== '/images/products/placeholder.svg' &&
    cleanUrl !== ''
  );

  const aspectClass =
    aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '3/4'
      ? 'aspect-[3/4]'
      : aspectRatio === '16/9'
      ? 'aspect-video'
      : 'aspect-[4/3]';

  return (
    <div
      className={`relative overflow-hidden bg-[#FBF9F5] flex items-center justify-center select-none ${aspectClass} ${className}`}
      data-testid={`visual-${slug}`}
    >
      {hasCustomImage ? (
        <img
          src={cleanUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={() => {
            console.warn(`[ProductVisual] Image error loading: ${cleanUrl}`);
            setImageError(true);
          }}
        />
      ) : (
        <EditorialSvgIllustration slug={slug} category={category} name={name} />
      )}
    </div>
  );
};

export const CategoryVisual: React.FC<{
  categorySlug: string;
  name: string;
  imageUrl?: string;
  className?: string;
}> = ({ categorySlug, name, imageUrl, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const resolvedUrl = imageUrl || `/images/categories/category-${categorySlug}.jpg`;

  return (
    <div
      className={`relative overflow-hidden bg-[#F8F6F2] flex items-center justify-center select-none ${className}`}
    >
      {!imgError ? (
        <img
          src={resolvedUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        <EditorialCategoryIllustration slug={categorySlug} name={name} />
      )}
    </div>
  );
};

function EditorialSvgIllustration({
  slug,
  category,
  name,
}: {
  slug: string;
  category: string;
  name: string;
}) {
  switch (slug) {
    case 'adire-swirl-two-piece-set':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#F4EFEA" />
          {/* Adire Pattern Canvas */}
          <g transform="translate(60, 20)">
            {/* Blouse Silhouette */}
            <path
              d="M60 20 L120 40 L160 20 L220 40 L280 20 L260 110 L220 100 L230 200 L50 200 L60 100 L20 110 Z"
              fill="#1B5E20"
            />
            {/* Swirl Motifs (Adire Indigo & White) */}
            <circle cx="100" cy="90" r="34" fill="#0D47A1" />
            <circle cx="100" cy="90" r="26" fill="#1B5E20" />
            <circle cx="100" cy="90" r="16" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="14 6" />
            <circle cx="100" cy="90" r="8" fill="#FFFFFF" />

            <circle cx="180" cy="130" r="38" fill="#1B5E20" />
            <circle cx="180" cy="130" r="28" fill="#0D47A1" />
            <circle cx="180" cy="130" r="18" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="12 5" />
            <circle cx="180" cy="130" r="9" fill="#FFFFFF" />

            {/* Tie strings detail */}
            <path d="M50 110 Q20 140 10 180" stroke="#0D47A1" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M230 110 Q260 140 270 180" stroke="#0D47A1" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Coordinating Bag Icon on side */}
            <rect x="220" y="160" width="46" height="36" rx="4" fill="#F8F6F2" stroke="#B99A5B" strokeWidth="1.5" />
            <ellipse cx="243" cy="178" rx="8" ry="6" fill="none" stroke="#B99A5B" strokeWidth="1.5" />
          </g>
          {/* Label Tag */}
          <text x="200" y="275" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            ARTISANAL ADIRE SWIRL EDIT
          </text>
        </svg>
      );

    case 'tri-color-batik-tiered-maxi-skirt':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#FAF7F2" />
          <g transform="translate(100, 20)">
            {/* Smocked Waistband */}
            <rect x="50" y="20" width="100" height="18" rx="3" fill="#2E7D32" />
            <line x1="50" y1="26" x2="150" y2="26" stroke="#43A047" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="32" x2="150" y2="32" stroke="#43A047" strokeWidth="1" strokeDasharray="3 3" />

            {/* Tier 1: Green Batik */}
            <path d="M50 38 L30 100 L170 100 L150 38 Z" fill="#2E7D32" />
            {/* Tier 1 Batik Stamp Details */}
            <path d="M60 65 Q75 55 90 65 Q75 75 60 65 Z" fill="#E8F5E9" />
            <path d="M110 65 Q125 55 140 65 Q125 75 110 65 Z" fill="#E8F5E9" />

            {/* Tier 2: Vermilion Red Batik */}
            <path d="M30 100 L10 170 L190 170 L170 100 Z" fill="#C62828" />
            {/* Tier 2 Batik Motifs */}
            <circle cx="55" cy="135" r="14" fill="none" stroke="#FFEBEE" strokeWidth="3" strokeDasharray="6 3" />
            <circle cx="100" cy="135" r="14" fill="none" stroke="#FFEBEE" strokeWidth="3" strokeDasharray="6 3" />
            <circle cx="145" cy="135" r="14" fill="none" stroke="#FFEBEE" strokeWidth="3" strokeDasharray="6 3" />

            {/* Tier 3: Onyx Black Batik */}
            <path d="M10 170 L-10 240 L210 240 L190 170 Z" fill="#1E1E1E" />
            {/* Tier 3 Graphic Prints */}
            <rect x="25" y="195" width="22" height="22" rx="4" fill="none" stroke="#FAFAFA" strokeWidth="2.5" />
            <rect x="70" y="195" width="22" height="22" rx="4" fill="none" stroke="#FAFAFA" strokeWidth="2.5" />
            <rect x="115" y="195" width="22" height="22" rx="4" fill="none" stroke="#FAFAFA" strokeWidth="2.5" />
            <rect x="160" y="195" width="22" height="22" rx="4" fill="none" stroke="#FAFAFA" strokeWidth="2.5" />
          </g>
          <text x="200" y="282" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            THREE-TIER GRAPHIC BATIK
          </text>
        </svg>
      );

    case 'heritage-linear-striped-coord-set':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#F6F4F0" />
          <g transform="translate(80, 20)">
            {/* Striped Buba Silhouette */}
            <path d="M40 30 L80 15 L160 15 L200 30 L220 95 L175 105 L175 220 L65 220 L65 105 L20 95 Z" fill="#00838F" />
            {/* Pattern Striping */}
            <line x1="65" y1="50" x2="175" y2="50" stroke="#D32F2F" strokeWidth="8" />
            <line x1="65" y1="65" x2="175" y2="65" stroke="#121212" strokeWidth="6" />
            <line x1="65" y1="78" x2="175" y2="78" stroke="#4DD0E1" strokeWidth="5" />
            <line x1="65" y1="92" x2="175" y2="92" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="65" y1="105" x2="175" y2="105" stroke="#D32F2F" strokeWidth="8" />
            <line x1="65" y1="120" x2="175" y2="120" stroke="#121212" strokeWidth="6" />
            <line x1="65" y1="133" x2="175" y2="133" stroke="#4DD0E1" strokeWidth="5" />
            <line x1="65" y1="147" x2="175" y2="147" stroke="#D32F2F" strokeWidth="8" />
            <line x1="65" y1="162" x2="175" y2="162" stroke="#121212" strokeWidth="6" />
            <line x1="65" y1="175" x2="175" y2="175" stroke="#4DD0E1" strokeWidth="5" />
            <line x1="65" y1="190" x2="175" y2="190" stroke="#FFFFFF" strokeWidth="3" />
            {/* Split V-Neckline */}
            <polygon points="105,15 135,15 120,55" fill="#F6F4F0" />
            {/* Artisan silver bangle accessory next to it */}
            <circle cx="215" cy="180" r="16" fill="none" stroke="#D0D0D0" strokeWidth="4" />
            <circle cx="215" cy="180" r="13" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" />
          </g>
          <text x="200" y="275" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            HERITAGE WOVEN STRIPE SET
          </text>
        </svg>
      );

    case 'riviera-canvas-bucket-bag':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#FAF8F5" />
          <g transform="translate(110, 30)">
            {/* Top Handle */}
            <path d="M50 90 C50 20, 130 20, 130 90" fill="none" stroke="#9E5324" strokeWidth="8" strokeLinecap="round" />
            {/* Main Canvas Body */}
            <path d="M35 100 L145 100 L155 200 L25 200 Z" fill="#EAE5DC" stroke="#D7D0C5" strokeWidth="1" />
            {/* Textured Canvas Grid */}
            <pattern id="canvasPattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill="#EDE8E0" />
              <rect width="3" height="3" fill="#DFD8CC" />
            </pattern>
            <path d="M35 100 L145 100 L155 200 L25 200 Z" fill="url(#canvasPattern)" opacity="0.6" />

            {/* Tan Saddle Leather Bottom Base */}
            <path d="M25 180 Q90 195 155 180 L158 215 Q90 230 22 215 Z" fill="#9E5324" />
            {/* Tan Saddle Leather Middle Belt & Trim */}
            <path d="M32 120 Q90 135 148 120 L147 132 Q90 147 33 132 Z" fill="#9E5324" />

            {/* Gold Grommets */}
            <circle cx="60" cy="110" r="5" fill="#B99A5B" />
            <circle cx="120" cy="110" r="5" fill="#B99A5B" />
            <circle cx="60" cy="110" r="2.5" fill="#3E2723" />
            <circle cx="120" cy="110" r="2.5" fill="#3E2723" />

            {/* Leather Drawstring cinch */}
            <path d="M60 110 Q90 145 90 185" fill="none" stroke="#B86532" strokeWidth="3" />
            <path d="M120 110 Q90 145 90 185" fill="none" stroke="#B86532" strokeWidth="3" />
            <circle cx="90" cy="150" r="6" fill="#9E5324" stroke="#B99A5B" strokeWidth="1" />
            <circle cx="86" cy="186" r="4" fill="#9E5324" />
            <circle cx="94" cy="188" r="4" fill="#9E5324" />

            {/* Crossbody Strap line */}
            <path d="M25 125 C-10 160, -5 230, 40 235" fill="none" stroke="#9E5324" strokeWidth="4" strokeLinecap="round" />
          </g>
          <text x="200" y="278" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            RIVIERA CANVAS &amp; LEATHER BUCKET
          </text>
        </svg>
      );

    case 'croc-embossed-executive-satchel':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#F7F5F0" />
          <g transform="translate(100, 30)">
            {/* Dual Rolled Handles */}
            <path d="M60 90 C60 25, 140 25, 140 90" fill="none" stroke="#2B1810" strokeWidth="9" strokeLinecap="round" />
            <path d="M60 90 C60 25, 140 25, 140 90" fill="none" stroke="#5D3A29" strokeWidth="3" strokeLinecap="round" />

            {/* Trapezoid Satchel Body in Cognac Patent */}
            <path d="M45 90 L155 90 L180 215 L20 215 Z" fill="#6A2E19" />
            {/* Croc Embossed Tile Grid Overlay */}
            <g opacity="0.4" stroke="#3A170C" strokeWidth="1.2">
              <line x1="30" y1="120" x2="170" y2="120" />
              <line x1="25" y1="150" x2="175" y2="150" />
              <line x1="22" y1="180" x2="178" y2="180" />
              <line x1="60" y1="90" x2="45" y2="215" />
              <line x1="90" y1="90" x2="85" y2="215" />
              <line x1="110" y1="90" x2="115" y2="215" />
              <line x1="140" y1="90" x2="155" y2="215" />
            </g>

            {/* Patent Sheen Highlight */}
            <path d="M50 95 L150 95 L140 110 L60 110 Z" fill="#FFFFFF" opacity="0.15" />

            {/* Handle Straps with Metal Buckles */}
            <rect x="58" y="90" width="16" height="65" rx="3" fill="#4A1E0E" />
            <rect x="126" y="90" width="16" height="65" rx="3" fill="#4A1E0E" />
            {/* Gold Buckle Clasps */}
            <rect x="56" y="145" width="20" height="12" rx="2" fill="#B99A5B" stroke="#8C6E2E" strokeWidth="1" />
            <rect x="124" y="145" width="20" height="12" rx="2" fill="#B99A5B" stroke="#8C6E2E" strokeWidth="1" />

            {/* Brand Metal Bar in Center */}
            <rect x="88" y="125" width="24" height="4" rx="1" fill="#B99A5B" />
          </g>
          <text x="200" y="278" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            STRUCTURED CROC SATCHEL
          </text>
        </svg>
      );

    case 'verona-structured-dome-handbag-set':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#F8F6F2" />
          {/* Main Dome Bag */}
          <g transform="translate(60, 30)">
            {/* Top Handle */}
            <path d="M70 85 C70 15, 150 15, 150 85" fill="none" stroke="#1F1E1D" strokeWidth="8" strokeLinecap="round" />
            {/* Dome Satchel Body */}
            <path
              d="M40 195 C25 150, 60 85, 110 85 C160 85, 195 150, 180 195 L180 205 L40 205 Z"
              fill="#262523"
            />
            {/* Angular Strap Wing Detailing */}
            <path d="M30 145 L75 165 L65 185 L20 165 Z" fill="#1C1B19" />
            <path d="M190 145 L145 165 L155 185 L200 165 Z" fill="#1C1B19" />
            {/* Gold Turnlock Hardware Details */}
            <rect x="68" y="160" width="16" height="16" rx="2" fill="#B99A5B" stroke="#997C3A" strokeWidth="1" transform="rotate(45 76 168)" />
            <rect x="136" y="160" width="16" height="16" rx="2" fill="#B99A5B" stroke="#997C3A" strokeWidth="1" transform="rotate(45 144 168)" />
            {/* Logo Wordmark in Center */}
            <text x="110" y="130" textAnchor="middle" fill="#B99A5B" fontSize="9" fontWeight="600" letterSpacing="2">
              JING&amp;PIN
            </text>
          </g>

          {/* Half-Moon Crescent Pouch in Foreground */}
          <g transform="translate(210, 140)">
            <path d="M10 85 C10 35, 110 35, 110 85 Z" fill="#242321" stroke="#1A1918" strokeWidth="1.5" />
            {/* Zip Line */}
            <path d="M15 82 C15 42, 105 42, 105 82" fill="none" stroke="#B99A5B" strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Gold Zipper Pull */}
            <circle cx="15" cy="80" r="3.5" fill="#B99A5B" />
            <rect x="13" y="80" width="4" height="10" rx="1" fill="#B99A5B" />
          </g>

          <text x="200" y="278" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            VERONA DOME &amp; POUCH 2-PIECE SET
          </text>
        </svg>
      );

    case 'artisan-textured-silver-bangle':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#F9F8F6" />
          {/* Subtle Textured Linen Surface Background */}
          <g transform="translate(130, 60)">
            {/* Shadow */}
            <ellipse cx="70" cy="95" rx="72" ry="72" fill="#000000" opacity="0.06" />

            {/* Ribbed Twisted Cable Bangle */}
            <circle cx="70" cy="90" r="62" fill="none" stroke="#D1D5DB" strokeWidth="14" />
            <circle cx="70" cy="90" r="62" fill="none" stroke="#9CA3AF" strokeWidth="14" strokeDasharray="4 6" />
            <circle cx="70" cy="90" r="65" fill="none" stroke="#F3F4F6" strokeWidth="2" />
            <circle cx="70" cy="90" r="59" fill="none" stroke="#4B5563" strokeWidth="1.5" />

            {/* Split Opening with Spherical Endcaps */}
            <rect x="120" y="65" width="25" height="50" fill="#F9F8F6" />
            <circle cx="120" cy="70" r="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" />
            <circle cx="120" cy="110" r="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" />
            <circle cx="118" cy="68" r="3" fill="#FFFFFF" />
            <circle cx="118" cy="108" r="3" fill="#FFFFFF" />
          </g>
          <text x="200" y="275" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            ARTISAN TWISTED SILVER CUFF
          </text>
        </svg>
      );

    case 'croc-embossed-monogram-clutch':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#F5F3EF" />
          <g transform="translate(100, 60)">
            {/* Detachable Silver Link Chain */}
            <path d="M20 50 C20 -15, 180 -15, 180 50" fill="none" stroke="#D1D5DB" strokeWidth="3" strokeDasharray="4 3" />

            {/* Ivory Croc Clutch Body */}
            <rect x="20" y="40" width="160" height="120" rx="8" fill="#FDFBF7" stroke="#E6E0D6" strokeWidth="1.5" />
            {/* Croc Grid Texturing */}
            <g opacity="0.3" stroke="#C5BDB0" strokeWidth="1">
              <line x1="20" y1="70" x2="180" y2="70" />
              <line x1="20" y1="100" x2="180" y2="100" />
              <line x1="20" y1="130" x2="180" y2="130" />
              <line x1="60" y1="40" x2="60" y2="160" />
              <line x1="100" y1="40" x2="100" y2="160" />
              <line x1="140" y1="40" x2="140" y2="160" />
            </g>

            {/* Envelope Flap Cut */}
            <path d="M20 40 L100 95 L180 40" fill="none" stroke="#D7D0C5" strokeWidth="1.5" />

            {/* Oval Monogram Emblem (Gold Tone) */}
            <ellipse cx="100" cy="95" rx="18" ry="14" fill="#FBF9F5" stroke="#B99A5B" strokeWidth="2" />
            <text x="100" y="100" textAnchor="middle" fill="#B99A5B" fontSize="11" fontWeight="bold" fontFamily="serif">
              BW
            </text>
          </g>
          <text x="200" y="275" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            IVORY CROC MONOGRAM CLUTCH
          </text>
        </svg>
      );

    case 'radiant-glow-hydrating-primer-mist':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#F8F6F4" />
          <g transform="translate(150, 40)">
            {/* Mist Spray Cap */}
            <rect x="38" y="15" width="24" height="28" rx="2" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
            <rect x="44" y="5" width="12" height="10" rx="1" fill="#B99A5B" />
            {/* Frosted Glass Bottle */}
            <rect x="25" y="43" width="50" height="150" rx="12" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
            {/* Golden Hydrating Liquid Core */}
            <rect x="29" y="85" width="42" height="102" rx="8" fill="#FDF6E2" opacity="0.8" />
            {/* Fine Mist Spritz Sparks */}
            <circle cx="65" cy="-2" r="1.5" fill="#B99A5B" opacity="0.6" />
            <circle cx="72" cy="8" r="1" fill="#B99A5B" opacity="0.5" />
            <circle cx="80" cy="-6" r="2" fill="#B99A5B" opacity="0.7" />
            {/* Clean Minimalist Label */}
            <rect x="33" y="95" width="34" height="45" fill="#FAF9F6" />
            <line x1="38" y1="105" x2="62" y2="105" stroke="#B99A5B" strokeWidth="1" />
            <text x="50" y="120" textAnchor="middle" fill="#171717" fontSize="6" fontWeight="600" letterSpacing="1">
              BOLA
            </text>
            <text x="50" y="129" textAnchor="middle" fill="#71717A" fontSize="4.5" letterSpacing="0.5">
              RADIANCE
            </text>
          </g>
          <text x="200" y="275" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            RADIANT GLOW PRIMER &amp; SETTING MIST
          </text>
        </svg>
      );

    case 'velvet-matte-longwear-lip-stain':
      return (
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full p-4 transition-transform duration-500 hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="300" fill="#FAF7F6" />
          <g transform="translate(130, 40)">
            {/* Matte Gold Square Cap */}
            <rect x="35" y="10" width="30" height="60" rx="2" fill="#B99A5B" stroke="#A38446" strokeWidth="1" />
            <line x1="35" y1="70" x2="65" y2="70" stroke="#78350F" strokeWidth="1" />
            {/* Frosted Acrylic Base Tube with Rich Crimson Liquid */}
            <rect x="35" y="70" width="30" height="110" rx="3" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
            <rect x="39" y="80" width="22" height="92" rx="2" fill="#991B1B" />
            {/* Lip Stain Applicator Wand resting beside tube */}
            <rect x="85" y="45" width="4" height="100" rx="1" fill="#D1D5DB" />
            <rect x="82" y="15" width="10" height="30" rx="2" fill="#B99A5B" />
            {/* Soft Doe-foot Applicator in Velvet Crimson */}
            <path d="M83 145 C83 140, 91 140, 91 145 L88 165 C87 167, 85 167, 84 165 Z" fill="#991B1B" />
            {/* Pigment Swatch in Foreground */}
            <path d="M-10 185 Q40 170 120 188 Q60 205 -10 185 Z" fill="#991B1B" opacity="0.85" />
          </g>
          <text x="200" y="275" textAnchor="middle" fill="#626262" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="2">
            VELVET MATTE LIP STAIN
          </text>
        </svg>
      );

    default:
      // Generic luxury category-based fallback
      return <GenericEditorialVisual category={category} name={name} />;
  }
}

function EditorialCategoryIllustration({ slug, name }: { slug: string; name: string }) {
  if (slug === 'wears') {
    return (
      <svg viewBox="0 0 500 350" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="350" fill="#F4EFEA" />
        <circle cx="150" cy="180" r="110" fill="#1B5E20" opacity="0.12" />
        <circle cx="350" cy="160" r="90" fill="#0D47A1" opacity="0.10" />
        {/* Tiered & Swirl Textile Silhouette */}
        <path d="M120 100 L200 60 L280 100 L340 320 L60 320 Z" fill="#1B5E20" opacity="0.85" />
        <circle cx="200" cy="190" r="45" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeDasharray="18 8" />
        <circle cx="200" cy="190" r="22" fill="#0D47A1" />
        <circle cx="200" cy="190" r="10" fill="#FFFFFF" />
        <rect x="50" y="260" width="300" height="60" fill="#C62828" opacity="0.9" />
      </svg>
    );
  }
  if (slug === 'bags') {
    return (
      <svg viewBox="0 0 500 350" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="350" fill="#F7F4EE" />
        <circle cx="250" cy="180" r="130" fill="#B99A5B" opacity="0.12" />
        {/* Satchel & Bucket Duo Outline */}
        <g transform="translate(150, 60)">
          <path d="M40 80 C40 20, 120 20, 120 80" fill="none" stroke="#2B1810" strokeWidth="8" />
          <path d="M25 80 L135 80 L160 210 L0 210 Z" fill="#5D2817" />
          <rect x="35" y="130" width="18" height="12" rx="2" fill="#B99A5B" />
          <rect x="105" y="130" width="18" height="12" rx="2" fill="#B99A5B" />
        </g>
      </svg>
    );
  }
  if (slug === 'accessories') {
    return (
      <svg viewBox="0 0 500 350" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="350" fill="#F8F6F2" />
        <circle cx="200" cy="175" r="75" fill="none" stroke="#D1D5DB" strokeWidth="16" />
        <circle cx="200" cy="175" r="75" fill="none" stroke="#9CA3AF" strokeWidth="16" strokeDasharray="6 8" />
        {/* Clutch */}
        <rect x="230" y="140" width="170" height="110" rx="8" fill="#FDFBF7" stroke="#B99A5B" strokeWidth="2" />
        <ellipse cx="315" cy="185" rx="16" ry="12" fill="none" stroke="#B99A5B" strokeWidth="1.5" />
      </svg>
    );
  }
  // Cosmetics
  return (
    <svg viewBox="0 0 500 350" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="350" fill="#FAF7F5" />
      <circle cx="250" cy="175" r="100" fill="#FDF2E9" />
      <rect x="190" y="90" width="45" height="140" rx="10" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
      <rect x="200" y="65" width="25" height="25" rx="2" fill="#B99A5B" />
      <rect x="260" y="110" width="30" height="120" rx="4" fill="#881337" />
      <rect x="260" y="60" width="30" height="50" rx="2" fill="#B99A5B" />
    </svg>
  );
}

function GenericEditorialVisual({ category, name }: { category: string; name: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FBF9F6]">
      <div className="w-16 h-16 rounded-full border border-[#E9E6E0] flex items-center justify-center mb-3 text-[#B99A5B]">
        <span className="font-serif text-xl italic font-semibold">BW</span>
      </div>
      <p className="text-xs uppercase tracking-widest text-[#71717A] mb-1 font-medium">{category}</p>
      <p className="font-serif text-base text-[#171717] font-medium max-w-[200px] line-clamp-1">{name}</p>
    </div>
  );
}
