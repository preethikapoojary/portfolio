import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import DataTable from './DataTable';
import ReorderableList from './ReorderableList';
import SearchBar from './SearchBar';
import DynamicForm from './DynamicForm';
import Modal from './Modal';

/**
 * The single generic page every content module (Education, Skills, Projects,
 * Experience, Certificates, Achievements, Gallery, Blog, Coding Profiles)
 * is built from. A module page is just this component + its own config —
 * see e.g. EducationPage.jsx for the ~20-line usage.
 */
export default function CrudModulePage({
  title,
  description,
  api,
  columns,
  fields,
  emptyValues,
  hasOrder = true,
  hasVisibility = true,
  wideForm = false,
}) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [reorderMode, setReorderMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formValues, setFormValues] = useState(emptyValues);
  const [saving, setSaving] = useState(false);

  const load = async (page = 1) => {
    const res = await api.list({ page, search: search || undefined });
    setRows(res.data);
    setMeta(res.meta || { page: 1, totalPages: 1 });
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setFormValues(emptyValues);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setFormValues(row);
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.update(editing._id, formValues);
      else await api.create(formValues);
      setModalOpen(false);
      await load(meta.page);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    await api.remove(row._id);
    await load(meta.page);
  };

  const toggleVisibility = async (row) => {
    await api.toggleVisibility(row._id);
    await load(meta.page);
  };

  const handleReorder = async (next) => {
    setRows(next); // optimistic
    await api.reorder(next.map((item, i) => ({ id: item._id, order: i })));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add new
        </button>
      </div>

      <div className="flex items-center justify-between">
        <SearchBar onSearch={setSearch} placeholder={`Search ${title.toLowerCase()}…`} />
        {hasOrder && (
          <button onClick={() => setReorderMode((m) => !m)} className="btn-secondary">
            {reorderMode ? 'Done reordering' : 'Reorder'}
          </button>
        )}
      </div>

      {reorderMode ? (
        <ReorderableList
          items={rows}
          onReorder={handleReorder}
          renderItem={(row) => <span>{row[columns[0].key] || row.title || row.name}</span>}
        />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          onEdit={openEdit}
          onDelete={remove}
          onToggleVisibility={hasVisibility ? toggleVisibility : undefined}
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={load}
        />
      )}

      {modalOpen && (
        <Modal title={editing ? `Edit ${title}` : `Add ${title}`} onClose={() => setModalOpen(false)} wide={wideForm}>
          <form onSubmit={submit}>
            <DynamicForm fields={fields} values={formValues} onChange={setFormValues} />
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
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
