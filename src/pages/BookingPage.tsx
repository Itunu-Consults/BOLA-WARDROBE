import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Calendar, Clock, Sparkles, MessageCircle, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { createConsultationWhatsappUrl } from '../utils/whatsapp';

interface BookingPageProps {
  navigate: (path: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ navigate }) => {
  const { settings, submitBooking } = useStore();

  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [consultationType, setConsultationType] = useState('Outfit recommendations');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [categoryInterest, setCategoryInterest] = useState('Wears & Ready-to-Wear');
  const [budgetRange, setBudgetRange] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');
  const [notes, setNotes] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!whatsapp.trim() || whatsapp.replace(/[^0-9]/g, '').length < 8) {
      setErrorMessage('Please enter a valid WhatsApp phone number.');
      return;
    }
    if (!preferredDate) {
      setErrorMessage('Please select a preferred date for your styling session.');
      return;
    }
    if (!privacyConsent) {
      setErrorMessage('Please accept the privacy consent to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save record to backend
      const result = await submitBooking({
        fullName: fullName.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || undefined,
        consultationType,
        preferredDate,
        preferredTime,
        categoryInterest,
        budgetRange: budgetRange.trim() || undefined,
        preferredStyle: preferredStyle.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      const emailRecipient = 'ismailrofiatbolanle@gmail.com';
      const emailSubject = `[Styling Consultation Request] ${fullName.trim()} - ${consultationType}`;
      const emailBody = `New Styling Consultation Request:\n\nClient Name: ${fullName.trim()}\nWhatsApp Number: ${whatsapp.trim()}\nEmail Address: ${email.trim() || 'Not provided'}\nConsultation Type: ${consultationType}\nPreferred Date: ${preferredDate}\nPreferred Time: ${preferredTime}\nCategory Focus: ${categoryInterest}\nStyle Preference: ${preferredStyle.trim() || 'Not specified'}\nBudget Range: ${budgetRange.trim() || 'Not specified'}\nNotes: ${notes.trim() || 'None'}\n\n---\nSent from Bola Wardrobe Consultation Booking Form`;
      const mailtoUrl = `mailto:${emailRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to submit booking. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);

      // Trigger email client dispatch to ismailrofiatbolanle@gmail.com
      setTimeout(() => {
        try {
          window.location.href = mailtoUrl;
        } catch {
          // fallback
        }
      }, 300);

      // Launch official WhatsApp link
      const whatsappUrl = 'https://wa.link/ghucjd';

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 900);
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
            Complimentary Concierge
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#171717] tracking-tight mb-4">
            Book a Styling Consultation
          </h1>
          <p className="text-sm sm:text-base text-[#626262] leading-relaxed">
            Need guidance choosing pieces for an upcoming event, styling an Adire set, or picking the ideal handbag? Share your preferences, and our stylist will curate options with you over WhatsApp.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#E9E6E0] p-8 sm:p-12 rounded-sm shadow-2xs">
          {submitted ? (
            <div className="text-center py-10 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-3xl font-semibold text-[#171717] mb-3">
                Booking Dispatched to Email & WhatsApp!
              </h2>
              <p className="text-sm text-[#626262] leading-relaxed mb-4">
                Thank you, <strong className="text-[#171717]">{fullName}</strong>. Your consultation details have been sent directly to <strong>ismailrofiatbolanle@gmail.com</strong> and pre-loaded for WhatsApp concierge.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                <a
                  href={`mailto:ismailrofiatbolanle@gmail.com?subject=${encodeURIComponent(`[Styling Consultation Request] ${fullName} - ${consultationType}`)}&body=${encodeURIComponent(`Client Name: ${fullName}\nWhatsApp: ${whatsapp}\nEmail: ${email || 'None'}\nService: ${consultationType}\nSlot: ${preferredDate} at ${preferredTime}\nFocus: ${categoryInterest}\nNotes: ${notes || 'None'}`)}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Email App</span>
                </a>
                <a
                  href="https://wa.link/ghucjd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#20b858] rounded-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp Concierge</span>
                </a>
              </div>
              <div className="p-4 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs text-xs text-[#626262] mb-8 text-left space-y-2">
                <p>• <strong>Service:</strong> {consultationType}</p>
                <p>• <strong>Requested Slot:</strong> {preferredDate} at {preferredTime}</p>
                <p>• <strong>Focus:</strong> {categoryInterest}</p>
                <p>• <strong>Sent To:</strong> ismailrofiatbolanle@gmail.com</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setWhatsapp('');
                  }}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#171717] border border-[#E9E6E0] hover:border-[#B99A5B] rounded-sm transition-colors"
                >
                  Book Another Session
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-sm transition-colors"
                >
                  Browse Collections
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Bukola Adebayo"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 0801 234 5678 or +234..."
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                  <span className="text-[11px] text-[#71717A] mt-1 block">
                    Our stylist communicates directly through WhatsApp.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. bukola@example.com"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                />
              </div>

              <div className="h-px bg-[#E9E6E0]" />

              {/* Service Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                    Consultation Type *
                  </label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs cursor-pointer"
                  >
                    <option value="Outfit recommendations">Outfit recommendations</option>
                    <option value="Event styling">Event styling (Wedding, Party, Gala)</option>
                    <option value="Accessories matching">Accessories & Handbag pairing</option>
                    <option value="Gift selection">Gift selection assistance</option>
                    <option value="General fashion assistance">General wardrobe refresh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                    Department of Interest *
                  </label>
                  <select
                    value={categoryInterest}
                    onChange={(e) => setCategoryInterest(e.target.value)}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs cursor-pointer"
                  >
                    <option value="Wears & Ready-to-Wear">Wears (Adire sets, skirts, dresses)</option>
                    <option value="Bags & Handbags">Bags (Satchels, bucket bags, clutches)</option>
                    <option value="Accessories & Jewelry">Accessories (Silver cuffs, scarves)</option>
                    <option value="Cosmetics & Skin Glow">Cosmetics & Beauty essentials</option>
                    <option value="Complete Head-to-Toe Styling">Complete Head-to-Toe Styling</option>
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                    Preferred Time *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs cursor-pointer"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Style notes & optional budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                    Occasion or Preferred Aesthetic
                  </label>
                  <input
                    type="text"
                    value={preferredStyle}
                    onChange={(e) => setPreferredStyle(e.target.value)}
                    placeholder="e.g. Church Thanksgiving, Traditional Wedding, Casual Chic"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                    Budget Preference (Optional)
                  </label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    placeholder="e.g. Everyday budget / Mid-range / Special splurge"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-2">
                  Additional Notes or Questions
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us any specific colors you love, sizes you usually wear, or pieces on our website you are eyeing..."
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                />
              </div>

              {/* Privacy Consent Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  required
                  className="mt-1 accent-[#B99A5B]"
                />
                <span className="text-xs text-[#626262]">
                  I agree that Bola Wardrobe may process my submitted contact details to coordinate my consultation appointment via WhatsApp in accordance with the{' '}
                  <a
                    href="/privacy-policy"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/privacy-policy');
                    }}
                    className="underline text-[#171717] hover:text-[#B99A5B]"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] disabled:opacity-50 transition-colors rounded-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>{isSubmitting ? 'Submitting Details...' : 'Submit & Connect on WhatsApp'}</span>
                </button>
                <p className="text-[11px] text-[#71717A] text-center mt-2.5">
                  Submitting will securely store your consultation slot and open WhatsApp with your prefilled appointment message.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
