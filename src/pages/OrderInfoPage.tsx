import React from 'react';
import { MessageCircle, CheckCircle2, Truck, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { createGeneralInquiryWhatsappUrl } from '../utils/whatsapp';

interface OrderInfoPageProps {
  navigate: (path: string) => void;
}

export const OrderInfoPage: React.FC<OrderInfoPageProps> = ({ navigate }) => {
  const { settings } = useStore();

  const chatWhatsappUrl = createGeneralInquiryWhatsappUrl(
    settings.whatsappNumber,
    'Order Inquiry',
    'Hello Bola Wardrobe, I would like to inquire about placing an order and delivery options.'
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
            Shopping Guide
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#171717] tracking-tight mb-4">
            How WhatsApp Ordering Works
          </h1>
          <p className="text-sm sm:text-base text-[#626262] leading-relaxed">
            Bola Wardrobe operates a personalized, boutique-assisted shopping experience. We confirm physical stock, measurements, and color variations before taking payment.
          </p>
        </div>

        {/* Step-by-Step Flow */}
        <div className="space-y-6 mb-16">
          
          <div className="bg-white border border-[#E9E6E0] p-6 sm:p-8 rounded-sm shadow-2xs flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#B99A5B] text-[#B99A5B] flex items-center justify-center shrink-0 font-serif text-xl font-bold">
              1
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2">
                Browse &amp; Select Your Preferred Options
              </h3>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed">
                Explore our catalog of ready-to-wear clothing, croc &amp; canvas handbags, jewelry cuffs, and beauty products. Choose your preferred size (e.g. UK 10/M), colorway, and quantity on the product details page.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E9E6E0] p-6 sm:p-8 rounded-sm shadow-2xs flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#B99A5B] text-[#B99A5B] flex items-center justify-center shrink-0 font-serif text-xl font-bold">
              2
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2">
                Click “Order on WhatsApp”
              </h3>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed">
                A single tap automatically prepares a neat message with the exact item name, chosen options, quantity, and product link. WhatsApp will open with this message prefilled—all you have to do is hit Send.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E9E6E0] p-6 sm:p-8 rounded-sm shadow-2xs flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#B99A5B] text-[#B99A5B] flex items-center justify-center shrink-0 font-serif text-xl font-bold">
              3
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2">
                Stock &amp; Fit Verification
              </h3>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed">
                Our store manager checks our physical studio inventory, answers any measurement questions you have, and can share close-up video clips of the fabric or handbag if requested.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E9E6E0] p-6 sm:p-8 rounded-sm shadow-2xs flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#B99A5B] text-[#B99A5B] flex items-center justify-center shrink-0 font-serif text-xl font-bold">
              4
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2">
                Payment Details &amp; Secure Confirmation
              </h3>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed">
                Once you are 100% satisfied with the item, our team provides our official business bank transfer details. We never ask for sensitive card numbers online.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E9E6E0] p-6 sm:p-8 rounded-sm shadow-2xs flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#B99A5B] text-[#B99A5B] flex items-center justify-center shrink-0 font-serif text-xl font-bold">
              5
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-2">
                Packaging &amp; Tracked Delivery
              </h3>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed">
                Your piece is hand-inspected, wrapped in signature boutique dustbags or packaging, and dispatched through dependable courier services with tracking updates sent directly to your WhatsApp chat.
              </p>
            </div>
          </div>

        </div>

        {/* Action Banner */}
        <div className="bg-[#171717] text-white p-8 rounded-sm text-center">
          <h3 className="font-serif text-2xl font-semibold mb-2">
            Ready to Find Your Next Piece?
          </h3>
          <p className="text-xs sm:text-sm text-[#D4D4D8] max-w-md mx-auto mb-6">
            Explore our curated collections or chat with our styling concierge right away.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#B99A5B] text-[#171717] hover:bg-white rounded-sm transition-colors"
            >
              Explore Collections
            </button>
            <a
              href={chatWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white border border-white/20 hover:border-[#25D366] hover:text-[#25D366] rounded-sm transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
