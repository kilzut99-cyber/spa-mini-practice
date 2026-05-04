import React from 'react';

export default function TaskCard({ 
  id, title, priority = "Medium", deadline, status = "НОВАЯ", 
  lod, geoHash, role, onDelete, onStatusChange 
}) {
  
  // Добавляем проверку, чтобы toLowerCase() не вызывался у undefined
  const statusClass = status ? status.toLowerCase() : 'new';

  const calculateCost = () => {
    const base = lod === 'High' ? 1500 : 800;
    const multiplier = priority === 'High' ? 2 : 1;
    return base * multiplier;
  };

  return (
    <tr className={`task-row status-${statusClass}`}>
      <td><small>{id}</small></td>
      <td>
        <strong>{title}</strong>
        <div className="model-meta">Hash: {geoHash} | LOD: {lod}</div>
      </td>
      {/* Тоже добавляем защиту для priority */}
      <td><span className={`priority-badge ${priority ? priority.toLowerCase() : ''}`}>{priority}</span></td>
      <td>{deadline}</td>
      <td>{calculateCost()} $</td>
      <td>
        <select 
          value={status} 
          onChange={(e) => onStatusChange(id, e.target.value)}
          disabled={role === 'Engineer'}
        >
          <option value="НОВАЯ">Новая</option>
          <option value="В РАСЧЕТЕ">В расчете</option>
          <option value="ВЕРИФИКАЦИЯ">Верификация</option>
          <option value="ЗАВЕРШЕНО">Завершено</option>
        </select>
      </td>
      <td>
        {role === 'Consultant' && (
          <button className="del-btn" onClick={() => onDelete(id)}>✕</button>
        )}
      </td>
    </tr>
  );
}