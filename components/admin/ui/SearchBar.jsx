'use client';
import { useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ onSearch, placeholder = 'Search…' }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(value), 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full max-w-xs">
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input !pl-9 !pr-8 placeholder:text-[#89877F]"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-[#22221F]"
          aria-label="Clear search"
        >
          <FiX size={14} />
        </button>
      )}
    </div>
  );
}
