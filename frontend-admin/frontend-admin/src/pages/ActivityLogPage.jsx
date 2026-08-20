import { useEffect, useState } from 'react';
import { activityLogApi } from '../api/endpoints';

const ACTION_COLORS = {
  CREATE: 'text-emerald-600 bg-emerald-50',
  UPDATE: 'text-blue-600 bg-blue-50',
  DELETE: 'text-red-600 bg-red-50',
  REORDER: 'text-purple-600 bg-purple-50',
  LOGIN: 'text-slate-600 bg-slate-100',
  LOGOUT: 'text-slate-600 bg-slate-100',
  APPROVE: 'text-emerald-600 bg-emerald-50',
  REJECT: 'text-red-600 bg-red-50',
  ACTIVATE: 'text-amber-600 bg-amber-50',
};

export default function ActivityLogPage() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], meta: {} });

  useEffect(() => {
    activityLogApi.list({ page }).then((res) => setResult(res));
  }, [page]);

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Activity Log</h1>
        <p className="text-sm text-muted">An append-only record of admin actions across every module.</p>
      </div>

      <div className="card divide-y divide-slate-100 p-0">
        {result.data.length === 0 ? (
          <p className="p-6 text-sm text-muted">No activity recorded yet.</p>
        ) : (
          result.data.map((entry) => (
            <div key={entry._id} className="flex items-start gap-3 px-5 py-3">
              <span className={`mt-0.5 rounded px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[entry.action] || ''}`}>
                {entry.action}
              </span>
              <div className="flex-1">
                <p className="text-sm">{entry.description}</p>
                <p className="text-xs text-muted">
                  {entry.adminId?.name || 'Admin'} · {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {result.meta?.totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-40">
            Previous
          </button>
          <button
            disabled={page >= result.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
