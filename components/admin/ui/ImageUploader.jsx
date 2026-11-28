'use client';
import { useState } from 'react';
import { FiFolder, FiTrash2, FiUpload } from 'react-icons/fi';
import axiosClient from '@/lib/adminApi/axiosClient';
import AssetPickerModal from './AssetPickerModal';
import ImageCropModal from '@/components/common/ImageCropModal';

/**
 * Image field with live preview, manual path/URL input, Clear, /public/assets
 * picker modal, interactive crop & preview, and direct upload to POST /admin/upload/image.
 */
export default function ImageUploader({ value, onChange, folder = 'portfolio/images', isAvatar = false }) {
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [error, setError] = useState('');

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const res = await axiosClient.post('/admin/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange({ ...res.data.data, alt: value?.alt || '' });
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPendingFile(file);
  };

  const currentUrl = value?.url || '';
  const isCertificateFolder = /certificate/i.test(folder);
  const useCirclePreview = isAvatar || /profile|avatar/i.test(folder);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        {currentUrl ? (
          <img
            src={currentUrl}
            alt={value?.alt || ''}
            className={`h-11 w-11 shrink-0 border border-[#DCD9D1] object-cover ${
              useCirclePreview ? 'rounded-full' : 'rounded'
            }`}
          />
        ) : (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center border border-dashed border-[#DCD9D1] bg-[#E9E5DC]/30 text-[10px] text-[#89877F] ${
              useCirclePreview ? 'rounded-full' : 'rounded'
            }`}
          >
            No img
          </div>
        )}

        <input
          type="text"
          className="input min-w-[160px] flex-1"
          placeholder="/assets/... or https://..."
          value={currentUrl}
          onChange={(e) => {
            const url = e.target.value;
            onChange(url ? { url, publicId: null, alt: value?.alt || '' } : null);
          }}
        />

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

      <div className="flex flex-wrap items-center gap-3">
        <label className="btn-secondary inline-flex cursor-pointer items-center gap-1.5 text-xs">
          <FiUpload size={13} />
          {uploading ? 'Uploading…' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
        <span className="text-[11px] text-[#89877F]">
          {isCertificateFolder
            ? 'Auto-converts to PNG · or pick from /public/assets.'
            : 'Auto-converts to WebP · or pick from /public/assets.'}
        </span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <AssetPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        defaultCategory={isCertificateFolder ? 'documents' : 'images'}
        title={isCertificateFolder ? 'Select Certificate Image' : 'Select Image from /public/assets'}
        onSelect={(assetPath) =>
          onChange({ url: assetPath, publicId: null, alt: value?.alt || '' })
        }
      />

      <ImageCropModal
        file={pendingFile}
        defaultAspect={useCirclePreview ? 'circle' : isCertificateFolder ? 'original' : '16:10'}
        onCancel={() => setPendingFile(null)}
        onConfirm={(croppedFile) => {
          setPendingFile(null);
          uploadFile(croppedFile);
        }}
      />
    </div>
  );
}
