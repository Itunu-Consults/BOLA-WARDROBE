import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Clock, MessageCircle, Send, CheckCircle2, MapPin, Instagram, Facebook } from 'lucide-react';
import { createGeneralInquiryWhatsappUrl } from '../utils/whatsapp';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { settings, submitContactMessage } = useStore();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const directWhatsappUrl = createGeneralInquiryWhatsappUrl(
    settings.whatsappNumber,
    subject || 'Direct Customer Inquiry',
    message || 'Hello Bola Wardrobe, I would like to get in touch with you.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !contact.trim() || !message.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const emailRecipient = 'ismailrofiatbolanle@gmail.com';
      const emailSubject = `[Bola Wardrobe Inquiry] ${subject.trim() || 'New Customer Message'} - ${name.trim()}`;
      const emailBody = `Hello Bola Wardrobe,\n\nYou have received a new customer inquiry:\n\nClient Name: ${name.trim()}\nContact Phone / Email: ${contact.trim()}\nSubject: ${subject.trim() || 'General Inquiry'}\n\nMessage Details:\n${message.trim()}\n\n---\nSent from Bola Wardrobe Online Boutique Website`;
      const mailtoLink = `mailto:${emailRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      const res = await submitContactMessage({
        name: name.trim(),
        contact: contact.trim(),
        subject: subject.trim() || 'General Inquiry',
        message: message.trim(),
      });

      if (res.success) {
        setSubmitted(true);
        // Automatically open the mail client with prefilled details directed to ismailrofiatbolanle@gmail.com
        setTimeout(() => {
          try {
            window.location.href = mailtoLink;
          } catch {
            // fallback if blocked
          }
        }, 400);
      } else {
        setErrorMessage(res.error || 'Failed to submit message.');
      }
    } catch {
      setErrorMessage('Error connecting to contact service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#171717] tracking-tight mb-4">
            We Are Here to Assist You
          </h1>
          <p className="text-sm sm:text-base text-[#626262] leading-relaxed">
            Have questions about an Adire pattern, sizing measurements, handbag colors, or custom order requests? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Contact Details Column (Left, Spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Direct WhatsApp Callout Card */}
            <div className="p-6 bg-white border border-[#E9E6E0] rounded-sm shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-emerald-50 text-[#25D366] rounded-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#171717]">
                    Fastest Response: WhatsApp
                  </h3>
                  <p className="text-xs text-[#71717A]">Direct concierge chat</p>
                </div>
              </div>
              <p className="text-xs text-[#626262] leading-relaxed mb-4">
                For prompt replies on availability, video previews of fabrics, and instant ordering guidance, message our WhatsApp line directly.
              </p>
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#20b858] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>

            {/* Email & Schedule Card */}
            <div className="p-6 bg-white border border-[#E9E6E0] rounded-sm shadow-2xs space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#B99A5B] mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1">
                    Operating Hours
                  </h4>
                  <p className="text-xs text-[#626262]">
                    {settings.businessHours || 'Monday – Saturday: 9:00 AM – 7:00 PM (WAT)'}
                  </p>
                </div>
              </div>

              {settings.businessEmail && (
                <div className="flex items-start gap-3 pt-3 border-t border-[#E9E6E0]">
                  <Mail className="w-4 h-4 text-[#B99A5B] mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1">
                      Email Inquiries
                    </h4>
                    <a
                      href={`mailto:${settings.businessEmail}`}
                      className="text-xs text-[#626262] hover:text-[#B99A5B] transition-colors"
                    >
                      {settings.businessEmail}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 pt-3 border-t border-[#E9E6E0]">
                <MapPin className="w-4 h-4 text-[#B99A5B] mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1">
                    Order Delivery Coverage
                  </h4>
                  <p className="text-xs text-[#626262]">
                    Nationwide delivery across Nigeria and regional shipping upon request.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Link Box */}
            <div className="p-6 bg-white border border-[#E9E6E0] rounded-sm shadow-2xs">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-3">
                Follow Bola Wardrobe
              </h4>
              <div className="flex items-center gap-3">
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-[#E9E6E0] rounded-xs text-[#171717] hover:text-[#B99A5B] hover:border-[#B99A5B] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-[#E9E6E0] rounded-xs text-[#171717] hover:text-[#B99A5B] hover:border-[#B99A5B] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Contact Message Form (Right, Spans 7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E9E6E0] p-8 sm:p-10 rounded-sm shadow-2xs">
            <h2 className="font-serif text-2xl font-semibold text-[#171717] mb-2">
              Send a Message
            </h2>
            <p className="text-xs text-[#626262] mb-6">
              Fill out the form below and our team will receive your inquiry directly in our administration portal.
            </p>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#171717] mb-2">
                  Message Dispatched to Email
                </h3>
                <p className="text-xs text-[#626262] leading-relaxed mb-4 max-w-md mx-auto">
                  Your inquiry details have been forwarded directly to <strong>ismailrofiatbolanle@gmail.com</strong> and saved to our database.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                  <a
                    href={`mailto:ismailrofiatbolanle@gmail.com?subject=${encodeURIComponent(`[Bola Wardrobe Inquiry] ${subject || 'New Message'} - ${name}`)}&body=${encodeURIComponent(`Client Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}`)}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-sm transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open in Email App</span>
                  </a>
                  <a
                    href="https://wa.link/ghucjd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#20b858] rounded-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="text-xs font-semibold uppercase tracking-wider text-[#71717A] hover:text-[#171717] underline transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Omowunmi Davies"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                    Contact Phone or Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. 0801 234 5678 or email@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Sizing Inquiry / Bulk Purchase / Delivery Timeline"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you today?"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] disabled:opacity-50 transition-colors rounded-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
