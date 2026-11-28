'use client';

import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Lightbox({ image, title, subtitle, onClose }) {
  useEffect(() => {
    if (!image) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#22221F]/80 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden border border-[#DCD9D1] bg-[#F6F4EF] p-4 sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-[#DCD9D1] pb-3">
          <div>
            {title && (
              <h3 className="font-display text-xl font-medium text-[#22221F]">{title}</h3>
            )}
            {subtitle && <p className="text-xs text-[#89877F]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="p-1.5 text-[#89877F] transition-colors hover:text-[#22221F]"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex max-h-[72vh] items-center justify-center overflow-auto bg-[#E9E5DC]/40 p-2">
          <img
            src={image}
            alt={title || 'Preview'}
            className="max-h-[68vh] w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
