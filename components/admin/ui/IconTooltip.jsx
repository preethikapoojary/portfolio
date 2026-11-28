'use client';

export default function IconTooltip({ label, children, position = 'top' }) {
  const posClass = position === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5';

  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute right-0 ${posClass} z-50 hidden whitespace-nowrap border border-[#DCD9D1] bg-[#F6F4EF] px-2 py-0.5 text-[11px] font-medium text-[#22221F] opacity-0 shadow-sm transition-opacity duration-150 group-hover/tip:opacity-100 md:block`}
      >
        {label}
      </span>
    </span>
  );
}
