import React from 'react';
import { useStore } from '../context/StoreContext';

interface AnnouncementBarProps {
  navigate?: (to: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = () => {
  const { settings } = useStore();

  if (!settings.announcementText) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="bg-[#171717] text-[#FAF8F5] text-xs font-medium py-2 px-4 tracking-wide border-b border-black/10 select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
        <span className="text-[#B99A5B] text-xs tracking-wider uppercase font-semibold">
          Bola Wardrobe
        </span>
        <span className="text-white/40" aria-hidden="true">·</span>
        <span>{settings.announcementText}</span>
      </div>
    </div>
  );
};
