import { useEffect, useState } from 'react';
import { settingsApi } from '../api/endpoints';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsApi.get().then((res) => setSettings(res.data));
  }, []);

  if (!settings) return <p className="text-muted">Loading…</p>;

  const setTheme = (key) => (e) => setSettings({ ...settings, theme: { ...settings.theme, [key]: e.target.value } });
  const setHero = (key) => (e) => setSettings({ ...settings, hero: { ...settings.hero, [key]: e.target.value } });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await settingsApi.update(settings);
      setSettings(res.data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Site Settings</h1>

      <form onSubmit={save} className="space-y-6">
        <section className="card space-y-4">
          <h2 className="font-medium">Theme</h2>
          <div className="grid grid-cols-3 gap-4">
            <ColorField label="Primary" value={settings.theme?.primaryColor} onChange={setTheme('primaryColor')} />
            <ColorField label="Secondary" value={settings.theme?.secondaryColor} onChange={setTheme('secondaryColor')} />
            <ColorField label="Accent" value={settings.theme?.accentColor} onChange={setTheme('accentColor')} />
          </div>
          <div>
            <label className="label">Font Family</label>
            <select
              className="input"
              value={settings.theme?.fontFamily || 'Inter'}
              onChange={setTheme('fontFamily')}
            >
              {['Inter', 'Space Grotesk', 'Poppins', 'Sora', 'Manrope'].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted">
            Logo and favicon are uploaded via the Cloudinary image widget (Phase 2 upload flow).
          </p>
        </section>

        <section className="card space-y-4">
          <h2 className="font-medium">Hero section</h2>
          <div>
            <label className="label">Headline</label>
            <input className="input" value={settings.hero?.headline || ''} onChange={setHero('headline')} />
          </div>
          <div>
            <label className="label">Subheadline</label>
            <textarea className="input" rows={2} value={settings.hero?.subheadline || ''} onChange={setHero('subheadline')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">CTA Text</label>
              <input className="input" value={settings.hero?.ctaText || ''} onChange={setHero('ctaText')} />
            </div>
            <div>
              <label className="label">CTA Link</label>
              <input className="input" value={settings.hero?.ctaLink || ''} onChange={setHero('ctaLink')} />
            </div>
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="font-medium">Footer</h2>
          <div>
            <label className="label">Footer text</label>
            <input
              className="input"
              value={settings.footerText || ''}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
            />
          </div>
        </section>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value || '#000000'} onChange={onChange} className="h-9 w-9 rounded border border-slate-200" />
        <input className="input" value={value || ''} onChange={onChange} />
      </div>
    </div>
  );
}
