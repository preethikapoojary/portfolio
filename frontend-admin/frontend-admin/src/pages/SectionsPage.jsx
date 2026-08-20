import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { sectionsApi } from '../api/endpoints';
import ReorderableList from '../components/ui/ReorderableList';

export default function SectionsPage() {
  const [sections, setSections] = useState([]);

  const load = () => sectionsApi.list().then((res) => setSections(res.data));
  useEffect(() => { load(); }, []);

  const handleReorder = async (next) => {
    setSections(next); // optimistic
    await sectionsApi.reorder(next.map((s, i) => ({ id: s._id, order: i })));
  };

  const toggleVisibility = async (section) => {
    const res = await sectionsApi.toggleVisibility(section._id);
    setSections((prev) => prev.map((s) => (s._id === section._id ? res.data : s)));
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Sections</h1>
        <p className="text-sm text-muted">Drag to reorder, toggle to show/hide on the public site.</p>
      </div>

      <ReorderableList
        items={sections}
        onReorder={handleReorder}
        renderItem={(section) => (
          <div className="flex items-center justify-between">
            <span className={section.isVisible ? '' : 'text-muted line-through'}>{section.label}</span>
            <button onClick={() => toggleVisibility(section)} className="rounded p-1.5 text-muted hover:bg-slate-100">
              {section.isVisible ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
        )}
      />
    </div>
  );
}
