'use client';
import { useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';
import PdfUploader from './PdfUploader';
import RichTextEditor from './RichTextEditor';

/**
 * Renders form fields from a config array so each module page only needs to
 * declare its shape, not build a bespoke form. Supported types: text,
 * textarea, richtext, number, date, checkbox, select, tags (comma-separated
 * array), lines (one-per-line array, e.g. bullet responsibilities), image
 * (single mediaSchema), images (array of mediaSchema), pdf (single document),
 * custom (provide a `render(value, onChange)` function for complex fields).
 */
function makeSlug(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sanitizeSlugInput(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '');
}

function makeUniqueSlug(text, existingSlugs = []) {
  const base = makeSlug(text);
  if (!base) return '';
  const taken = new Set(existingSlugs.map((s) => makeSlug(s)));
  let candidate = base;
  let counter = 2;
  while (taken.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export default function DynamicForm({ fields, values, onChange, existingSlugs = [] }) {
  const hasSlugField = fields.some((f) => f.key === 'slug');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    setSlugManuallyEdited(false);
  }, [values?._id]);

  const takenSet = new Set(existingSlugs.map((s) => makeSlug(s)));
  const currentSlug = makeSlug(values.slug);
  const slugConflict = hasSlugField && currentSlug && takenSet.has(currentSlug);

  const sourceKey = fields.some((f) => f.key === 'title')
    ? 'title'
    : fields.some((f) => f.key === 'role')
      ? 'role'
      : fields.some((f) => f.key === 'name')
        ? 'name'
        : null;

  const set = (key, value) => {
    const next = { ...values, [key]: value };
    if (key === 'slug') {
      if (!value) {
        setSlugManuallyEdited(false);
        next.slug = '';
      } else {
        setSlugManuallyEdited(true);
        next.slug = sanitizeSlugInput(value);
      }
    } else if (sourceKey && key === sourceKey && hasSlugField && !slugManuallyEdited) {
      next.slug = makeUniqueSlug(value, existingSlugs);
    }
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="label">{field.label}</label>
          {renderField(field, values, set)}
          {field.key === 'slug' && slugConflict && (
            <p className="mt-1 text-xs text-red-600">
              This slug is already in use. Every item must have a unique slug/URL.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function renderField(field, values, set) {
  const value = values[field.key];

  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          className="input"
          rows={field.rows || 3}
          value={value || ''}
          onChange={(e) => set(field.key, e.target.value)}
        />
      );

    case 'richtext':
      return <RichTextEditor value={value} onChange={(html) => set(field.key, html)} />;

    case 'number': {
      const effectiveMin =
        field.min !== undefined
          ? field.min
          : field.key === 'order' || field.key === 'homeOrder'
            ? 0
            : undefined;
      return (
        <input
          type="number"
          className="input"
          min={effectiveMin}
          max={field.max}
          value={value ?? ''}
          onKeyDown={(e) => {
            if (effectiveMin !== undefined && effectiveMin >= 0 && (e.key === '-' || e.key === 'e' || e.key === 'E')) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            if (e.target.value === '') {
              set(field.key, '');
              return;
            }
            let num = Number(e.target.value);
            if (Number.isNaN(num)) return;
            if (effectiveMin !== undefined) num = Math.max(effectiveMin, num);
            if (field.max !== undefined) num = Math.min(field.max, num);
            set(field.key, num);
          }}
        />
      );
    }

    case 'date':
      return (
        <input
          type="date"
          className="input"
          value={value ? String(value).slice(0, 10) : ''}
          onChange={(e) => set(field.key, e.target.value)}
        />
      );

    case 'checkbox':
      return (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300"
          checked={!!value}
          onChange={(e) => set(field.key, e.target.checked)}
        />
      );

    case 'select':
      return (
        <select className="input" value={value || field.options[0]} onChange={(e) => set(field.key, e.target.value)}>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case 'tags':
      return (
        <input
          className="input"
          placeholder="Comma-separated (e.g. React, Node.js, MongoDB)"
          value={(value || []).join(', ')}
          onChange={(e) => set(field.key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
        />
      );

    case 'lines':
      return (
        <textarea
          className="input"
          rows={field.rows || 4}
          placeholder={field.placeholder || 'One item per line'}
          value={(value || []).join('\n')}
          onChange={(e) => set(field.key, e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
        />
      );

    case 'image':
      return (
        <ImageUploader
          value={value}
          onChange={(media) => set(field.key, media)}
          folder={field.folder || 'portfolio/images'}
        />
      );

    case 'pdf':
      return <PdfUploader value={value} onChange={(media) => set(field.key, media)} />;

    case 'images':
      return (
        <div className="flex flex-wrap gap-3">
          {(value || []).map((img, i) => (
            <ImageUploader
              key={i}
              value={img}
              onChange={(media) => {
                const next = [...(value || [])];
                if (media) next[i] = media;
                else next.splice(i, 1);
                set(field.key, next);
              }}
            />
          ))}
          <ImageUploader value={null} onChange={(media) => media && set(field.key, [...(value || []), media])} />
        </div>
      );

    case 'custom':
      return field.render(value, (v) => set(field.key, v));

    default:
      return (
        <input
          className="input"
          required={Boolean(field.required)}
          value={value || ''}
          onChange={(e) => set(field.key, e.target.value)}
          onBlur={
            field.key === 'slug'
              ? (e) => set('slug', makeSlug(e.target.value))
              : undefined
          }
        />
      );
  }
}
