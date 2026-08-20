import { useState } from 'react';

/**
 * Native HTML5 drag-and-drop reorder list — no extra dependency needed.
 * renderItem(item) controls the row's content; onReorder receives the
 * full reordered array. Calling code is responsible for persisting the
 * new order via the module's `reorder` API call (createCrudApi(...).reorder).
 */
export default function ReorderableList({ items, renderItem, onReorder }) {
  const [dragIndex, setDragIndex] = useState(null);

  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    onReorder(next);
    setDragIndex(null);
  };

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={item._id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
          className="card flex cursor-grab items-center gap-3 p-3 active:cursor-grabbing"
        >
          <span className="select-none text-muted">⠿</span>
          <div className="flex-1">{renderItem(item)}</div>
        </li>
      ))}
    </ul>
  );
}
