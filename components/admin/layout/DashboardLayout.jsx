'use client';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="admin-shell flex min-h-screen bg-[#F6F4EF] text-[#22221F]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
