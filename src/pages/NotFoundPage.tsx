import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';

interface NotFoundPageProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  return (
    <div className="bg-[#FAF9F6] min-h-[70vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md w-full bg-white border border-[#E9E6E0] p-10 rounded-sm shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#B99A5B]/40 flex items-center justify-center mx-auto mb-6 text-[#B99A5B]">
          <Compass className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
          Page Not Located
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171717] mb-3">
          404 — Out of Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#626262] leading-relaxed mb-8">
          The page or fashion piece you are looking for may have been archived, renamed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-sm transition-colors"
          >
            Explore Collections
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#171717] border border-[#E9E6E0] hover:border-[#B99A5B] rounded-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
