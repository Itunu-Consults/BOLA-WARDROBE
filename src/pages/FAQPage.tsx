import React, { useState } from 'react';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { createGeneralInquiryWhatsappUrl } from '../utils/whatsapp';

interface FAQPageProps {
  navigate: (path: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQPage: React.FC<FAQPageProps> = ({ navigate }) => {
  const { settings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FAQItem[] = [
    {
      category: 'Ordering & WhatsApp',
      question: 'Why does Bola Wardrobe take orders via WhatsApp rather than an automatic checkout?',
      answer: 'We believe fashion is best served with personal care. Through WhatsApp, we confirm your exact measurements, check physical studio inventory, share live videos of fabric prints or handbag details, and ensure you get the exact fit you desire before any money changes hands.',
    },
    {
      category: 'Ordering & WhatsApp',
      question: 'Why are prices not displayed on the public website?',
      answer: 'Our collections include limited artisanal runs, hand-dyed Adire textiles, and imported leather pieces that may have customized options or seasonal batches. We provide exact, transparent quotes and payment details directly when you select your desired variant on WhatsApp.',
    },
    {
      category: 'Ordering & WhatsApp',
      question: 'How do I complete payment for my order?',
      answer: 'Once our team confirms your item is available and you are happy with the size and color, we will provide our verified official business bank account details. After transfer, simply send us your payment receipt in the WhatsApp chat, and your order will be booked for immediate dispatch.',
    },
    {
      category: 'Sizing & Products',
      question: 'How do I know what size to order for ready-to-wear pieces?',
      answer: 'Our pieces follow standard UK sizing (UK 8 to UK 18). Each product details page lists available sizes. If you are unsure between two sizes or have specific bust, waist, or hip measurements, our stylist will guide you on WhatsApp.',
    },
    {
      category: 'Sizing & Products',
      question: 'Are your handbag materials durable?',
      answer: 'Yes. Our satchels, bucket bags, and clutches are crafted from premium croc-embossed vegan leather, high-density woven canvas, and sturdy metal alloy hardware with reinforced stitching and protective metal base studs.',
    },
    {
      category: 'Delivery & Shipping',
      question: 'How long does delivery take?',
      answer: 'Orders within Lagos typically arrive within 24–48 hours after payment confirmation. Deliveries to other Nigerian states (Abuja, Port Harcourt, Ibadan, etc.) usually take 2–4 business days via verified courier services. Express same-day dispatch can also be arranged upon request.',
    },
    {
      category: 'Delivery & Shipping',
      question: 'Can I track my delivery?',
      answer: 'Yes. As soon as your package is dispatched, your tracking reference and dispatch rider details will be shared directly in your WhatsApp conversation.',
    },
    {
      category: 'Returns & Exchanges',
      question: 'What is your exchange and return policy?',
      answer: 'Because we confirm measurements and item photos prior to payment, sizing mismatches are rare. However, if an item arrives with any defect or if you need to exchange for a different size of an unworn item with tags intact, notify us within 48 hours of delivery.',
    },
    {
      category: 'Consultations',
      question: 'Is the styling consultation really free?',
      answer: 'Yes! Our digital styling consultations are complimentary. Whether you need ideas for a wedding guest look or styling advice for an Adire coordinate set, our stylist will share moodboards and recommendations with you on WhatsApp.',
    },
  ];

  const categories = ['All', 'Ordering & WhatsApp', 'Sizing & Products', 'Delivery & Shipping', 'Returns & Exchanges', 'Consultations'];

  const filteredFaqs = faqs.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const directWhatsappUrl = createGeneralInquiryWhatsappUrl(
    settings.whatsappNumber,
    'FAQ Question',
    'Hello Bola Wardrobe, I have a question that is not covered in your FAQ.'
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
            Help &amp; Questions
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#171717] tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#626262] leading-relaxed">
            Everything you need to know about our shopping process, WhatsApp consultations, sizing guidance, and delivery commitments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xs transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'bg-white text-[#626262] border border-[#E9E6E0] hover:text-[#171717]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 mb-16">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E9E6E0] rounded-sm overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-semibold text-[#171717]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#B99A5B] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#626262] leading-relaxed border-t border-[#E9E6E0]/60">
                    <p>{faq.answer}</p>
                    <span className="inline-block text-[11px] uppercase tracking-wider text-[#B99A5B] font-semibold mt-3">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="p-8 bg-white border border-[#E9E6E0] rounded-sm text-center shadow-2xs">
          <HelpCircle className="w-8 h-8 text-[#B99A5B] mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-semibold text-[#171717] mb-2">
            Still Have a Question?
          </h3>
          <p className="text-xs sm:text-sm text-[#626262] max-w-md mx-auto mb-6">
            Our friendly customer care team is available to chat with you directly on WhatsApp.
          </p>
          <a
            href={directWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#20b858] transition-colors rounded-sm shadow-2xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask Us on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
