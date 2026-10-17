import React from 'react';
import { useStore } from '../context/StoreContext';

interface LegalPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ navigate }) => {
  const { settings } = useStore();

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-[#E9E6E0] p-8 sm:p-12 rounded-sm shadow-2xs">
        <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
          Legal Disclosures
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171717] mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#71717A] mb-8">
          Last Updated: October 2026 · {settings.brandName || 'Bola Wardrobe'}
        </p>

        <div className="space-y-6 text-xs sm:text-sm text-[#626262] leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              1. Information We Collect
            </h2>
            <p>
              Bola Wardrobe collects only the necessary information required to facilitate personal styling consultations, respond to inquiries, and coordinate product orders. This may include:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your name and contact phone number / WhatsApp number.</li>
              <li>Your email address (if voluntarily provided for newsletter updates).</li>
              <li>Styling preferences, measurements, or event dates shared for consultations.</li>
              <li>Delivery address provided for physical courier dispatch.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              2. How We Use Your Information
            </h2>
            <p>
              Your personal information is used exclusively to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Communicate with you regarding item availability and orders via WhatsApp.</li>
              <li>Coordinate styling consultations and tailored outfit recommendations.</li>
              <li>Arrange courier dispatch and share package tracking updates.</li>
              <li>Send occasional collection updates if you have opted in.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              3. Payment Information
            </h2>
            <p>
              We do not collect, process, or store credit card details or CVVs on this website. All transactions are settled directly via verified business bank transfers coordinated through our official WhatsApp representative.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              4. Data Retention &amp; Security
            </h2>
            <p>
              We maintain administrative, technical, and physical safeguards to protect your personal details against unauthorized access, loss, or misuse. We never sell, rent, or trade your contact details with external third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              5. Contact Us Regarding Your Privacy
            </h2>
            <p>
              If you have any questions or wish to request the deletion of your consultation records, please contact us at{' '}
              <a href={`mailto:${settings.businessEmail}`} className="text-[#B99A5B] underline">
                {settings.businessEmail || 'ismailrofiatbolanle@gmail.com'}
              </a>{' '}
              or via WhatsApp.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<LegalPageProps> = ({ navigate }) => {
  const { settings } = useStore();

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-[#E9E6E0] p-8 sm:p-12 rounded-sm shadow-2xs">
        <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
          Terms &amp; Conditions
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171717] mb-6">
          Terms of Service
        </h1>
        <p className="text-xs text-[#71717A] mb-8">
          Last Updated: October 2026 · {settings.brandName || 'Bola Wardrobe'}
        </p>

        <div className="space-y-6 text-xs sm:text-sm text-[#626262] leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              1. Boutique Overview
            </h2>
            <p>
              Welcome to {settings.brandName || 'Bola Wardrobe'}. By browsing our website, requesting consultations, or placing order inquiries through our official WhatsApp system, you agree to these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              2. Catalog &amp; WhatsApp Handoff
            </h2>
            <p>
              The public catalogue provides photographic representations of our available pieces, variants, and categories. Clicking “Order on WhatsApp” generates an inquiry message. An order is only formally confirmed after our team verifies physical stock, clarifies delivery timelines, and confirms payment.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              3. Pricing &amp; Quotations
            </h2>
            <p>
              In accordance with our bespoke shopping model, prices are communicated directly via WhatsApp based on chosen garment sizes, textile variations, and current stock batches. All quotes provided by our official business representative are valid for 48 hours unless otherwise stated.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              4. Deliveries &amp; Inspections
            </h2>
            <p>
              All items undergo a quality check prior to dispatch. Customers are advised to examine their package upon delivery. In the event of a discrepancy or defect, notify us within 48 hours with photographic evidence for prompt resolution.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#171717] mb-2">
              5. Intellectual Property
            </h2>
            <p>
              All trademarks, product photography, editorial styling text, and brand assets associated with Bola Wardrobe belong solely to the boutique and may not be reproduced without written consent.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
