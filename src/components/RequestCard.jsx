import React from 'react';

// ПОЧЕМУ деструктуризация ({ id, title... })? 
// Это требование БАЗА (стр. 3). Позволяет обращаться к полям напрямую, без props.data.
export default function RequestCard({ id, title, physics, date, role, onDelete }) {
  return (
    <tr className="request-card">
      <td>{id}</td>
      <td><strong>{title}</strong></td>
      <td>{physics}</td>
      <td>
        {/* RBAC Logic: Только Консультант (Admin) может удалять записи. */}
        {role === 'Consultant' && (
          <button onClick={() => onDelete(id)} className="del-btn">✕ Удалить</button>
        )}
      </td>
    </tr>
  );
}