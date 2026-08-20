import ImageUploader from './ImageUploader';
import PdfUploader from './PdfUploader';
import RichTextEditor from './RichTextEditor';

/**
 * Renders form fields from a config array so each module page only needs to
 * declare its shape, not build a bespoke form. Supported types: text,
 * textarea, richtext, number, date, checkbox, select, tags (comma-separated
 * array), lines (one-per-line array, e.g. bullet responsibilities), image
 * (single mediaSchema), images (array of mediaSchema), pdf (single document).
 */
export default function DynamicForm({ fields, values, onChange }) {
  const set = (key, value) => onChange({ ...values, [key]: value });

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="label">{field.label}</label>
          {renderField(field, values, set)}
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

    case 'number':
      return (
        <input
          type="number"
          className="input"
          min={field.min}
          max={field.max}
          value={value ?? ''}
          onChange={(e) => set(field.key, e.target.value === '' ? '' : Number(e.target.value))}
        />
      );

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
      return <ImageUploader value={value} onChange={(media) => set(field.key, media)} />;

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

    default:
      return <input className="input" value={value || ''} onChange={(e) => set(field.key, e.target.value)} />;
  }
}
