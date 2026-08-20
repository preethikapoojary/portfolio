import { useEffect, useState } from 'react';
import { FiUsers, FiCalendar, FiDownload, FiMail, FiMessageSquare } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardApi } from '../api/endpoints';
import StatCard from '../components/ui/StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .stats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading dashboard…</p>;

  const { analytics, notifications } = stats || {};
  const topProjects = analytics?.topProjects || [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Overview</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FiUsers} label="Total visitors" value={analytics?.totalVisitors ?? 0} />
        <StatCard icon={FiCalendar} label="Today's visitors" value={analytics?.todayVisitors ?? 0} />
        <StatCard icon={FiDownload} label="Resume downloads" value={analytics?.resumeDownloads ?? 0} />
        <StatCard
          icon={FiMail}
          label="Unread messages"
          value={notifications?.unreadMessages ?? 0}
          accent="text-red-500"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="mb-4 font-medium">Top viewed projects</h2>
          {topProjects.length === 0 ? (
            <p className="text-sm text-muted">Project view data will appear here once projects are added and visited.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={topProjects}>
                <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#6366F1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2 className="mb-4 flex items-center gap-2 font-medium">
            <FiMessageSquare /> Pending testimonials
          </h2>
          <p className="text-3xl font-semibold text-primary">{notifications?.pendingTestimonials ?? 0}</p>
          <p className="mt-1 text-sm text-muted">Awaiting your approval</p>
        </div>
      </div>
    </div>
  );
}
