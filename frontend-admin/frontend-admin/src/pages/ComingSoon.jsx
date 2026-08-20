import { useLocation } from 'react-router-dom';
import { moduleRegistry } from '../config/moduleRegistry';

export default function ComingSoon() {
  const { pathname } = useLocation();
  const module = moduleRegistry.find((m) => m.path === pathname);

  return (
    <div className="card max-w-xl">
      <h1 className="text-xl font-semibold">{module?.label || 'This module'}</h1>
      <p className="mt-2 text-sm text-muted">
        This module ships in Phase 2, once its backend routes are built on top of the CRUD factory.
        The sidebar entry, routing, and this placeholder are already wired up — Phase 2 mainly adds
        the model, the API config line, and a page reusing the shared DataTable / ReorderableList /
        SearchBar components already in this project.
      </p>
    </div>
  );
}
