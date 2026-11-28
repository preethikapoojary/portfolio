'use client';
import { useEffect, useMemo, useState } from 'react';
import CrudModulePage from '@/components/admin/ui/CrudModulePage';
import { skillsApi } from '@/lib/adminApi/endpoints';

const ADD_NEW_OPTION = '__add_new_category__';

function SkillCategorySelect({ value, onChange, categories, onAddCategory }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const options = useMemo(() => {
    const set = new Set(categories);
    if (value && value.trim()) set.add(value.trim());
    return Array.from(set);
  }, [categories, value]);

  const commitNewCategory = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    onChange(trimmed);
    setDraft('');
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      <select
        className="input"
        value={adding ? ADD_NEW_OPTION : value || ''}
        onChange={(e) => {
          if (e.target.value === ADD_NEW_OPTION) {
            setAdding(true);
            setDraft('');
          } else {
            setAdding(false);
            onChange(e.target.value);
          }
        }}
      >
        {options.length === 0 && (
          <option value="" disabled>
            Select or add a category…
          </option>
        )}
        {options.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
        <option value={ADD_NEW_OPTION}>+ Add new category…</option>
      </select>

      {adding && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="input flex-1"
            placeholder="Enter new category name"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitNewCategory();
              }
            }}
            autoFocus
          />
          <button type="button" onClick={commitNewCategory} className="btn-primary text-xs">
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setDraft('');
            }}
            className="btn-secondary text-xs"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'proficiency', label: 'Proficiency', render: (row) => `${row.proficiency}%` },
];

export default function SkillsPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    skillsApi
      .list()
      .then((res) => {
        const existing = (res?.data || [])
          .map((item) => (item.category || '').trim())
          .filter(Boolean);
        setCategories((prev) => Array.from(new Set([...prev, ...existing])));
      })
      .catch(() => {});
  }, []);

  const addCategory = (cat) => {
    setCategories((prev) => (prev.includes(cat) ? prev : [...prev, cat]));
  };

  const fields = [
    { key: 'name', label: 'Skill Name', type: 'text' },
    {
      key: 'category',
      label: 'Category',
      type: 'custom',
      render: (value, onChange) => (
        <SkillCategorySelect
          value={value}
          onChange={onChange}
          categories={categories}
          onAddCategory={addCategory}
        />
      ),
    },
    { key: 'proficiency', label: 'Proficiency (%)', type: 'number', min: 0, max: 100 },
  ];

  return (
    <CrudModulePage
      title="Skills"
      description="Technologies and tools shown with proficiency bars on the public site."
      api={skillsApi}
      columns={columns}
      fields={fields}
      emptyValues={{ name: '', category: categories[0] || '', proficiency: 80, icon: '' }}
    />
  );
}
