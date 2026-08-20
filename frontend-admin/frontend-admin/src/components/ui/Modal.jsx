import { FiX } from 'react-icons/fi';

export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`max-h-[90vh] w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} overflow-y-auto rounded-xl bg-panel p-6 shadow-xl`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded p-1.5 text-muted hover:bg-slate-100" aria-label="Close">
            <FiX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
