import React from 'react';
import RequestCard from './RequestCard';

export default function RequestList({ items, role, onDelete }) {
  // ПОЧЕМУ проверка на пустой массив? Требование БАЗА. 
  // Мы показываем сообщение-заглушку, чтобы интерфейс не был "мёртвым".
  if (items.length === 0) {
    return <div className="empty-msg">Реестр пуст. Добавьте первую заявку!</div>;
  }

  return (
    <table className="registry-table">
      <thead>
        <tr><th>ID</th><th>Объект</th><th>Физика</th><th>Действия</th></tr>
      </thead>
      <tbody>
        {/* ПОЧЕМУ .map()? Это единственный правильный способ рендеринга списков в React. 
            Он превращает данные в JSX-элементы. */}
        {items.map(item => (
          <RequestCard 
            key={item.id} // ПОЧЕМУ уникальный key? Чтобы React не перерисовывал весь список при изменении одной строки.
            {...item} 
            role={role} 
            onDelete={onDelete} 
          />
        ))}
      </tbody>
    </table>
  );
}