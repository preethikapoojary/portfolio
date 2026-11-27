'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiAward,
  FiBriefcase,
  FiEdit,
  FiFileText,
  FiMail,
  FiMessageSquare,
  FiPlus,
} from 'react-icons/fi';
import { dashboardApi } from '@/lib/adminApi/endpoints';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .stats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading overview…</p>;

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Overview</h1>
          <p className="mt-1 text-sm text-muted">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/notes" className="btn-secondary inline-flex items-center gap-1.5">
            <FiFileText size={14} /> New Note
          </Link>
          <Link href="/admin/blog" className="btn-secondary inline-flex items-center gap-1.5">
            <FiEdit size={14} /> New Post
          </Link>
          <Link href="/admin/projects" className="btn-primary inline-flex items-center gap-1.5">
            <FiPlus size={14} /> Add Project
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Total Projects</span>
            <FiBriefcase size={16} />
          </div>
          <div>
            <p className="text-3xl font-semibold text-ink">{stats?.projects?.total ?? 0}</p>
            <p className="mt-2 text-xs font-medium text-emerald-600">
              +{stats?.projects?.thisMonth ?? 0} this month
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {stats?.projects?.visible ?? 0} visible projects
            </p>
          </div>
        </div>

        <div className="card flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Published Blogs</span>
            <FiFileText size={16} />
          </div>
          <div>
            <p className="text-3xl font-semibold text-ink">{stats?.blogs?.published ?? 0}</p>
            <p className="mt-2 text-xs font-medium text-emerald-600">
              +{stats?.blogs?.thisMonth ?? 0} this month
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {stats?.blogs?.drafts ?? 0} draft blogs
            </p>
          </div>
        </div>

        <div className="card flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Testimonials</span>
            <FiMessageSquare size={16} />
          </div>
          <div>
            <p className="text-3xl font-semibold text-ink">{stats?.testimonials?.total ?? 0}</p>
            <p className="mt-2 text-xs text-muted">
              {stats?.testimonials?.pending ?? 0} pending review
            </p>
          </div>
        </div>

        <div className="card flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Certificates</span>
            <FiAward size={16} />
          </div>
          <div>
            <p className="text-3xl font-semibold text-ink">{stats?.certificates ?? 0}</p>
            <Link
              href="/admin/certificates"
              className="mt-2 inline-block text-xs font-medium text-emerald-600 hover:underline"
            >
              Manage certificates
            </Link>
          </div>
        </div>

        <div className="card flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Drafts</span>
            <FiEdit size={16} />
          </div>
          <div>
            <p className="text-3xl font-semibold text-ink">{stats?.drafts ?? 0}</p>
            <p className="mt-2 text-xs text-muted">Across all content</p>
          </div>
        </div>

        <div className="card flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Unread Messages</span>
            <FiMail size={16} />
          </div>
          <div>
            <p className="text-3xl font-semibold text-ink">{stats?.unreadMessages ?? 0}</p>
            <Link
              href="/admin/messages"
              className="mt-2 inline-block text-xs font-medium text-emerald-600 hover:underline"
            >
              View inbox
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
