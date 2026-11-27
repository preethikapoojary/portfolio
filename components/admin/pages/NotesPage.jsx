'use client';
import { useEffect, useMemo, useState } from 'react';
import { FiBookmark, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { notesApi } from '@/lib/adminApi/endpoints';
import SearchBar from '@/components/admin/ui/SearchBar';
import Modal from '@/components/admin/ui/Modal';

const emptyForm = { title: '', category: 'General', content: '', isPinned: false };

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    notesApi
      .list()
      .then((res) => setNotes(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...notes].sort((a, b) => Number(!!b.isPinned) - Number(!!a.isPinned));
    if (!q) return sorted;
    return sorted.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q) ||
        (n.category || '').toLowerCase().includes(q)
    );
  }, [notes, query]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setForm({
      title: note.title || '',
      category: note.category || 'General',
      content: note.content || '',
      isPinned: !!note.isPinned,
    });
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await notesApi.update(editing._id, form);
      } else {
        await notesApi.create(form);
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const togglePin = async (note) => {
    await notesApi.update(note._id, { isPinned: !note.isPinned });
    load();
  };

  const archiveNote = async (note) => {
    await notesApi.remove(note._id);
    setNotes((prev) => prev.filter((n) => n._id !== note._id));
  };

  if (loading) return <p className="text-muted">Loading notes…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Notes</h1>
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar onSearch={setQuery} placeholder="Search notes..." />
          <button type="button" onClick={openNew} className="btn-primary inline-flex items-center gap-1.5">
            <FiPlus size={14} /> Add Note
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center text-sm text-muted">
          No notes yet. Click &ldquo;Add Note&rdquo; to create one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => (
            <article key={note._id} className="card flex flex-col justify-between gap-4">
              <div>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="border border-[#DCD9D1] bg-[#E9E5DC]/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                    {note.category || 'General'}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePin(note)}
                    title={note.isPinned ? 'Unpin note' : 'Pin note'}
                    className={`p-1 transition-colors ${
                      note.isPinned ? 'text-ink' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <FiBookmark size={14} />
                  </button>
                </div>
                <h2 className="text-lg font-medium text-ink">{note.title}</h2>
                {note.content && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
                    {note.content}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#DCD9D1] pt-3 text-xs text-muted">
                <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(note)}
                    className="p-1 text-muted transition-colors hover:text-ink"
                    aria-label="Edit note"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => archiveNote(note)}
                    className="p-1 text-muted transition-colors hover:text-red-600"
                    aria-label="Move note to trash"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Note' : 'New Note'}
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label" htmlFor="note-title">Title</label>
            <input
              id="note-title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="note-category">Category</label>
            <input
              id="note-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="General, Ideas, Todo..."
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input"
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-ink">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
            />
            Pin this note to top
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save Note'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
