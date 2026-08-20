import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient';

/**
 * Uploads a single file to POST /admin/upload/image and returns a
 * mediaSchema-shaped object ({ url, publicId, alt }) via onChange. Reused
 * anywhere a module stores an image (Certificate.image, GalleryImage.image,
 * Project.screenshots[n], SiteSettings.logo/favicon).
 */
export default function ImageUploader({ value, onChange, folder = 'portfolio/images' }) {
  const [uploading, setUploading] = useState(false);
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

  return (
    <div>
      {value?.url ? (
        <div className="relative inline-block">
          <img src={value.url} alt={value.alt || ''} className="h-28 w-28 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-red-500 shadow"
            aria-label="Remove image"
          >
            <FiX size={14} />
          </button>
        </div>
      ) : (
        <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-200 text-muted hover:border-primary hover:text-primary">
          <FiUpload />
          <span className="text-xs">{uploading ? 'Uploading…' : 'Upload'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
