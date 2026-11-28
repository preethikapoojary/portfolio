'use client';

import { useEffect, useMemo, useState } from 'react';
import { FiFileText, FiFolder, FiSearch, FiX } from 'react-icons/fi';
import axiosClient from '@/lib/adminApi/axiosClient';

export default function AssetPickerModal({
  isOpen,
  onClose,
  onSelect,
  defaultCategory = 'all',
  title = 'Select Asset from /public/assets',
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(defaultCategory);

  useEffect(() => {
    setCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    if (!isOpen) return undefined;
    let active = true;
    setLoading(true);
    axiosClient
      .get('/admin/assets')
      .then((res) => {
        if (active) setAssets(res.data?.assets || []);
      })
      .catch(() => {
        if (active) setAssets([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  const counts = useMemo(
    () => ({
      all: assets.length,
      documents: assets.filter((a) => a.type === 'pdf' || a.isCertificate).length,
      images: assets.filter((a) => a.type === 'image').length,
    }),
    [assets]
  );

  const filtered = useMemo(() => {
    let list = assets;
    if (category === 'documents') {
      list = list.filter((a) => a.type === 'pdf' || a.isCertificate);
    } else if (category === 'images') {
      list = list.filter((a) => a.type === 'image');
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.path.toLowerCase().includes(q)
      );
    }
    return list;
  }, [assets, category, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col border border-[#DCD9D1] bg-[#F6F4EF] text-[#22221F] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#DCD9D1] bg-[#E9E5DC]/40 px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 font-display text-lg font-medium text-[#22221F] sm:text-xl">
              <FiFolder size={18} className="shrink-0 text-[#85806D]" />
              <span className="truncate">{title}</span>
            </h3>
            <p className="mt-0.5 text-xs text-[#89877F]">
              Click any file to select it. All files are hosted in /public/assets.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 text-[#89877F] transition-colors hover:bg-[#E9E5DC] hover:text-[#22221F]"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Search & Category Tabs */}
        <div className="space-y-3 border-b border-[#DCD9D1] px-4 py-3 sm:px-6">
          <div className="relative">
            <FiSearch
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#89877F]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets (e.g. nexathon, certificate, yojanasethu)..."
              className="input !pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: `All Assets (${counts.all})` },
              { key: 'documents', label: `PDFs & Certificates (${counts.documents})` },
              { key: 'images', label: `Images (${counts.images})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setCategory(tab.key)}
                className={`border px-3 py-1 text-xs font-medium transition-colors ${
                  category === tab.key
                    ? 'border-[#22221F] bg-[#22221F] text-[#F6F4EF]'
                    : 'border-[#DCD9D1] bg-[#F6F4EF] text-[#89877F] hover:border-[#22221F] hover:text-[#22221F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <p className="py-12 text-center text-sm text-[#89877F]">Loading assets…</p>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#89877F]">
              No matching assets found in /public/assets.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((asset) => (
                <button
                  key={asset.path}
                  type="button"
                  onClick={() => {
                    onSelect(asset.path);
                    onClose();
                  }}
                  className="group flex flex-col overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/25 text-left transition-colors hover:border-[#22221F] hover:bg-[#E9E5DC]/50"
                >
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#E9E5DC]/60">
                    {asset.type === 'image' ? (
                      <img
                        src={asset.path}
                        alt={asset.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-[#85806D]">
                        <FiFileText size={28} />
                        <span className="text-[10px] font-semibold uppercase">PDF DOC</span>
                      </div>
                    )}
                    <span className="absolute bottom-1.5 right-1.5 bg-[#22221F]/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#F6F4EF]">
                      {asset.ext}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-medium text-[#22221F]">{asset.name}</p>
                    <p className="truncate text-[10px] text-[#89877F]">{asset.path}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#DCD9D1] bg-[#E9E5DC]/30 px-4 py-3 text-xs text-[#89877F] sm:px-6">
          <span>
            Showing {filtered.length} of {assets.length} assets
          </span>
          <button type="button" onClick={onClose} className="btn-secondary text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
