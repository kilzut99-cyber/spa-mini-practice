import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ items, role, onDelete, onStatusChange }) {
  // ПОЧЕМУ проверка? Требование БАЗА. Чтобы интерфейс не был "мертвым".
  if (items.length === 0) {
    return <div className="empty-msg">Реестр пуст. Добавьте первую заявку!</div>;
  }

  return (
    <table className="registry-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Объект / Модель</th>
          <th>Приоритет</th>
          <th>Дедлайн</th>
          <th>Стоимость</th>
          <th>Статус (SLA)</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <TaskCard 
            key={item.id} 
            {...item} 
            role={role} 
            onDelete={onDelete} 
            onStatusChange={onStatusChange} 
          />
        ))}
      </tbody>
    </table>
  );
}