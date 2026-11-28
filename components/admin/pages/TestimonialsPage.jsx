'use client';
import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { testimonialsApi } from '@/lib/adminApi/endpoints';
import AdminDrawer from '@/components/admin/ui/AdminDrawer';
import DynamicForm from '@/components/admin/ui/DynamicForm';
import IconTooltip from '@/components/admin/ui/IconTooltip';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-red-50 text-red-600',
};

const editFields = [
  { key: 'avatar', label: 'Profile Photo', type: 'image' },
  { key: 'name', label: 'Full Name', type: 'text' },
  { key: 'slug', label: 'Slug (auto-generated from name)', type: 'text' },
  { key: 'role', label: 'Role / Designation', type: 'text' },
  { key: 'company', label: 'Company / College', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'text' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
  { key: 'message', label: 'Testimonial', type: 'textarea', rows: 4 },
  { key: 'order', label: 'Sort Order (Testimonials Page)', type: 'number', min: 1 },
  { key: 'homeOrder', label: 'Home Page Order (1, 2, 3… leave empty to hide from Home priority)', type: 'number', min: 1 },
];

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const params = filter === 'all' ? {} : { status: filter };
    testimonialsApi
      .list(params)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const approve = async (id) => { await testimonialsApi.approve(id); load(); };
  const reject = async (id) => { await testimonialsApi.reject(id); load(); };
  const toggleVisibility = async (id) => { await testimonialsApi.toggleVisibility(id); load(); };
  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to move this testimonial to Trash?')) return;
    await testimonialsApi.remove(id);
    load();
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await testimonialsApi.update(editing._id, editing);
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Testimonials</h1>
          <p className="text-sm text-muted">Only approved & visible testimonials show on the public site.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'approved', 'pending', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] transition-colors ${
                filter === f
                  ? 'border-[#22221F] bg-[#22221F] text-[#F6F4EF]'
                  : 'border-[#DCD9D1] text-muted hover:border-[#22221F] hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border border-[#DCD9D1] bg-[#F6F4EF]">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading testimonials…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-muted">No testimonials in this filter.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#DCD9D1] bg-[#E9E5DC]/40 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Testimonial</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Home</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD9D1]">
              {items.map((t) => (
                <tr key={t._id} className="align-top transition-colors hover:bg-[#E9E5DC]/20">
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      {t.avatar?.url ? (
                        <img src={t.avatar.url} alt={t.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-muted">
                          {t.name?.[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-[#22221F]">{t.name}</p>
                        {(t.role || t.company) && (
                          <p className="text-xs text-muted">
                            {t.role} {t.company ? `· ${t.company}` : ''}
                          </p>
                        )}
                        <p className="mt-1.5 text-sm text-[#22221F]">{t.message}</p>
                        {(t.linkedinUrl || t.githubUrl || t.email) && (
                          <p className="mt-1 text-xs text-muted">
                            {t.email && <span>{t.email} </span>}
                            {t.linkedinUrl && (
                              <a href={t.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                LinkedIn
                              </a>
                            )}{' '}
                            {t.githubUrl && (
                              <a href={t.githubUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                GitHub
                              </a>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[t.status]}`}>{t.status}</span>
                      {!t.isVisible && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-muted">Hidden</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#22221F]">{t.order ?? 0}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#22221F]">
                    {t.homeOrder !== null && t.homeOrder !== undefined ? `#${t.homeOrder}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {t.status !== 'approved' && (
                        <IconTooltip label="Approve">
                          <button onClick={() => approve(t._id)} className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50" aria-label="Approve">
                            <FiCheck />
                          </button>
                        </IconTooltip>
                      )}
                      {t.status !== 'rejected' && (
                        <IconTooltip label="Reject">
                          <button onClick={() => reject(t._id)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Reject">
                            <FiX />
                          </button>
                        </IconTooltip>
                      )}
                      <IconTooltip label={t.isVisible ? 'Hide from public' : 'Show on public'}>
                        <button onClick={() => toggleVisibility(t._id)} className="rounded p-1.5 text-muted hover:bg-slate-100" aria-label="Toggle visibility">
                          {t.isVisible ? <FiEye /> : <FiEyeOff />}
                        </button>
                      </IconTooltip>
                      <IconTooltip label="Edit">
                        <button onClick={() => setEditing(t)} className="rounded p-1.5 text-muted hover:bg-slate-100" aria-label="Edit">
                          <FiEdit2 />
                        </button>
                      </IconTooltip>
                      <IconTooltip label="Move to Trash">
                        <button onClick={() => remove(t._id)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete">
                          <FiTrash2 />
                        </button>
                      </IconTooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <AdminDrawer isOpen={!!editing} title="Edit Testimonial" onClose={() => setEditing(null)} maxWidth="640px">
          <form onSubmit={submitEdit}>
            <DynamicForm
              fields={editFields}
              values={editing}
              onChange={setEditing}
              existingSlugs={items
                .filter((r) => r._id !== editing?._id)
                .map((r) => r.slug)
                .filter(Boolean)}
            />
            <div className="mt-6 flex justify-end gap-3 border-t border-[#DCD9D1] pt-4">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </AdminDrawer>
      )}
    </div>
  );
}
