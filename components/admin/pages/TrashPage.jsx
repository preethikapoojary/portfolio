'use client';
import { useEffect, useState } from 'react';
import { FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import { trashApi } from '@/lib/adminApi/endpoints';
import Modal from '@/components/admin/ui/Modal';

export default function TrashPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const load = () => {
    setLoading(true);
    trashApi
      .list()
      .then((res) => setItems(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleRestore = async (item) => {
    const key = `${item.module}:${item.id}`;
    setBusyKey(key);
    try {
      await trashApi.restore(item.module, item.id);
      setItems((prev) => prev.filter((x) => !(x.module === item.module && x.id === item.id)));
    } finally {
      setBusyKey('');
    }
  };

  const openPermanentModal = (item) => {
    setConfirmTarget(item);
    setPassword('');
    setPasswordError('');
  };

  const handlePermanentDelete = async (e) => {
    e.preventDefault();
    if (!confirmTarget) return;
    setPasswordError('');
    setBusyKey(`${confirmTarget.module}:${confirmTarget.id}`);
    try {
      await trashApi.permanentDelete(confirmTarget.module, confirmTarget.id, password);
      setItems((prev) =>
        prev.filter((x) => !(x.module === confirmTarget.module && x.id === confirmTarget.id))
      );
      setConfirmTarget(null);
      setPassword('');
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'Incorrect admin password.');
    } finally {
      setBusyKey('');
    }
  };

  if (loading) return <p className="text-muted">Loading trash…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Trash</h1>
          <p className="mt-1 text-xs text-muted">
            Deleted items are archived here. Restore them or permanently delete with your admin password.
          </p>
        </div>
        <span className="text-xs font-medium text-muted">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="card text-center text-sm text-muted">
          Trash is empty.
        </div>
      ) : (
        <div className="divide-y divide-[#DCD9D1] border border-[#DCD9D1] bg-[#F6F4EF]">
          {items.map((item) => {
            const key = `${item.module}:${item.id}`;
            const isBusy = busyKey === key;
            return (
              <div
                key={key}
                className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-[#DCD9D1] bg-[#E9E5DC]/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                      {item.moduleLabel}
                    </span>
                    <span className="truncate text-sm font-medium text-ink">
                      {item.title || 'Untitled'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                    {item.subtitle && <span>{item.subtitle}</span>}
                    {item.archivedAt && (
                      <span>
                        Archived {new Date(item.archivedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleRestore(item)}
                    className="btn-secondary inline-flex items-center gap-1.5 !px-3 !py-1.5"
                  >
                    <FiRotateCcw size={13} /> Restore
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => openPermanentModal(item)}
                    className="inline-flex items-center gap-1.5 border border-red-300 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-red-700 transition-colors hover:bg-red-50"
                  >
                    <FiTrash2 size={13} /> Delete Permanently
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        title="Confirm Permanent Deletion"
      >
        <form onSubmit={handlePermanentDelete} className="space-y-4">
          <p className="text-sm text-muted">
            This will permanently delete{' '}
            <span className="font-medium text-ink">{confirmTarget?.title || 'this item'}</span>{' '}
            from the database. This action cannot be undone.
          </p>

          <div>
            <label className="label" htmlFor="confirm-admin-password">
              Admin Password
            </label>
            <input
              id="confirm-admin-password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your admin password"
              className="input"
            />
          </div>

          {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setConfirmTarget(null)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!busyKey}
              className="border border-red-700 bg-red-700 px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-red-800 disabled:opacity-60"
            >
              {busyKey ? 'Deleting…' : 'Delete Permanently'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
