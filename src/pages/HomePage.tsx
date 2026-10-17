import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryVisual } from '../components/ProductVisual';
import {
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Calendar,
  Instagram,
  Facebook,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { createGeneralInquiryWhatsappUrl } from '../utils/whatsapp';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { products, categories, settings, submitContactMessage } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const featuredProducts = products.filter((p) => p.isFeatured && p.isPublished).slice(0, 6);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.filter((p) => p.isPublished).slice(0, 6);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterConsent) return;
    setNewsletterSubmitted(true);

    const emailRecipient = 'ismailrofiatbolanle@gmail.com';
    const emailSubject = `[VIP Newsletter Subscription] ${newsletterEmail}`;
    const emailBody = `New VIP Newsletter Subscriber:\n\nEmail: ${newsletterEmail}\nDate: ${new Date().toLocaleString()}\nConsent: Verified\n\n---\nSent from Bola Wardrobe Online Boutique`;
    const mailtoUrl = `mailto:${emailRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    submitContactMessage({
      name: 'Newsletter Subscriber',
      contact: newsletterEmail,
      subject: 'VIP Style Newsletter Subscription',
      message: `Subscribed with email: ${newsletterEmail}`,
    });

    try {
      window.location.href = mailtoUrl;
    } catch {
      // fallback
    }
  };

  const consultationWhatsappUrl = createGeneralInquiryWhatsappUrl(
    settings.whatsappNumber,
    'Styling Advice Request',
    'Hello Bola Wardrobe, I would love some styling recommendations for an upcoming occasion.'
  );

  return (
    <div className="flex flex-col w-full">
      
      {/* SECTION 1 & 2: Handled globally (AnnouncementBar & Header) */}

      {/* SECTION 3: EDITORIAL HERO SECTION */}
      <section className="relative bg-[#FAF9F6] border-b border-[#E9E6E0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Prose & Call to Actions */}
            <div className="lg:col-span-7 flex flex-col items-start z-10">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B99A5B] font-semibold mb-4">
                <span>The Bola Wardrobe Edit</span>
                <span className="w-8 h-px bg-[#B99A5B]" aria-hidden="true" />
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#171717] leading-[1.1] mb-6 text-balance">
                Style That Feels Like You.
              </h1>

              <p className="text-base sm:text-lg text-[#626262] leading-relaxed max-w-xl mb-8">
                Discover classy ready-to-wear pieces, beautiful accessories, and everyday essentials curated to complement your personal style—thoughtfully selected to make dressing feel special.
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="w-full sm:w-auto px-7 py-3.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] transition-colors rounded-sm shadow-sm text-center"
                >
                  Explore the Collection
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#171717] bg-white border border-[#E9E6E0] hover:border-[#B99A5B] hover:text-[#B99A5B] transition-colors rounded-sm text-center"
                >
                  Discover Our Story
                </button>
              </div>

              {/* Service Assurance Badges */}
              <div className="pt-10 mt-8 border-t border-[#E9E6E0]/80 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-[#626262]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B99A5B] shrink-0" />
                  <span>Quality-Inspected</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Direct WhatsApp Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B99A5B] shrink-0" />
                  <span>Personal Advice</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Hero Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative subtle border frame */}
                <div className="absolute -inset-3 border border-[#B99A5B]/30 rounded-sm pointer-events-none transform translate-x-2 translate-y-2 hidden sm:block" />
                
                {/* Main Hero Showcase Box */}
                <div className="relative bg-white p-3 border border-[#E9E6E0] shadow-sm rounded-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#F4EFEA] rounded-xs">
                    {/* Real Editorial Hero Image */}
                    <img
                      src="/images/hero.jpg"
                      alt="Bola Wardrobe Editorial Luxury Fashion"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {/* Floating Luxury Editorial Badge */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 border border-[#E9E6E0] rounded-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-[#B99A5B] font-semibold">
                            Everyday Elegance
                          </p>
                          <p className="font-serif text-sm font-semibold text-[#171717]">
                            Curated Wears &amp; Handcrafted Leather
                          </p>
                        </div>
                        <span className="text-xs text-[#71717A] tracking-wider uppercase font-medium">
                          2026 Edit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: SHOP BY CATEGORY (Editorial Asymmetric Grid) */}
      <section className="py-20 bg-white border-b border-[#E9E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
                Curated Departments
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight">
                Shop by Category
              </h2>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#B99A5B] transition-colors"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-4 h-4 text-[#B99A5B]" />
            </button>
          </div>

          {/* 4 Distinctive Category Tiles in Editorial Composition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => navigate(`/shop/${category.slug}`)}
                className="group relative flex flex-col bg-[#FAF8F5] border border-[#E9E6E0] rounded-sm overflow-hidden hover:border-[#B99A5B] transition-all duration-300 cursor-pointer"
              >
                {/* Visual Artwork */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F4EFEA] border-b border-[#E9E6E0]">
                  <CategoryVisual categorySlug={category.slug} name={category.name} imageUrl={category.image} />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-[#171717] group-hover:text-[#B99A5B] transition-colors mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-[#71717A] font-medium tracking-wide mb-3">
                      {category.tagline}
                    </p>
                    <p className="text-xs text-[#626262] leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 flex items-center justify-between border-t border-[#E9E6E0]/60">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#171717] group-hover:text-[#B99A5B] transition-colors">
                      Explore Collection
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B99A5B] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: FEATURED COLLECTION */}
      <section className="py-20 bg-[#FAF9F6] border-b border-[#E9E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
              The Curated Showcase
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight mb-3">
              Selected for Your Everyday
            </h2>
            <p className="text-sm text-[#626262] leading-relaxed">
              Thoughtful pieces that make getting dressed feel effortless. Order easily with one click to chat directly with our team on WhatsApp.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#171717] hover:bg-[#B99A5B] transition-colors rounded-sm shadow-sm"
            >
              <span>Explore Complete Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 6: THE BOLA WARDROBE DIFFERENCE */}
      <section className="py-20 bg-white border-b border-[#E9E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
              Our Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight mb-3">
              Looking Good Should Feel Good.
            </h2>
            <p className="text-sm text-[#626262]">
              Feminine, classy, and dependable fashion created to make you feel confident every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 bg-[#FAF8F5] border border-[#E9E6E0] rounded-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#B99A5B]/30 flex items-center justify-center text-[#B99A5B] mb-5 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-3">
                Thoughtfully Selected
              </h3>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed">
                Every print, bag silhouette, and accessory is carefully vetted for comfort, durability, and versatility, ensuring each item earns a lasting place in your wardrobe.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 bg-[#FAF8F5] border border-[#E9E6E0] rounded-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#B99A5B]/30 flex items-center justify-center text-[#B99A5B] mb-5 shadow-2xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-3">
                Style Within Reach
              </h3>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed">
                Elevated aesthetics without unnecessary markups. We believe that stepping out in confidence should never require stretching your financial peace of mind.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 bg-[#FAF8F5] border border-[#E9E6E0] rounded-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white border border-[#B99A5B]/30 flex items-center justify-center text-[#B99A5B] mb-5 shadow-2xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-3">
                Personal Recommendations
              </h3>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed">
                Not sure about fit, colorways, or event pairings? Our direct WhatsApp concierge provides friendly, genuine styling advice before you finalize your order.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7: THE STYLE EDIT / INSPIRATION */}
      <section className="py-20 bg-[#FAF9F6] border-b border-[#E9E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
                Editorial Styling
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171717] tracking-tight">
                The Style Edit
              </h2>
            </div>
            <p className="text-xs text-[#71717A] max-w-xs">
              Curated pairings and seasonal style directions thoughtfully assembled for your lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div
              onClick={() => navigate('/shop/wears')}
              className="bg-white border border-[#E9E6E0] p-6 rounded-sm cursor-pointer hover:border-[#B99A5B] transition-colors group"
            >
              <div className="aspect-[4/3] bg-[#F4EFEA] mb-5 overflow-hidden rounded-xs flex items-center justify-center p-4">
                <span className="font-serif text-2xl text-[#171717] font-semibold group-hover:text-[#B99A5B] transition-colors text-center">
                  Modern Heritage &amp; Contemporary Co-ords
                </span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B99A5B] block mb-1">
                Occasion Styling
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2 group-hover:text-[#B99A5B] transition-colors">
                The Art of Artisanal Adire
              </h3>
              <p className="text-xs text-[#626262] leading-relaxed mb-4">
                Pair our Adire Swirl wide-leg set with a structured Croc Satchel in Glossy Onyx for an effortless weekend gathering or celebration.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#171717] group-hover:text-[#B99A5B]">
                <span>Discover Look</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B99A5B]" />
              </span>
            </div>

            {/* Story 2 */}
            <div
              onClick={() => navigate('/shop/bags')}
              className="bg-white border border-[#E9E6E0] p-6 rounded-sm cursor-pointer hover:border-[#B99A5B] transition-colors group"
            >
              <div className="aspect-[4/3] bg-[#F7F4EE] mb-5 overflow-hidden rounded-xs flex items-center justify-center p-4">
                <span className="font-serif text-2xl text-[#171717] font-semibold group-hover:text-[#B99A5B] transition-colors text-center">
                  The Structured Silhouette
                </span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B99A5B] block mb-1">
                Everyday Essentials
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2 group-hover:text-[#B99A5B] transition-colors">
                Saddle &amp; Canvas Harmony
              </h3>
              <p className="text-xs text-[#626262] leading-relaxed mb-4">
                Combine the Riviera Canvas Bucket Bag with understated silver cuffs for a relaxed yet distinctly sophisticated daytime presence.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#171717] group-hover:text-[#B99A5B]">
                <span>Discover Bags</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B99A5B]" />
              </span>
            </div>

            {/* Story 3 */}
            <div
              onClick={() => navigate('/shop/cosmetics')}
              className="bg-white border border-[#E9E6E0] p-6 rounded-sm cursor-pointer hover:border-[#B99A5B] transition-colors group"
            >
              <div className="aspect-[4/3] bg-[#FAF7F5] mb-5 overflow-hidden rounded-xs flex items-center justify-center p-4">
                <span className="font-serif text-2xl text-[#171717] font-semibold group-hover:text-[#B99A5B] transition-colors text-center">
                  Subtle Everyday Radiance
                </span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B99A5B] block mb-1">
                Beauty Direction
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2 group-hover:text-[#B99A5B] transition-colors">
                Luminous Skin &amp; Velvet Lips
              </h3>
              <p className="text-xs text-[#626262] leading-relaxed mb-4">
                Prep skin with the Radiant Glow Hyaluronic Mist and finish with Velvet Matte Lip Stain in Nude Allure for an all-day fresh finish.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#171717] group-hover:text-[#B99A5B]">
                <span>Discover Cosmetics</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B99A5B]" />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8: STYLING CONSULTATION BANNER */}
      <section className="py-16 bg-[#171717] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-3">
            Concierge Styling Assistance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 text-balance">
            Need a Little Style Direction?
          </h2>
          <p className="text-sm sm:text-base text-[#D4D4D8] max-w-xl mx-auto leading-relaxed mb-8">
            Tell us what you’re looking for—whether for a special event, wardrobe refresh, or thoughtful gift—and let’s find pieces that fit your style and personality.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/book')}
              className="px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-[#B99A5B] text-[#171717] hover:bg-white transition-colors rounded-sm shadow-sm flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Styling Consultation</span>
            </button>
            <a
              href={consultationWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white border border-white/20 hover:border-[#25D366] hover:text-[#25D366] transition-colors rounded-sm flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Ask via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 9: BRAND TRUST & SERVICE INFORMATION */}
      <section className="py-16 bg-white border-b border-[#E9E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex flex-col items-start p-4">
              <span className="font-serif text-2xl font-bold text-[#B99A5B] mb-2">01</span>
              <h4 className="font-serif text-lg font-semibold text-[#171717] mb-2">
                Thoughtful Selection
              </h4>
              <p className="text-xs text-[#626262] leading-relaxed">
                Hand-picked fabrics, sturdy hardware, and durable construction verified before being cataloged.
              </p>
            </div>

            <div className="flex flex-col items-start p-4">
              <span className="font-serif text-2xl font-bold text-[#B99A5B] mb-2">02</span>
              <h4 className="font-serif text-lg font-semibold text-[#171717] mb-2">
                Clear Stock Checks
              </h4>
              <p className="text-xs text-[#626262] leading-relaxed">
                We double-check physical availability, exact measurements, and color variations before finalizing any order.
              </p>
            </div>

            <div className="flex flex-col items-start p-4">
              <span className="font-serif text-2xl font-bold text-[#B99A5B] mb-2">03</span>
              <h4 className="font-serif text-lg font-semibold text-[#171717] mb-2">
                WhatsApp Transparency
              </h4>
              <p className="text-xs text-[#626262] leading-relaxed">
                Real-time conversation with our dedicated store concierge for questions, sizing guidance, and delivery tracking.
              </p>
            </div>

            <div className="flex flex-col items-start p-4">
              <span className="font-serif text-2xl font-bold text-[#B99A5B] mb-2">04</span>
              <h4 className="font-serif text-lg font-semibold text-[#171717] mb-2">
                Dependable Handoff
              </h4>
              <p className="text-xs text-[#626262] leading-relaxed">
                Prompt dispatch with verified local courier partners and order updates sent straight to your chat.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 10: SOCIAL MEDIA DISCOVERY */}
      <section className="py-16 bg-[#FAF8F5] border-b border-[#E9E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
            Social Community
          </span>
          <h2 className="font-serif text-3xl font-semibold text-[#171717] tracking-tight mb-3">
            Style Beyond the Store
          </h2>
          <p className="text-sm text-[#626262] max-w-md mx-auto mb-8">
            Follow our styling sessions, new fabric arrivals, and customer features across social channels.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E9E6E0] rounded-sm text-xs font-semibold text-[#171717] hover:border-[#B99A5B] hover:text-[#B99A5B] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#B99A5B]" />
                <span>Instagram</span>
              </a>
            )}
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E9E6E0] rounded-sm text-xs font-semibold text-[#171717] hover:border-[#B99A5B] hover:text-[#B99A5B] transition-colors"
              >
                <Facebook className="w-4 h-4 text-[#B99A5B]" />
                <span>Facebook</span>
              </a>
            )}
            {settings.tiktokUrl && (
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E9E6E0] rounded-sm text-xs font-semibold text-[#171717] hover:border-[#B99A5B] hover:text-[#B99A5B] transition-colors"
              >
                <span className="font-bold text-[#B99A5B] text-xs">TT</span>
                <span>TikTok</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 11: NEWSLETTER / VIP STYLING CIRCLE */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
            The Private Circle
          </span>
          <h2 className="font-serif text-3xl font-semibold text-[#171717] tracking-tight mb-3">
            Stay in the Style Loop
          </h2>
          <p className="text-xs sm:text-sm text-[#626262] leading-relaxed mb-6">
            Receive early previews of new ready-to-wear drops, exclusive bag arrivals, and seasonal styling recommendations.
          </p>

          {newsletterSubmitted ? (
            <div className="p-4 bg-[#F8F6F2] border border-[#B99A5B]/40 text-[#171717] rounded-sm text-xs font-medium">
              Thank you for subscribing! You will receive our next styling edit directly in your inbox.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="flex-1 px-4 py-3 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-sm text-[#171717]"
                />
                <button
                  type="submit"
                  disabled={!newsletterConsent}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </div>

              <label className="flex items-start justify-center gap-2 text-[11px] text-[#71717A] text-left cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={newsletterConsent}
                  onChange={(e) => setNewsletterConsent(e.target.checked)}
                  required
                  className="mt-0.5 rounded-xs accent-[#B99A5B]"
                />
                <span>
                  I consent to receiving style updates from Bola Wardrobe. You can unsubscribe at any time. Read our{' '}
                  <a
                    href="/privacy-policy"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/privacy-policy');
                    }}
                    className="underline hover:text-[#B99A5B]"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
