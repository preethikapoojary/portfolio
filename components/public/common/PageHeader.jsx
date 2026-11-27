'use client';

export default function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="border-b border-[#DCD9D1] pb-12 pt-16 sm:pb-14 sm:pt-24">
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#89877F]">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-5xl font-medium tracking-tight text-[#22221F] sm:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#89877F]">
          {description}
        </p>
      )}
    </header>
  );
}
