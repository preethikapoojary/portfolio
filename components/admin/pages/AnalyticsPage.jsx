'use client';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FiClock, FiExternalLink, FiFileText, FiMousePointer, FiUsers } from 'react-icons/fi';
import { analyticsApi } from '@/lib/adminApi/endpoints';

const COLORS = ['#22221F', '#85806D', '#A6A39B', '#57534E', '#78716C'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    setLoading(true);
    analyticsApi
      .get(days)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) return <p className="text-muted">Loading analytics data…</p>;
  if (!data) {
    return (
      <div className="card text-sm text-muted">
        No analytics data available yet. Make sure you ran the Supabase analytics migration.
      </div>
    );
  }

  const resumeDownloads =
    (data.eventCounts?.click_resume || 0) + (data.eventCounts?.resume_download || 0);
  const contactSubmissions = data.eventCounts?.form_submit || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Analytics &amp; Insights</h1>
          <p className="mt-1 text-xs text-muted">
            {days === 0
              ? 'Showing all-time portfolio traffic and visitor engagement records.'
              : 'Understand your portfolio traffic and visitor engagement.'}
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="input !w-auto"
        >
          <option value={1}>Today</option>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
          <option value={0}>All Time</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card flex items-center gap-4">
          <div className="border border-[#DCD9D1] bg-[#E9E5DC]/50 p-3 text-ink">
            <FiUsers size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted">Unique Visitors</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{data.overview.totalVisitors}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="border border-[#DCD9D1] bg-[#E9E5DC]/50 p-3 text-ink">
            <FiFileText size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted">Page Views</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{data.overview.totalViews}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="border border-[#DCD9D1] bg-[#E9E5DC]/50 p-3 text-ink">
            <FiExternalLink size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted">Resume Downloads</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{resumeDownloads}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="border border-[#DCD9D1] bg-[#E9E5DC]/50 p-3 text-ink">
            <FiMousePointer size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted">Contact Submissions</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{contactSubmissions}</p>
          </div>
        </div>
      </div>

      {/* Traffic Trends */}
      <div className="card">
        <h2 className="mb-4 text-lg font-medium">Traffic Trends</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCD9D1" vertical={false} />
              <XAxis dataKey="date" stroke="#89877F" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="#89877F" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip />
              <Line type="monotone" dataKey="views" stroke="#85806D" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section Engagement + Device Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
            <FiClock size={16} /> Average Time per Section (Seconds)
          </h2>
          <div className="h-72 w-full">
            {data.sectionData.length === 0 ? (
              <p className="text-sm text-muted">No section engagement tracked yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.sectionData} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCD9D1" horizontal={false} />
                  <XAxis type="number" stroke="#89877F" fontSize={12} />
                  <YAxis dataKey="section" type="category" stroke="#89877F" fontSize={12} width={96} />
                  <RechartsTooltip />
                  <Bar dataKey="avgTimeSeconds" fill="#85806D" barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-medium">Device Breakdown</h2>
          <div className="relative h-72 w-full">
            {data.deviceData.length === 0 ? (
              <p className="text-sm text-muted">No device data yet.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={96}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {data.deviceData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold text-ink">{data.overview.totalVisitors}</span>
                  <span className="text-xs text-muted">Visitors</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top Pages + Engagement Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card overflow-x-auto">
          <h2 className="mb-4 text-lg font-medium">Top Visited Pages</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#DCD9D1] text-left text-xs uppercase tracking-[0.08em] text-muted">
                <th className="py-2 font-medium">Path</th>
                <th className="py-2 text-right font-medium">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD9D1]">
              {data.topPages.map((p) => (
                <tr key={p.path}>
                  <td className="py-2.5 pr-4 text-ink">{p.path}</td>
                  <td className="py-2.5 text-right font-medium text-ink">{p.views}</td>
                </tr>
              ))}
              {data.topPages.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-muted">
                    No page views yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card overflow-x-auto">
          <h2 className="mb-4 text-lg font-medium">Engagement Events</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#DCD9D1] text-left text-xs uppercase tracking-[0.08em] text-muted">
                <th className="py-2 font-medium">Event Type</th>
                <th className="py-2 text-right font-medium">Occurrences</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD9D1]">
              {Object.entries(data.eventCounts || {}).map(([event, count]) => (
                <tr key={event}>
                  <td className="py-2.5 capitalize text-ink">
                    {event.replace('click_', '').replace(/_/g, ' ')}
                  </td>
                  <td className="py-2.5 text-right font-medium text-ink">{count}</td>
                </tr>
              ))}
              {Object.keys(data.eventCounts || {}).length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-muted">
                    No events tracked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
