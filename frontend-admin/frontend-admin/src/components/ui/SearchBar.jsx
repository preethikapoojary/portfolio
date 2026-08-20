import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ onSearch, placeholder = 'Search…' }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full max-w-xs">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input pl-9"
      />
    </div>
  );
}
