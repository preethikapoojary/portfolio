export default function StatCard({ icon: Icon, label, value, accent = 'text-primary' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 ${accent}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
