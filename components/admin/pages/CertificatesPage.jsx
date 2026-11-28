'use client';
import { useState } from 'react';
import { FiCamera, FiTrash2, FiUpload } from 'react-icons/fi';
import CrudModulePage from '@/components/admin/ui/CrudModulePage';
import IconTooltip from '@/components/admin/ui/IconTooltip';
import { certificatesApi } from '@/lib/adminApi/endpoints';
import axiosClient from '@/lib/adminApi/axiosClient';

function EventPhotosEditor({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const photos = Array.isArray(value) ? value : [];

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'portfolio/certificates');
        const res = await axiosClient.post('/admin/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploaded.push({ ...res.data.data, caption: '' });
      }
      onChange([...photos, ...uploaded]);
    } catch {
      setError('Photo upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const updateCaption = (idx, caption) => {
    onChange(photos.map((p, i) => (i === idx ? { ...p, caption, alt: caption } : p)));
  };

  const removePhoto = (idx) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-[#22221F]">
          <FiCamera size={14} />
          Event Photos / Image Gallery ({photos.length})
        </span>
        <label className="btn-secondary inline-flex cursor-pointer items-center gap-1.5 text-xs">
          <FiUpload size={13} />
          {uploading ? 'Uploading…' : 'Upload Photo'}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {photos.length > 0 && (
        <div className="space-y-2.5">
          {photos.map((photo, idx) => (
            <div
              key={`${photo.publicId || photo.url}-${idx}`}
              className="flex items-center gap-3 border border-[#DCD9D1] bg-[#F6F4EF] p-2.5"
            >
              <img
                src={photo.url}
                alt={photo.caption || photo.alt || ''}
                className="h-12 w-14 shrink-0 rounded border border-[#DCD9D1] object-cover"
              />
              <input
                type="text"
                className="input flex-1"
                placeholder="Image caption (optional)"
                value={photo.caption ?? photo.alt ?? ''}
                onChange={(e) => updateCaption(idx, e.target.value)}
              />
              <IconTooltip label="Remove photo">
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="rounded border border-red-200 p-2 text-red-500 transition-colors hover:bg-red-50"
                  aria-label="Remove photo"
                >
                  <FiTrash2 size={14} />
                </button>
              </IconTooltip>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'slug', label: 'Slug (optional — auto-generated from title)', type: 'text' },
  { key: 'issuer', label: 'Issuer', type: 'text' },
  { key: 'image', label: 'Certificate Image', type: 'image', folder: 'portfolio/certificates' },
  { key: 'credentialUrl', label: 'Credential URL', type: 'text' },
  { key: 'issueDate', label: 'Issue Date', type: 'date' },
  { key: 'order', label: 'Sort Order (Certificates Page)', type: 'number', min: 1 },
  { key: 'homeOrder', label: 'Home Page Order (1, 2, 3… leave empty to hide from Home priority)', type: 'number', min: 1 },
  { key: 'galleryHeading', label: 'Gallery Section Heading (Optional)', type: 'text' },
  {
    key: 'eventPhotos',
    label: 'Event Photos / Image Gallery',
    type: 'custom',
    render: (value, onChange) => <EventPhotosEditor value={value} onChange={onChange} />,
  },
];

const columns = [
  {
    key: 'thumb',
    label: '',
    render: (row) =>
      row.image?.url ? (
        <img src={row.image.url} alt="" className="h-10 w-10 rounded object-cover" />
      ) : (
        <div className="h-10 w-10 rounded bg-slate-100" />
      ),
  },
  { key: 'title', label: 'Title' },
  { key: 'issuer', label: 'Issuer' },
  { key: 'order', label: 'Order', render: (row) => row.order ?? 0 },
  {
    key: 'homeOrder',
    label: 'Home',
    render: (row) => (row.homeOrder !== null && row.homeOrder !== undefined ? `#${row.homeOrder}` : '—'),
  },
  {
    key: 'issueDate',
    label: 'Issued',
    render: (row) => (row.issueDate ? new Date(row.issueDate).getFullYear() : '—'),
  },
];

export default function CertificatesPage() {
  return (
    <CrudModulePage
      title="Certificates"
      description="Courses and credentials shown on the public site."
      api={certificatesApi}
      columns={columns}
      fields={fields}
      emptyValues={{
        title: '',
        slug: '',
        issuer: '',
        image: null,
        credentialUrl: '',
        order: 1,
        homeOrder: '',
        galleryHeading: '',
        eventPhotos: [],
      }}
    />
  );
}
