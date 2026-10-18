import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Upload, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

export const AdminMedia: React.FC = () => {
  const { adminToken } = useStore();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const optimizedDataUrl = await compressImage(file, 1200, 1200, 0.82);
      setUploadedFiles((prev) => [optimizedDataUrl, ...prev]);

      try {
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ dataUrl: optimizedDataUrl, filename: file.name }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.url) {
            setUploadedFiles((prev) => [data.url, ...prev.filter((u) => u !== optimizedDataUrl)]);
          }
        }
      } catch {}
    } catch (err: any) {
      alert('Unable to process photo: ' + (err?.message || 'Please choose a valid image file.'));
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
            Asset Repository
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#171717]">
            Media Library
          </h1>
        </div>

        <label className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] transition-colors rounded-xs shadow-2xs cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Compressing & Uploading...' : 'Upload Media Asset'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {uploadedFiles.length === 0 ? (
        <div className="bg-white border border-[#E9E6E0] rounded-sm p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E9E6E0] flex items-center justify-center mx-auto mb-3 text-[#71717A]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#171717] mb-1">
            No Uploaded Media In Current Session
          </h3>
          <p className="text-xs text-[#71717A] max-w-sm mx-auto mb-4">
            Upload images here to copy their URLs directly or upload them inside the product editor to automatically attach them to your catalog.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] hover:bg-[#E9E6E0] text-xs font-semibold text-[#171717] rounded-xs border border-[#E9E6E0] cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Select Image File</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadedFiles.map((url, i) => (
            <div
              key={i}
              className="bg-white border border-[#E9E6E0] rounded-sm overflow-hidden shadow-2xs group flex flex-col justify-between"
            >
              <div className="aspect-square bg-[#FAF8F5] overflow-hidden">
                <img
                  src={url}
                  alt={`Asset ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 border-t border-[#E9E6E0] flex items-center justify-between bg-white">
                <span className="text-[10px] text-[#71717A] font-mono truncate max-w-[120px]">
                  {url.startsWith('data:') ? 'Inline Web Asset' : url}
                </span>
                <button
                  onClick={() => copyToClipboard(url)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B99A5B] hover:text-[#171717] transition-colors"
                >
                  {copiedUrl === url ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
