import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Save,
  Check,
  AlertCircle,
  Database,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  RefreshCw,
  Copy,
  ShieldAlert,
  Key,
  Cloud,
  CheckCheck
} from 'lucide-react';
import { sanitizeWhatsappNumber } from '../../utils/whatsapp';

export const AdminSettings: React.FC = () => {
  const { settings, saveSettings, syncAllToCloud, saveSupabaseServiceRoleKey } = useStore();

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

  // Supabase cloud diagnostics state
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    canWrite?: boolean;
    rlsBlocked?: boolean;
    writeError?: string | null;
    hasServiceRole?: boolean;
    url?: string;
    dataApi?: string;
    tables?: string[];
  }>({ configured: false, connected: false });

  const [serviceRoleKey, setServiceRoleKey] = useState(() => {
    return typeof window !== 'undefined' ? (localStorage.getItem('bola_supabase_service_role_key') || '') : '';
  });
  const [isTestingSync, setIsTestingSync] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const fetchCloudStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
      }
    } catch {
      setSupabaseStatus({ configured: false, connected: false });
    }
  };

  useEffect(() => {
    fetchCloudStatus();
  }, []);

  const handleTestCloudWrite = async () => {
    setIsTestingSync(true);
    setSyncStatusMsg(null);
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setSupabaseStatus(data);
      if (data.canWrite) {
        setSyncStatusMsg({
          type: 'success',
          text: 'Cloud database write permissions verified! Any changes saved will instantly reflect on your phone and all devices.',
        });
      } else if (data.rlsBlocked) {
        setSyncStatusMsg({
          type: 'warning',
          text: 'Row-Level Security (RLS) is currently preventing writes. Run the SQL script below in your Supabase dashboard or paste your Service Role Key.',
        });
      } else {
        setSyncStatusMsg({
          type: 'error',
          text: data.writeError || 'Unable to write to Supabase.',
        });
      }
    } catch (err: any) {
      setSyncStatusMsg({ type: 'error', text: err?.message || 'Connection test failed.' });
    } finally {
      setIsTestingSync(false);
    }
  };

  const handleSyncAllToCloud = async () => {
    setIsSyncingAll(true);
    setSyncStatusMsg(null);
    try {
      const res = await syncAllToCloud();
      if (res.success) {
        setSyncStatusMsg({
          type: 'success',
          text: res.message,
        });
        fetchCloudStatus();
      } else {
        setSyncStatusMsg({
          type: res.rlsBlocked ? 'warning' : 'error',
          text: res.message,
        });
      }
    } catch (err: any) {
      setSyncStatusMsg({ type: 'error', text: err?.message || 'Sync failed.' });
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleSaveServiceRoleKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseServiceRoleKey(serviceRoleKey);
    setSyncStatusMsg({
      type: 'success',
      text: 'Supabase Service Key saved locally! Testing cloud sync now...',
    });
    handleTestCloudWrite();
  };

  const sqlCommand = `-- Run this in Supabase SQL Editor to allow writes from any device:
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCommand);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

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
      await saveSettings(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setErrorMsg('Error saving settings.');
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
          Update your store identity, WhatsApp ordering phone number, announcement banner, and cloud sync across all mobile and desktop devices.
        </p>
      </div>

      {/* MULTI-DEVICE CLOUD SYNCHRONIZATION DIAGNOSTICS CARD */}
      <div className="bg-white border-2 border-[#E9E6E0] rounded-sm p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E9E6E0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-[#171717] text-[#B99A5B] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#171717]">
                  Multi-Device Cloud Synchronization (Phone &amp; Laptop)
                </h2>
                {supabaseStatus.canWrite ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Live Cloud Sync Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-semibold rounded-full">
                    <ShieldAlert className="w-3 h-3 text-amber-600" />
                    Cloud Write Action Required
                  </span>
                )}
              </div>
              <p className="text-xs text-[#626262] mt-0.5">
                Ensures changes made from your laptop (category photos, products, settings) immediately show on your phone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestCloudWrite}
              disabled={isTestingSync}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#FAF8F5] border border-[#E9E6E0] hover:border-[#B99A5B] rounded-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSync ? 'animate-spin' : ''}`} />
              <span>Test Cloud Write</span>
            </button>
            <a
              href="https://supabase.com/dashboard/project/habpuiqysybzozajamtr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#171717] text-white hover:bg-[#B99A5B] rounded-xs transition-colors"
            >
              <span>Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatusMsg && (
          <div
            className={`p-3.5 rounded-xs text-xs font-medium flex items-start gap-2.5 ${
              syncStatusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : syncStatusMsg.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border border-amber-300'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            {syncStatusMsg.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : syncStatusMsg.type === 'warning' ? (
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{syncStatusMsg.text}</div>
          </div>
        )}

        {/* Why changes didn't show on phone explanation */}
        {!supabaseStatus.canWrite && (
          <div className="bg-[#FAF8F5] border border-amber-200 p-4 rounded-xs text-xs space-y-3">
            <div className="font-semibold text-amber-950 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Why your edits appeared on laptop but not on your phone:</span>
            </div>
            <p className="text-[#626262] leading-relaxed">
              When you made changes on your laptop, they were safely stored in your laptop’s local browser memory.
              However, your Supabase cloud database currently has <strong>Row-Level Security (RLS)</strong> enabled, which is rejecting cloud writes.
              Because the cloud database was not updated, opening the site on your phone still shows the original default data.
            </p>

            <div className="pt-2 border-t border-amber-200/80">
              <span className="font-semibold text-[#171717] block mb-1.5">
                Quick 10-Second Fix (Run in Supabase SQL Editor):
              </span>
              <p className="text-[11px] text-[#71717A] mb-2">
                Click "Copy SQL", then click "Open SQL Editor" in Supabase, paste, and click <strong>RUN</strong>:
              </p>

              <div className="relative bg-[#171717] text-zinc-100 p-3 rounded-xs font-mono text-[11px] overflow-x-auto">
                <pre>{sqlCommand}</pre>
                <button
                  type="button"
                  onClick={copySql}
                  className="absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs text-[11px] font-sans font-semibold transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <a
                  href="https://supabase.com/dashboard/project/habpuiqysybzozajamtr/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#B99A5B] text-white hover:bg-[#171717] rounded-xs transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Supabase SQL Editor (Paste &amp; Run)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Action: Push All Laptop Customizations to Cloud */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5] p-3.5 border border-[#E9E6E0] rounded-xs">
          <div>
            <h4 className="font-semibold text-xs text-[#171717] flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-[#B99A5B]" />
              <span>Sync All Laptop Customizations to Cloud</span>
            </h4>
            <p className="text-[11px] text-[#71717A] mt-0.5">
              Uploads all your custom category photos, products, and store settings from this laptop directly to the cloud database so your phone loads them.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSyncAllToCloud}
            disabled={isSyncingAll}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#171717] text-white hover:bg-[#B99A5B] disabled:opacity-50 rounded-xs transition-colors shrink-0 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Syncing to Cloud...' : 'Push Laptop Data to Cloud'}</span>
          </button>
        </div>

        {/* Alternative: Enter Service Role Key */}
        <div className="pt-2 border-t border-[#E9E6E0]">
          <details className="text-xs text-[#71717A] group">
            <summary className="cursor-pointer font-medium text-[#171717] hover:text-[#B99A5B] transition-colors flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-[#B99A5B]" />
              <span>Alternative Option: Enter Supabase Service Role Key</span>
            </summary>
            <div className="mt-3 p-3 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs space-y-2">
              <p className="text-[11px] text-[#626262]">
                If you prefer not to change SQL permissions, paste your <code>service_role secret</code> key from Supabase Dashboard &gt; Project Settings &gt; API. This bypasses RLS directly.
              </p>
              <form onSubmit={handleSaveServiceRoleKey} className="flex gap-2">
                <input
                  type="password"
                  value={serviceRoleKey}
                  onChange={(e) => setServiceRoleKey(e.target.value)}
                  placeholder="Paste service_role key (eyJh...)"
                  className="flex-1 px-3 py-1.5 bg-white border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#171717] hover:bg-[#B99A5B] text-white rounded-xs font-semibold text-xs transition-colors shrink-0"
                >
                  Save Key
                </button>
              </form>
            </div>
          </details>
        </div>
      </div>

      {/* Main Settings Form */}
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
