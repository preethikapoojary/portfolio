import { useState } from 'react';
import { FiUpload, FiX, FiFileText } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient';

/**
 * Uploads a single PDF to POST /admin/upload/document and returns a
 * mediaSchema-shaped object ({ url, publicId }) via onChange. Reuses the
 * exact same backend upload flow as the Resume module (Cloudinary "raw"
 * upload + attachment-flag fix), just exposed generically for any module
 * that needs an optional document field (Project Report, Experience proof).
 */
export default function PdfUploader({ value, onChange, folder = 'portfolio/documents' }) {
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
      const res = await axiosClient.post('/admin/upload/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.data);
    } catch {
      setError('Upload failed — make sure the file is a PDF under 10MB.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value?.url ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <FiFileText className="text-primary" />
          <a href={value.url} target="_blank" rel="noreferrer" className="flex-1 truncate text-primary hover:underline">
            View uploaded PDF
          </a>
          <button type="button" onClick={() => onChange(null)} className="text-red-500" aria-label="Remove file">
            <FiX size={14} />
          </button>
        </div>
      ) : (
        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 px-4 py-2 text-sm text-muted hover:border-primary hover:text-primary">
          <FiUpload />
          {uploading ? 'Uploading…' : 'Upload PDF'}
          <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
