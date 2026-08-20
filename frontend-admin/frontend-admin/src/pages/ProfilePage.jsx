import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { profileApi } from '../api/endpoints';
import ImageUploader from '../components/ui/ImageUploader';

// Must match ICON_TYPE_OPTIONS in frontend-public/src/utils/socialLinks.js
// exactly, by value. There is no "auto-detect" option anymore — the chosen
// icon is always used as-is, with no guessing from the platform name.
const ICON_TYPE_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'email', label: 'Email' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'leetcode', label: 'LeetCode' },
  { value: 'codechef', label: 'CodeChef' },
  { value: 'hackerrank', label: 'HackerRank' },
  { value: 'portfolio', label: 'Portfolio Website' },
  { value: 'custom', label: 'Custom (image URL)' },
];

// A link's icon is "custom" when its stored value is an image URL rather
// than one of the canonical codes above.
function getIconType(icon) {
  if (!icon) return '';
  if (ICON_TYPE_OPTIONS.some((opt) => opt.value === icon)) return icon;
  if (/^https?:\/\//i.test(icon)) return 'custom';
  return '';
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    profileApi.get().then((res) => setProfile(res.data));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileApi.update(profile);
      setProfile(res.data);
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <p className="text-muted">Loading…</p>;

  const set = (key) => (e) => setProfile({ ...profile, [key]: e.target.value });

  const setSocialLink = (index, key, value) => {
    const next = [...(profile.socialLinks || [])];
    next[index] = { ...next[index], [key]: value };
    setProfile({ ...profile, socialLinks: next });
  };

  const addSocialLink = () => {
    setProfile({ ...profile, socialLinks: [...(profile.socialLinks || []), { platform: '', url: '', icon: '' }] });
  };

  const removeSocialLink = (index) => {
    const next = [...(profile.socialLinks || [])];
    next.splice(index, 1);
    setProfile({ ...profile, socialLinks: next });
  };

  const moveSocialLink = (index, direction) => {
    const next = [...(profile.socialLinks || [])];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setProfile({ ...profile, socialLinks: next });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Profile</h1>

      <form onSubmit={save} className="space-y-6">
        <section className="card space-y-4">
          <h2 className="font-medium">Photos</h2>
          <div className="flex flex-wrap gap-8">
            <div>
              <label className="label">Profile Photo</label>
              <ImageUploader
                value={profile.profilePhoto}
                onChange={(media) => setProfile({ ...profile, profilePhoto: media || {} })}
                folder="portfolio/profile"
              />
            </div>
            <div>
              <label className="label">Cover / Banner Image</label>
              <ImageUploader
                value={profile.coverBanner}
                onChange={(media) => setProfile({ ...profile, coverBanner: media || {} })}
                folder="portfolio/profile"
              />
            </div>
          </div>
        </section>

        <section className="card space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={profile.name || ''} onChange={set('name')} />
          </div>
          <div>
            <label className="label">Professional Title</label>
            <input className="input" value={profile.title || ''} onChange={set('title')} />
          </div>
          <div>
            <label className="label">About Me</label>
            <textarea className="input" rows={5} value={profile.aboutMe || ''} onChange={set('aboutMe')} />
          </div>
          <div>
            <label className="label">Career Objective</label>
            <textarea className="input" rows={3} value={profile.careerObjective || ''} onChange={set('careerObjective')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input className="input" value={profile.email || ''} onChange={set('email')} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={profile.phone || ''} onChange={set('phone')} />
            </div>
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={profile.location || ''} onChange={set('location')} />
          </div>
        </section>

        <section className="card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Social Links</h2>
              <p className="text-xs text-muted">
                These appear automatically in the Hero, Contact, and Footer sections of the public
                site — in this order. Choose an icon for each link from the dropdown; it's always
                used exactly as selected, with no guessing from the platform name. Pick "Custom" to
                use your own icon image instead. For Email, just enter the address — no need to type
                "mailto:".
              </p>
            </div>
            <button type="button" onClick={addSocialLink} className="btn-secondary flex shrink-0 items-center gap-1 text-xs">
              <FiPlus /> Add link
            </button>
          </div>
          {(profile.socialLinks || []).length === 0 && (
            <p className="text-sm text-muted">No social links yet — add one above.</p>
          )}
          <div className="space-y-3">
            {(profile.socialLinks || []).map((link, i) => {
              const iconType = getIconType(link.icon);
              return (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex flex-col gap-1 pt-1.5">
                    <button
                      type="button"
                      onClick={() => moveSocialLink(i, -1)}
                      disabled={i === 0}
                      className="rounded p-1 text-muted hover:bg-slate-100 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <FiArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSocialLink(i, 1)}
                      disabled={i === (profile.socialLinks || []).length - 1}
                      className="rounded p-1 text-muted hover:bg-slate-100 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <FiArrowDown size={14} />
                    </button>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.4fr_1fr]">
                      <input
                        className="input"
                        placeholder="Platform (e.g. LinkedIn)"
                        value={link.platform || ''}
                        onChange={(e) => setSocialLink(i, 'platform', e.target.value)}
                      />
                      <input
                        className="input"
                        placeholder="https://… or you@email.com"
                        value={link.url || ''}
                        onChange={(e) => setSocialLink(i, 'url', e.target.value)}
                      />
                      <select
                        className={`input ${!iconType ? 'text-muted' : ''}`}
                        value={iconType}
                        onChange={(e) => {
                          const val = e.target.value;
                          // Switching to Custom clears any old code so the
                          // URL field below starts empty; switching to a
                          // known code stores that code directly.
                          setSocialLink(i, 'icon', val === 'custom' ? '' : val);
                        }}
                      >
                        <option value="" disabled>
                          Choose an icon…
                        </option>
                        {ICON_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    {iconType === 'custom' && (
                      <input
                        className="input"
                        placeholder="Custom icon image URL (https://…)"
                        value={link.icon || ''}
                        onChange={(e) => setSocialLink(i, 'icon', e.target.value)}
                      />
                    )}
                    {!iconType && (
                      <p className="text-xs text-amber-600">
                        No icon selected — this link will show a generic placeholder icon until you choose one.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(i)}
                    className="rounded p-2 text-red-500 hover:bg-red-50"
                    aria-label="Remove link"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {savedAt && <span className="text-sm text-muted">Saved {savedAt.toLocaleTimeString()}</span>}
        </div>
      </form>
    </div>
  );
}
