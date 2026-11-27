'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FiBook,
  FiEdit,
  FiEye,
  FiFileText,
  FiImage,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';
import { notesApi } from '@/lib/adminApi/endpoints';
import axiosClient from '@/lib/adminApi/axiosClient';
import SearchBar from '@/components/admin/ui/SearchBar';
import AdminDrawer from '@/components/admin/ui/AdminDrawer';
import Modal from '@/components/admin/ui/Modal';

function MarkdownPreview({ content }) {
  if (!content?.trim()) {
    return <p className="text-sm text-muted">Nothing to preview yet.</p>;
  }

  const lines = content.split('\n');
  const elements = [];
  let inCode = false;
  let codeLines = [];

  const renderInline = (text) => {
    const parts = text.split(/(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        return (
          <img
            key={idx}
            src={imgMatch[2]}
            alt={imgMatch[1] || 'Note image'}
            className="my-3 max-h-80 border border-[#DCD9D1] object-contain"
          />
        );
      }
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={idx}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#85806D] underline-offset-4 hover:text-[#85806D]"
          >
            {linkMatch[1]}
          </a>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="border border-[#DCD9D1] bg-[#E9E5DC]/50 px-1 py-0.5 text-xs">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, i) => {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        elements.push(
          <pre
            key={`code-${i}`}
            className="my-3 overflow-x-auto border border-[#DCD9D1] bg-[#E9E5DC]/40 p-3 text-xs"
          >
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }
    if (inCode) {
      codeLines.push(line);
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="mt-4 text-base font-semibold text-ink">{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="mt-5 text-xl font-medium text-ink">{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="mt-5 text-2xl font-medium text-ink">{renderInline(line.slice(2))}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<li key={i} className="ml-5 list-disc text-sm leading-relaxed text-ink">{renderInline(line.slice(2))}</li>);
    } else if (!line.trim()) {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="text-sm leading-relaxed text-ink">{renderInline(line)}</p>);
    }
  });

  return <div className="max-h-[60vh] space-y-1.5 overflow-y-auto pr-1">{elements}</div>;
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotebook, setActiveNotebook] = useState(null);

  const [title, setTitle] = useState('');
  const [notebook, setNotebook] = useState('Personal Notes');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('Published');
  const [saving, setSaving] = useState(false);

  const textareaRef = useRef(null);

  const fetchNotes = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await notesApi.list();
      setNotes(res.data || []);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (editingId && !loading && modalOpen && !previewMode) {
      setSaveStatus('Unsaved');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, notebook, content, tags, status]);

  useEffect(() => {
    if (saveStatus !== 'Unsaved' || !editingId || previewMode) return undefined;
    const handler = setTimeout(async () => {
      setSaveStatus('Saving...');
      try {
        await notesApi.update(editingId, {
          title: title || 'Untitled Note',
          notebook: notebook || 'Personal Notes',
          content,
          tags: tags ? tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
          status,
        });
        setSaveStatus('Saved');
        fetchNotes(true);
      } catch {
        setSaveStatus('Unsaved');
      }
    }, 2000);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, notebook, content, tags, status, saveStatus, editingId, previewMode]);

  const openNew = () => {
    setEditingId(null);
    setTitle('');
    setNotebook(activeNotebook || 'Personal Notes');
    setContent('');
    setTags('');
    setStatus('Published');
    setPreviewMode(false);
    setSaveStatus('Saved');
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title || '');
    setNotebook(note.notebook || 'Personal Notes');
    setContent(note.content || '');
    setTags(Array.isArray(note.tags) ? note.tags.join(', ') : '');
    setStatus(note.status || 'Published');
    setPreviewMode(true);
    setSaveStatus('Saved');
    setModalOpen(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title,
      notebook: notebook || 'Personal Notes',
      content,
      tags: tags ? tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      status,
    };
    try {
      if (editingId) {
        await notesApi.update(editingId, payload);
      } else {
        await notesApi.create(payload);
      }
      setModalOpen(false);
      fetchNotes(true);
    } finally {
      setSaving(false);
    }
  };

  const uploadImageFile = async (file) => {
    if (!file.type.startsWith('image/')) return;
    setSaveStatus('Saving...');
    const placeholder = `\n![Uploading ${file.name}...]()\n`;
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setContent((prev) => prev.substring(0, start) + placeholder + prev.substring(end));
    } else {
      setContent((prev) => prev + placeholder);
    }

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'notes');
      const res = await axiosClient.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.data?.url;
      if (url) {
        setContent((prev) => prev.replace(placeholder, `\n![Image](${url})\n`));
        setSaveStatus('Unsaved');
      } else {
        setContent((prev) => prev.replace(placeholder, ''));
      }
    } catch {
      setContent((prev) => prev.replace(placeholder, ''));
      setSaveStatus('Saved');
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items || [];
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].type.includes('image')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) uploadImageFile(file);
        break;
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file?.type.startsWith('image/')) uploadImageFile(file);
  };

  const confirmSoftDelete = async () => {
    if (!deleteTarget) return;
    await notesApi.remove(deleteTarget._id);
    setNotes((prev) => prev.filter((n) => n._id !== deleteTarget._id));
    setDeleteTarget(null);
  };

  const notebooks = useMemo(() => {
    const set = new Set();
    notes.forEach((n) => set.add(n.notebook || 'Personal Notes'));
    return Array.from(set).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes.filter((n) => {
      const matchesNotebook = activeNotebook ? (n.notebook || 'Personal Notes') === activeNotebook : true;
      if (!matchesNotebook) return false;
      if (!q) return true;
      return (
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q) ||
        (n.notebook || '').toLowerCase().includes(q) ||
        (Array.isArray(n.tags) && n.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [notes, searchQuery, activeNotebook]);

  const stats = useMemo(() => {
    const relevant = activeNotebook
      ? notes.filter((n) => (n.notebook || 'Personal Notes') === activeNotebook)
      : notes;
    const latest =
      relevant.length > 0
        ? new Date(
            Math.max(...relevant.map((n) => new Date(n.updatedAt || n.createdAt).getTime()))
          ).toLocaleDateString()
        : 'Never';
    return {
      total: relevant.length,
      drafts: relevant.filter((n) => n.status === 'Draft').length,
      lastUpdated: latest,
    };
  }, [notes, activeNotebook]);

  if (loading) return <p className="text-muted">Loading notebook…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Digital Notebook</h1>
          <p className="mt-1 text-xs text-muted">
            Your personal knowledge base and planning space.
          </p>
        </div>
        <button type="button" onClick={openNew} className="btn-primary inline-flex items-center gap-1.5">
          <FiPlus size={14} /> New Note
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Notebooks Sidebar */}
        <aside className="w-full shrink-0 space-y-5 border-b border-[#DCD9D1] pb-5 lg:w-60 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
          <SearchBar onSearch={setSearchQuery} placeholder="Search notes..." />

          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Notebooks
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveNotebook(null)}
                  className={`flex w-full items-center gap-2 border-l-2 px-3 py-1.5 text-left text-xs transition-colors ${
                    activeNotebook === null
                      ? 'border-[#22221F] bg-[#E9E5DC]/60 font-medium text-ink'
                      : 'border-transparent text-muted hover:bg-[#E9E5DC]/40 hover:text-ink'
                  }`}
                >
                  <FiBook size={13} /> All Notes
                </button>
              </li>
              {notebooks.map((nb) => (
                <li key={nb}>
                  <button
                    type="button"
                    onClick={() => setActiveNotebook(nb)}
                    className={`flex w-full items-center gap-2 border-l-2 px-3 py-1.5 text-left text-xs transition-colors ${
                      activeNotebook === nb
                        ? 'border-[#22221F] bg-[#E9E5DC]/60 font-medium text-ink'
                        : 'border-transparent text-muted hover:bg-[#E9E5DC]/40 hover:text-ink'
                    }`}
                  >
                    <FiBook size={13} /> {nb}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Notes Area */}
        <div className="flex-1 space-y-5">
          <div className="card flex flex-wrap items-center justify-between gap-4 !p-4">
            <div>
              <h2 className="text-lg font-medium text-ink">{activeNotebook || 'All Notes'}</h2>
              <div className="mt-1 flex gap-4 text-xs text-muted">
                <span><strong className="text-ink">{stats.total}</strong> Notes</span>
                <span><strong className="text-ink">{stats.drafts}</strong> Drafts</span>
              </div>
            </div>
            <div className="text-right text-xs text-muted">
              <div>Last Updated</div>
              <div className="font-medium text-ink">{stats.lastUpdated}</div>
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="card text-center text-sm text-muted">
              No notes found. Create one to get started!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredNotes.map((note) => (
                <article
                  key={note._id}
                  onClick={() => openEdit(note)}
                  className="card flex cursor-pointer flex-col justify-between gap-3 transition-colors hover:border-[#85806D]"
                >
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-base font-medium text-ink">{note.title}</h3>
                      {note.status === 'Draft' && (
                        <span className="border border-[#DCD9D1] bg-[#E9E5DC]/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-3 text-xs leading-relaxed text-muted">
                      {(note.content || '').replace(/[#*`_\[\]()]/g, '') || 'Empty note...'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#DCD9D1] pt-3 text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <FiFileText size={12} />{' '}
                      {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(note);
                      }}
                      className="p-1 text-muted transition-colors hover:text-red-600"
                      title="Move to Trash"
                      aria-label="Move note to trash"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Editor / Preview Drawer */}
      {modalOpen && (
        <AdminDrawer
          maxWidth="920px"
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? (previewMode ? title || 'Untitled Note' : 'Edit Note') : 'New Note'}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted">
                {editingId && !previewMode && (
                  <>
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        saveStatus === 'Saved'
                          ? 'bg-emerald-500'
                          : saveStatus === 'Saving...'
                            ? 'bg-amber-400'
                            : 'bg-stone-400'
                      }`}
                    />
                    {saveStatus === 'Saved' ? 'Saved to Cloud' : saveStatus}
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewMode((p) => !p)}
                className="btn-secondary inline-flex items-center gap-1.5 !px-3 !py-1.5"
              >
                {previewMode ? (
                  <>
                    <FiEdit size={13} /> Edit Mode
                  </>
                ) : (
                  <>
                    <FiEye size={13} /> Preview Note
                  </>
                )}
              </button>
            </div>

            {previewMode ? (
              <div className="border-t border-[#DCD9D1] pt-4">
                <MarkdownPreview content={content} />
              </div>
            ) : (
              <form onSubmit={handleSaveNote} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="sm:col-span-3">
                    <input
                      placeholder="Note Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="input text-base font-medium"
                    />
                  </div>
                  <div>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="input"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="note-notebook">Notebook</label>
                    <input
                      id="note-notebook"
                      placeholder="E.g. Personal Notes, Ideas"
                      value={notebook}
                      onChange={(e) => setNotebook(e.target.value)}
                      required
                      list="notebooks-list"
                      className="input"
                    />
                    <datalist id="notebooks-list">
                      {notebooks.map((nb) => (
                        <option key={nb} value={nb} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="label" htmlFor="note-tags">Tags (Comma separated)</label>
                    <input
                      id="note-tags"
                      placeholder="react, ideas, todo"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="label !mb-0" htmlFor="note-content">
                      Content (Markdown supported)
                    </label>
                    <label className="btn-secondary inline-flex cursor-pointer items-center gap-1.5 !px-2.5 !py-1">
                      <FiImage size={13} /> Insert Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImageFile(file);
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <textarea
                    id="note-content"
                    ref={textareaRef}
                    rows={12}
                    placeholder={'# Heading 1\nWrite your thoughts here...\n(You can drag & drop or paste images here)'}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onPaste={handlePaste}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="input font-mono text-xs leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? 'Saving…' : editingId ? 'Save Note' : 'Create Note'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </AdminDrawer>
      )}

      {/* Move to Trash Confirmation */}
      {deleteTarget && (
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Move to Trash"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Are you sure you want to move{' '}
              <span className="font-medium text-ink">{deleteTarget.title || 'this note'}</span> to
              the Trash? You can restore it later if needed.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSoftDelete}
                className="border border-red-700 bg-red-700 px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-red-800"
              >
                Move to Trash
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
