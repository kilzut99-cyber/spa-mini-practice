import React from 'react';

export default function TaskCard({ id, title, priority, deadline, status, lod, geoHash, role, onDelete, onStatusChange }) {
  
  // ПОЧЕМУ расчет здесь? Задача 5 ТЗ требует расчет стоимости. 
  // Мы имитируем это: цена зависит от сложности (LOD) и приоритета.
  const calculateCost = () => {
    const base = lod === 'High' ? 1500 : 800;
    const multiplier = priority === 'High' ? 2 : 1;
    return base * multiplier;
  };

  return (
    <tr className={`task-row status-${status.toLowerCase()}`}>
      <td><small>{id}</small></td>
      <td>
        <strong>{title}</strong>
        <div className="model-meta">Hash: {geoHash} | LOD: {lod}</div>
      </td>
      <td><span className={`priority-badge ${priority}`}>{priority}</span></td>
      <td>{deadline}</td>
      <td>{calculateCost()} $</td>
      <td>
        <select 
          value={status} 
          onChange={(e) => onStatusChange(id, e.target.value)}
          /* ПОЧЕМУ disabled? Реализация RBAC (стр. 12 ТЗ). Инженер видит задачу, 
             но менять статус "Завершено" может только Консультант (Админ). */
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