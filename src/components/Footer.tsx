import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, Mail, Clock, Instagram, Facebook, ArrowUpRight, Lock } from 'lucide-react';
import { createGeneralInquiryWhatsappUrl } from '../utils/whatsapp';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings, categories } = useStore();
  const currentYear = new Date().getFullYear();

  const whatsappInquiryUrl = createGeneralInquiryWhatsappUrl(
    settings.whatsappNumber,
    'Footer Inquiry',
    'Hello Bola Wardrobe, I would like to make an inquiry regarding your collections.'
  );

  return (
    <footer className="bg-[#121212] text-[#FAF8F5] pt-16 pb-12 border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#262626]">
          
          {/* Column 1: Brand & Promise (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col pr-0 lg:pr-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="inline-block mb-4"
            >
              <span className="font-serif text-3xl font-bold tracking-tight text-white hover:text-[#B99A5B] transition-colors">
                {settings.brandName || 'Bola Wardrobe'}
              </span>
            </a>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 max-w-sm">
              {settings.supportingStatement ||
                'Discover thoughtfully selected fashion pieces that make everyday dressing feel special, without stretching your budget.'}
            </p>

            <div className="flex flex-col gap-2.5 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#B99A5B]" />
                <span>{settings.businessHours || 'Monday – Saturday: 9:00 AM – 7:00 PM (WAT)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B99A5B]" />
                <a
                  href={`mailto:${settings.businessEmail || 'ismailrofiatbolanle@gmail.com'}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.businessEmail || 'ismailrofiatbolanle@gmail.com'}
                </a>
              </div>
            </div>

            {/* WhatsApp Direct Action */}
            <div className="mt-6">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 bg-[#25D366] text-white hover:bg-[#20b858] transition-colors rounded-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order or Inquire via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="flex flex-col">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide uppercase mb-4 text-[#B99A5B]">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D4D4D8]">
              <li>
                <a
                  href="/shop"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/shop');
                  }}
                  className="hover:text-[#B99A5B] transition-colors"
                >
                  All Shop
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/shop/${cat.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/shop/${cat.slug}`);
                    }}
                    className="hover:text-[#B99A5B] transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: The Boutique */}
          <div className="flex flex-col">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide uppercase mb-4 text-[#B99A5B]">
              The Boutique
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D4D4D8]">
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                  }}
                  className="hover:text-[#B99A5B] transition-colors"
                >
                  About Bola Wardrobe
                </a>
              </li>
              <li>
                <a
                  href="/book"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/book');
                  }}
                  className="hover:text-[#B99A5B] transition-colors flex items-center gap-1 text-[#FAF8F5]"
                >
                  <span>Book a Consultation</span>
                  <ArrowUpRight className="w-3 h-3 text-[#B99A5B]" />
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                  }}
                  className="hover:text-[#B99A5B] transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/order-information"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/order-information');
                  }}
                  className="hover:text-[#B99A5B] transition-colors"
                >
                  Order Information
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/faq');
                  }}
                  className="hover:text-[#B99A5B] transition-colors"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Care & Legal */}
          <div className="flex flex-col">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide uppercase mb-4 text-[#B99A5B]">
              Client Care &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D4D4D8]">
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/privacy-policy');
                  }}
                  className="hover:text-[#B99A5B] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/terms');
                  }}
                  className="hover:text-[#B99A5B] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-6">
              <span className="text-xs uppercase tracking-wider text-[#A1A1AA] font-medium block mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Bola Wardrobe on Instagram"
                    className="p-2 bg-[#222222] rounded-full text-white hover:text-[#B99A5B] hover:bg-[#2e2e2e] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with Bola Wardrobe on Facebook"
                    className="p-2 bg-[#222222] rounded-full text-white hover:text-[#B99A5B] hover:bg-[#2e2e2e] transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.tiktokUrl && (
                  <a
                    href={settings.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Bola Wardrobe on TikTok"
                    className="p-2 bg-[#222222] rounded-full text-white hover:text-[#B99A5B] hover:bg-[#2e2e2e] transition-colors text-xs font-bold"
                  >
                    TT
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <div className="flex items-center gap-2">
            <p>© {currentYear} Bola Wardrobe. All rights reserved.</p>
            <button
              onClick={() => navigate('/admin')}
              className="text-[#52525B] hover:text-[#B99A5B] transition-colors p-1"
              title="Admin Portal (Staff Only)"
              aria-label="Staff Login"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <p className="text-center sm:text-right">
            Your Style, Beautifully Within Reach. · Classy fashion, thoughtful choices, everyday elegance.
          </p>
        </div>
      </div>
    </footer>
  );
};
