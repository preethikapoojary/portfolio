'use client';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import IconTooltip from './IconTooltip';

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
  const thumbCol = columns.find((c) => c.key === 'thumb');
  const dataCols = columns.filter((c) => c.key !== 'thumb');
  const primaryCol = dataCols[0];
  const secondaryCols = dataCols.slice(1);

  return (
    <div className="card overflow-hidden p-0">
      {/* Mobile Card View */}
      <div className="divide-y divide-[#DCD9D1] md:hidden">
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">
            No items yet — add your first one above.
          </p>
        ) : (
          rows.map((row) => (
            <div key={row._id} className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                {thumbCol && (
                  <div className="shrink-0">
                    {thumbCol.render ? thumbCol.render(row) : row[thumbCol.key]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {primaryCol && (
                    <div className="font-medium text-[#22221F]">
                      {primaryCol.render ? primaryCol.render(row) : row[primaryCol.key]}
                    </div>
                  )}
                  {secondaryCols.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                      {secondaryCols.map((col) => {
                        const val = col.render ? col.render(row) : row[col.key];
                        if (val === null || val === undefined || val === '') return null;
                        return (
                          <span key={col.key} className="inline-flex items-center gap-1">
                            {col.label && <span className="uppercase tracking-wider text-[10px]">{col.label}:</span>}
                            <span className="text-[#22221F]">{val}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#DCD9D1]/60 pt-2.5">
                {onToggleVisibility && (
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(row)}
                    className="inline-flex h-8 w-8 items-center justify-center border border-[#DCD9D1] text-muted hover:border-[#22221F] hover:text-[#22221F]"
                    aria-label={isRowVisible(row) ? 'Hide' : 'Show'}
                  >
                    {isRowVisible(row) ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                  </button>
                )}
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(row)}
                    className="inline-flex h-8 w-8 items-center justify-center border border-[#DCD9D1] text-[#22221F] hover:border-[#22221F]"
                    aria-label="Edit"
                  >
                    <FiEdit2 size={14} />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(row)}
                    className="inline-flex h-8 w-8 items-center justify-center border border-red-200 text-red-500 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto md:block">
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
                      <IconTooltip label={isRowVisible(row) ? 'Hide from public' : 'Show on public'}>
                        <button
                          onClick={() => onToggleVisibility(row)}
                          className="rounded p-1.5 text-muted hover:bg-slate-100"
                          aria-label={isRowVisible(row) ? 'Hide' : 'Show'}
                        >
                          {isRowVisible(row) ? <FiEye /> : <FiEyeOff />}
                        </button>
                      </IconTooltip>
                    )}
                    {onEdit && (
                      <IconTooltip label="Edit">
                        <button onClick={() => onEdit(row)} className="rounded p-1.5 text-muted hover:bg-slate-100" aria-label="Edit">
                          <FiEdit2 />
                        </button>
                      </IconTooltip>
                    )}
                    {onDelete && (
                      <IconTooltip label="Move to Trash">
                        <button
                          onClick={() => onDelete(row)}
                          className="rounded p-1.5 text-red-500 hover:bg-red-50"
                          aria-label="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </IconTooltip>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

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
