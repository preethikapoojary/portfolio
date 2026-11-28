'use client';
import { useState } from 'react';
import { FiFileText, FiFolder, FiTrash2, FiUpload } from 'react-icons/fi';
import axiosClient from '@/lib/adminApi/axiosClient';
import AssetPickerModal from './AssetPickerModal';

/**
 * PDF uploader with /public/assets picker, manual path/URL input, Clear,
 * and direct upload to POST /admin/upload/document.
 */
export default function PdfUploader({ value, onChange, folder = 'portfolio/documents' }) {
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const res = await axiosClient.post('/admin/upload/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.data);
    } catch {
      setError('Upload failed — make sure the file is a PDF under 10MB.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const currentUrl = value?.url || '';

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#DCD9D1] bg-[#E9E5DC]/30 text-[#85806D]">
          <FiFileText size={16} />
        </div>

        <input
          type="text"
          className="input min-w-[160px] flex-1"
          placeholder="/assets/...pdf or https://..."
          value={currentUrl}
          onChange={(e) => {
            const url = e.target.value;
            onChange(url ? { url, publicId: null, alt: value?.alt || '' } : null);
          }}
        />

        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-xs"
          >
            View
          </a>
        )}

        {currentUrl && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <FiTrash2 size={13} /> Clear
          </button>
        )}

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="btn-secondary inline-flex items-center gap-1.5 text-xs"
        >
          <FiFolder size={13} /> Assets
        </button>
      </div>

      <label className="btn-secondary inline-flex w-fit cursor-pointer items-center gap-1.5 text-xs">
        <FiUpload size={13} />
        {uploading ? 'Uploading…' : 'Upload PDF'}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <AssetPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        defaultCategory="documents"
        title="Select PDF from /public/assets"
        onSelect={(assetPath) =>
          onChange({ url: assetPath, publicId: null, alt: value?.alt || '' })
        }
      />
    </div>
  );
}
