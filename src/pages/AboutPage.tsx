import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Sparkles, Shield, ArrowRight, MessageCircle } from 'lucide-react';
import { createGeneralInquiryWhatsappUrl } from '../utils/whatsapp';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { settings } = useStore();

  const chatWhatsappUrl = createGeneralInquiryWhatsappUrl(
    settings.whatsappNumber,
    'About Bola Wardrobe Inquiry',
    'Hello Bola Wardrobe, I would love to learn more about your brand and custom styling.'
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      
      {/* Editorial Header */}
      <section className="bg-white border-b border-[#E9E6E0] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-3">
            Our Brand Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#171717] tracking-tight mb-6 text-balance">
            Your Style, Beautifully Within Reach.
          </h1>
          <p className="text-base sm:text-lg text-[#626262] leading-relaxed max-w-2xl mx-auto">
            Bola Wardrobe was established to bring thoughtful curation, timeless femininity, and modern elegance to everyday women without excessive luxury markups.
          </p>
        </div>
      </section>

      {/* Brand Vision & Mission Section */}
      <section className="py-20 border-b border-[#E9E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Box */}
            <div className="lg:col-span-5">
              <div className="bg-white p-4 border border-[#E9E6E0] rounded-sm shadow-2xs">
                <div className="aspect-[4/5] bg-[#F4EFEA] rounded-xs overflow-hidden flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full border border-[#B99A5B] flex items-center justify-center text-[#B99A5B] mb-6">
                    <span className="font-serif text-3xl font-bold">BW</span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#171717] mb-2">
                    Bola Wardrobe
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold mb-4">
                    Atelier &amp; Boutique
                  </p>
                  <p className="text-xs text-[#626262] leading-relaxed italic max-w-xs">
                    “Classy fashion. Thoughtful choices. Everyday elegance.”
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Prose */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold">
                The Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171717]">
                A Thoughtful Approach to Dressing
              </h2>

              <p className="text-sm text-[#626262] leading-relaxed">
                At Bola Wardrobe, we believe fashion is deeply personal. What you wear shapes how you enter a room, how you feel about yourself, and how you engage with your day. Yet, so much of modern fashion is trapped between poor quality disposable wear and inaccessible designer pricing.
              </p>

              <p className="text-sm text-[#626262] leading-relaxed">
                We fill this space with intention: handpicked ready-to-wear clothing including bespoke artisanal Adire and vibrant Batik co-ords, structured croc-embossed and pebble grain handbags, fine accessory accents, and gentle clean cosmetics.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E9E6E0]">
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#171717] mb-1">
                    Our Mission
                  </h4>
                  <p className="text-xs text-[#626262] leading-relaxed">
                    To make quality, stylish fashion accessible and affordable while helping women feel confident and poised in their everyday lifestyle.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#171717] mb-1">
                    Our Vision
                  </h4>
                  <p className="text-xs text-[#626262] leading-relaxed">
                    To build a recognized and trusted fashion destination celebrated for authentic quality, thoughtful recommendations, and genuine customer care.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] transition-colors rounded-sm"
                >
                  Explore the Collections
                </button>
                <a
                  href={chatWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#171717] border border-[#E9E6E0] hover:border-[#25D366] hover:text-[#25D366] transition-colors rounded-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Chat With Us</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Pillars Detail */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
              Our Commitments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171717] mb-3">
              What Sets Bola Wardrobe Apart
            </h2>
            <p className="text-xs sm:text-sm text-[#626262]">
              We respect your time, style preferences, and investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#FAF8F5] border border-[#E9E6E0] rounded-sm">
              <Sparkles className="w-6 h-6 text-[#B99A5B] mb-4" />
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2">
                Curated, Not Mass-Produced
              </h3>
              <p className="text-xs text-[#626262] leading-relaxed">
                We select limited quantities of unique pieces rather than thousands of generic items. This guarantees that your style remains distinctive and fresh.
              </p>
            </div>

            <div className="p-8 bg-[#FAF8F5] border border-[#E9E6E0] rounded-sm">
              <Shield className="w-6 h-6 text-[#B99A5B] mb-4" />
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2">
                Physical Quality Inspection
              </h3>
              <p className="text-xs text-[#626262] leading-relaxed">
                Before any wear, handbag, or accessory is packaged, seams, zipper slides, linings, and dye consistency are examined by hand.
              </p>
            </div>

            <div className="p-8 bg-[#FAF8F5] border border-[#E9E6E0] rounded-sm">
              <Heart className="w-6 h-6 text-[#B99A5B] mb-4" />
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2">
                Attentive WhatsApp Support
              </h3>
              <p className="text-xs text-[#626262] leading-relaxed">
                We don’t hide behind automated chatbots. Real stylists answer your questions, assist with measurements, and verify deliveries.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
