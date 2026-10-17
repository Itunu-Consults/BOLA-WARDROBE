import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Upload, Copy, Check, Image as ImageIcon } from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { adminToken } = useStore();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Maximum file size is 8MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ dataUrl, filename: file.name }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setUploadedFiles((prev) => [data.url, ...prev]);
        } else {
          setUploadedFiles((prev) => [dataUrl, ...prev]);
        }
      } catch {
        setUploadedFiles((prev) => [dataUrl, ...prev]);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
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
            Visual Assets
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#171717]">
            Media Library
          </h1>
          <p className="text-xs text-[#626262] mt-1">
            Upload new photography assets for your products, categories, and banners.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] transition-colors rounded-xs shadow-2xs cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Gallery */}
      <div className="bg-white border border-[#E9E6E0] p-6 rounded-sm shadow-2xs">
        <h3 className="font-serif text-lg font-semibold text-[#171717] mb-4">
          Session Uploads
        </h3>

        {uploadedFiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedFiles.map((url, idx) => (
              <div
                key={idx}
                className="group relative bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs overflow-hidden aspect-square flex flex-col items-center justify-center"
              >
                <img
                  src={url}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => copyToClipboard(url)}
                  className="absolute bottom-2 right-2 p-1.5 bg-black/80 text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px]"
                  title="Copy image URL"
                >
                  {copiedUrl === url ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl === url ? 'Copied' : 'Copy URL'}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-[#E9E6E0] rounded-xs">
            <ImageIcon className="w-10 h-10 text-[#71717A] mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[#626262]">
              No custom files uploaded in this session yet. Click “Upload Image” to add new photos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
