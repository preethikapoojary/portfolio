import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { testimonialsApi } from '../api/endpoints';
import Modal from '../components/ui/Modal';
import DynamicForm from '../components/ui/DynamicForm';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-red-50 text-red-600',
};

const editFields = [
  { key: 'name', label: 'Full Name', type: 'text' },
  { key: 'role', label: 'Role / Designation', type: 'text' },
  { key: 'company', label: 'Company / College', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'text' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
  { key: 'message', label: 'Testimonial', type: 'textarea', rows: 4 },
];

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('pending');
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
    if (!window.confirm('Delete this testimonial? This cannot be undone.')) return;
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
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Testimonials</h1>
          <p className="text-sm text-muted">Only approved & visible testimonials show on the public site.</p>
        </div>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
                filter === f ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="card text-sm text-muted">Loading testimonials…</p>
        ) : items.length === 0 ? (
          <p className="card text-sm text-muted">No testimonials in this filter.</p>
        ) : (
          items.map((t) => (
            <div key={t._id} className="card flex gap-4">
              {t.avatar?.url ? (
                <img src={t.avatar.url} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-muted">
                  {t.name?.[0]}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{t.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[t.status]}`}>{t.status}</span>
                  {!t.isVisible && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-muted">Hidden</span>}
                </div>
                <p className="text-xs text-muted">
                  {t.role} {t.company ? `· ${t.company}` : ''}
                </p>
                <p className="mt-2 text-sm">{t.message}</p>
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

              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex gap-1">
                  {t.status !== 'approved' && (
                    <button onClick={() => approve(t._id)} className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50" aria-label="Approve">
                      <FiCheck />
                    </button>
                  )}
                  {t.status !== 'rejected' && (
                    <button onClick={() => reject(t._id)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Reject">
                      <FiX />
                    </button>
                  )}
                  <button onClick={() => toggleVisibility(t._id)} className="rounded p-1.5 text-muted hover:bg-slate-100" aria-label="Toggle visibility">
                    {t.isVisible ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <button onClick={() => setEditing(t)} className="rounded p-1.5 text-muted hover:bg-slate-100" aria-label="Edit">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => remove(t._id)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <Modal title="Edit Testimonial" onClose={() => setEditing(null)} wide>
          <form onSubmit={submitEdit}>
            <DynamicForm fields={editFields} values={editing} onChange={setEditing} />
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
