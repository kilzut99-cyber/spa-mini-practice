import React from 'react';

export default function FilterPanel({ activeFilter, onFilterChange }) {
  // Категории согласно ТЗ (стр. 6)
  const categories = ["Все", "Механика", "CFD", "Тепло"];

  return (
    <div className="filter-panel">
      {categories.map(cat => (
        <button 
          key={cat}
          // ПОЧЕМУ активная кнопка выделена? Требование JUNIOR (стр. 4).
          className={activeFilter === cat ? "filter-btn active" : "filter-btn"}
          onClick={() => onFilterChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}