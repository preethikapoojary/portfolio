'use client';

import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiCopy, FiDownload, FiMoreVertical, FiShare2 } from 'react-icons/fi';

export default function ShareMenu({ path = '', title = '', onDownload, downloadLabel = 'Download' }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const getUrl = () => {
    if (typeof window === 'undefined') return path;
    if (!path) return window.location.href;
    if (path.startsWith('http')) return path;
    return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const handleCopy = async () => {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } catch {
      setOpen(false);
    }
  };

  const handleDownload = async () => {
    if (!onDownload || downloading) return;
    setDownloading(true);
    try {
      await onDownload();
    } finally {
      setDownloading(false);
      setOpen(false);
    }
  };

  const handleShare = async () => {
    const url = getUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: title || document.title, url });
        setOpen(false);
        return;
      } catch {
        // User cancelled or share failed; fall back to copy if not AbortError
      }
    }
    await handleCopy();
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="More options"
        aria-expanded={open}
        className="inline-flex h-8 w-8 items-center justify-center border border-transparent text-[#89877F] transition-colors hover:border-[#DCD9D1] hover:text-[#22221F]"
      >
        <FiMoreVertical size={15} />
      </button>

      {open && (
        <div
          className="absolute right-0 z-30 mt-1.5 w-36 border border-[#DCD9D1] bg-[#F6F4EF] py-1 shadow-[0_8px_24px_rgba(34,34,31,0.1)]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium text-[#22221F] transition-colors hover:bg-[#E9E5DC]/60"
          >
            {copied ? <FiCheck size={13} className="text-[#85806D]" /> : <FiCopy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy link'}</span>
          </button>
          {onDownload && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium text-[#22221F] transition-colors hover:bg-[#E9E5DC]/60 disabled:opacity-60"
            >
              <FiDownload size={13} />
              <span>{downloading ? 'Saving…' : downloadLabel}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium text-[#22221F] transition-colors hover:bg-[#E9E5DC]/60"
          >
            <FiShare2 size={13} />
            <span>Share</span>
          </button>
        </div>
      )}
    </div>
  );
}
