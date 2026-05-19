import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ items, role, onDelete, onStatusChange }) {
  /* Валидация входного массива — предотвращает отображение пустой сетки */
  if (items.length === 0) {
    return <div className="empty-msg">Реестр пуст. Добавьте первую заявку!</div>;
  }

  return (
    <table className="registry-table">
      <thead>
        {/* Все теги записаны в линию БЕЗ переносов строк и пробелов. Ошибка whitespace устранена! */}
        <tr><th>ID / Шифр</th><th>Объект / Модель</th><th>Физика (CAE)</th><th>Сетка (FEM)</th><th>Приоритет</th><th>Стоимость (SLA)</th><th>Результаты расчетов</th><th>Дедлайн</th><th>Статус</th><th>Действие</th></tr>
      </thead>
      <tbody>
        {/* Итеративный рендеринг строк реестра */}
        {items.map(item => (
          <TaskCard
            key={item.id} // Уникальный ключ для оптимальной работы React Virtual DOM
            {...item}     // Деструктуризация и проброс всех свойств объекта задачи
            role={role}   // Передача текущей роли для разграничения прав RBAC
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </tbody>
    </table>
  );
}