import React from 'react';

export default function FilterPanel({ activeFilter, onFilterChange }) {
  // Список стадий контроля по ТЗ 
  const stages = ["Все", "Новая", "В расчете", "Верификация", "Завершено"];

  return (
    <div className="filter-panel" style={{ display: 'flex', gap: '8px', margin: '15px 0' }}>
      {stages.map(stage => (
        <button
          key={stage}
          className={activeFilter === stage ? "filter-btn active" : "filter-btn"}
          onClick={() => onFilterChange(stage)}
        >
          {stage}
        </button>
      ))}
    </div>
  );
}