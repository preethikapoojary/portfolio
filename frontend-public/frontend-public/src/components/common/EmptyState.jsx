export default function EmptyState({ message = 'Nothing here yet.' }) {
  return (
    <div className="glass-card flex items-center justify-center px-6 py-16 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}
