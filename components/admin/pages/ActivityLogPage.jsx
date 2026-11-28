'use client';
import { useEffect, useState } from 'react';
import { activityLogApi } from '@/lib/adminApi/endpoints';

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
  MESSAGE_RECEIVED: 'text-sky-600 bg-sky-50',
  TESTIMONIAL_RECEIVED: 'text-amber-600 bg-amber-50',
};

export default function ActivityLogPage() {
  const [result, setResult] = useState({ data: [], meta: {} });

  useEffect(() => {
    activityLogApi.list({ limit: 15 }).then((res) => setResult(res));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Activity Log</h1>
        <p className="text-sm text-muted">
          Showing the 15 most recent activities across admin actions, logins, received messages, and testimonials.
        </p>
      </div>

      <div className="card divide-y divide-slate-100 p-0">
        {result.data.length === 0 ? (
          <p className="p-6 text-sm text-muted">No activity recorded yet.</p>
        ) : (
          result.data.slice(0, 15).map((entry) => (
            <div key={entry._id} className="flex items-start gap-3 px-5 py-3">
              <span className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[entry.action] || 'text-slate-600 bg-slate-100'}`}>
                {entry.action}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{entry.description}</p>
                <p className="text-xs text-muted">
                  {entry.adminEmail || entry.adminId?.name || 'Admin'} · {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="py-2 text-center text-xs text-muted">
        Showing the 15 most recent activities. To view all activity records, check the{' '}
        <span className="font-medium text-[#22221F]">activity_logs</span> table in your database.
      </p>
    </div>
  );
}
