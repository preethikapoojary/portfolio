'use client';
import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function AdminDrawer({
  isOpen = true,
  onClose,
  title,
  children,
  maxWidth = '560px',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <aside
        style={{ maxWidth }}
        className="fixed inset-y-0 right-0 z-[51] flex w-full flex-col border-l border-[#DCD9D1] bg-[#F6F4EF] text-[#22221F] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#DCD9D1] px-6 py-4">
          <h2 className="font-display text-xl font-medium text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted transition-colors hover:bg-[#E9E5DC]/50 hover:text-ink"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </aside>
    </>
  );
}
