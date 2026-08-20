import { NavLink } from 'react-router-dom';
import { moduleRegistry } from '../../config/moduleRegistry';

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-panel p-4 md:block">
      <div className="mb-6 px-2 py-2">
        <p className="font-mono text-sm font-semibold text-primary">Portfolio Admin</p>
      </div>
      <nav className="space-y-1">
        {moduleRegistry.map(({ key, label, icon: Icon, path, status }) => (
          <NavLink
            key={key}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                isActive ? 'bg-primary/10 font-medium text-primary' : 'text-muted hover:bg-slate-100'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon size={16} />
              {label}
            </span>
            {status === 'phase2' && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-muted">Soon</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
