import { FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';

// Supports both boolean isVisible (most modules) and status-based modules
// like Blog (draft/published) without every module needing its own icon logic.
function isRowVisible(row) {
  if (typeof row.isVisible === 'boolean') return row.isVisible;
  if (row.status) return row.status === 'published';
  return true;
}

/**
 * columns: [{ key, label, render?(row) }]
 * Reused across every module's list page (Projects, Certificates, Blog, ...)
 * — a new module needs only its column config, not a new table component.
 */
export default function DataTable({
  columns,
  rows,
  onEdit,
  onDelete,
  onToggleVisibility,
  page,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="card overflow-hidden p-0">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-muted">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-muted">
                No items yet — add your first one above.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {onToggleVisibility && (
                      <button
                        onClick={() => onToggleVisibility(row)}
                        className="rounded p-1.5 text-muted hover:bg-slate-100"
                        aria-label={isRowVisible(row) ? 'Hide' : 'Show'}
                        title={isRowVisible(row) ? 'Visible — click to hide' : 'Hidden — click to show'}
                      >
                        {isRowVisible(row) ? <FiEye /> : <FiEyeOff />}
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="rounded p-1.5 text-muted hover:bg-slate-100" aria-label="Edit">
                        <FiEdit2 />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="rounded p-1.5 text-red-500 hover:bg-red-50"
                        aria-label="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-muted">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="btn-secondary disabled:opacity-40">
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="btn-secondary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
