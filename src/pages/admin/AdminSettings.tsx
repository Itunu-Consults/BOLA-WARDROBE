import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save, Check, AlertCircle, Database, CheckCircle2, ExternalLink } from 'lucide-react';
import { sanitizeWhatsappNumber } from '../../utils/whatsapp';

export const AdminSettings: React.FC = () => {
  const { settings, adminToken, refreshSettings } = useStore();

  const [brandName, setBrandName] = useState(settings.brandName || 'Bola Wardrobe');
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [supportingStatement, setSupportingStatement] = useState(settings.supportingStatement || '');
  const [announcementText, setAnnouncementText] = useState(settings.announcementText || '');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '');
  const [businessEmail, setBusinessEmail] = useState(settings.businessEmail || '');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [tiktokUrl, setTiktokUrl] = useState(settings.tiktokUrl || '');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || '');
  const [metaTitle, setMetaTitle] = useState(settings.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    url?: string;
    dataApi?: string;
    tables?: string[];
  }>({ configured: false, connected: false });

  useEffect(() => {
    fetch('/api/supabase/status')
      .then(res => res.json())
      .then(data => setSupabaseStatus(data))
      .catch(() => setSupabaseStatus({ configured: false, connected: false }));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaveSuccess(false);

    const cleanWhatsapp = sanitizeWhatsappNumber(whatsappNumber);
    if (!cleanWhatsapp) {
      setErrorMsg('Please enter a valid WhatsApp link (e.g. https://wa.link/ghucjd) or phone number.');
      return;
    }

    setIsSaving(true);

    const payload = {
      brandName: brandName.trim(),
      tagline: tagline.trim(),
      supportingStatement: supportingStatement.trim(),
      announcementText: announcementText.trim(),
      whatsappNumber: cleanWhatsapp,
      businessEmail: businessEmail.trim(),
      instagramUrl: instagramUrl.trim(),
      facebookUrl: facebookUrl.trim(),
      tiktokUrl: tiktokUrl.trim(),
      businessHours: businessHours.trim(),
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await refreshSettings();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to update settings.');
      }
    } catch {
      setErrorMsg('Network error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Title */}
      <div>
        <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
          Store Configuration
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#171717]">
          Boutique Settings
        </h1>
        <p className="text-xs text-[#626262] mt-1">
          Update your store identity, WhatsApp ordering phone number, announcement banner, and social links.
        </p>
      </div>

      {/* Supabase Cloud Database Status Card */}
      <div className="bg-[#FAF8F5] border border-[#E9E6E0] p-4 sm:p-5 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-[#E9E6E0] flex items-center justify-center text-[#B99A5B] shrink-0 mt-0.5">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#171717]">Supabase Cloud Database</h2>
              {supabaseStatus.connected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Live Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded-full">
                  Connecting...
                </span>
              )}
            </div>
            <p className="text-xs text-[#626262] mt-0.5">
              Data API: <code className="bg-white px-1.5 py-0.5 rounded-xs border border-[#E9E6E0] text-[11px] font-mono text-[#171717]">https://habpuiqysybzozajamtr.supabase.co/rest/v1/</code>
            </p>
            <p className="text-[11px] text-[#888] mt-1">
              Synchronized tables: <span className="text-[#171717] font-medium">site_settings, categories, products, bookings, orders, messages</span>
            </p>
          </div>
        </div>
        <a
          href="https://supabase.com/dashboard/project/habpuiqysybzozajamtr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#171717] bg-white border border-[#E9E6E0] hover:border-[#B99A5B] rounded-xs transition-colors shrink-0"
        >
          <span>Supabase Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#626262]" />
        </a>
      </div>

      <div className="bg-white border border-[#E9E6E0] p-6 sm:p-8 rounded-sm shadow-2xs">
        
        {saveSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xs mb-6 flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Store settings saved successfully and updated live across the website!</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs rounded-xs mb-6 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          {/* Brand Identity Section */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#171717] mb-3 pb-2 border-b border-[#E9E6E0]">
              Brand Identity &amp; Tagline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-[#171717] mb-1">
                Supporting Brand Statement
              </label>
              <textarea
                rows={2}
                value={supportingStatement}
                onChange={(e) => setSupportingStatement(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
              />
            </div>
          </div>

          {/* Announcement Bar */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#171717] mb-3 pb-2 border-b border-[#E9E6E0]">
              Top Announcement Bar
            </h3>
            <div>
              <label className="block font-semibold text-[#171717] mb-1">
                Announcement Message (Leave empty to hide)
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Everyday elegance, thoughtfully curated."
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
              />
            </div>
          </div>

          {/* WhatsApp & Contact Details */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#171717] mb-3 pb-2 border-b border-[#E9E6E0]">
              WhatsApp Ordering &amp; Contact Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Central WhatsApp Business Number *
                </label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. 2348012345678"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
                <span className="text-[11px] text-[#71717A] mt-1 block">
                  International format with country code (e.g. 23480...). Used for all order buttons.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="ismailrofiatbolanle@gmail.com"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-[#171717] mb-1">
                Operating / Business Hours
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Monday – Saturday: 9:00 AM – 7:00 PM (WAT)"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
              />
            </div>
          </div>

          {/* Social Profiles */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#171717] mb-3 pb-2 border-b border-[#E9E6E0]">
              Social Media Discovery URLs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/bolawardrobe"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Facebook Profile URL
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/bolawardrobe"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  TikTok Profile URL
                </label>
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@bolawardrobe"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEO Metadata */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#171717] mb-3 pb-2 border-b border-[#E9E6E0]">
              SEO &amp; OpenGraph Meta Tags
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Global Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Global Meta Description
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-[#E9E6E0] flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] disabled:opacity-50 transition-colors rounded-xs shadow-2xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
