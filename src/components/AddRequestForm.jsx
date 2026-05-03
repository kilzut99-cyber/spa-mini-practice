import React, { useState } from 'react';

export default function AddRequestForm({ onAdd }) {
  const [title, setTitle] = useState(''); // Локальное состояние для названия
  const [physics, setPhysics] = useState('Механика'); // Состояние для категории

  const handleSubmit = (e) => {
    // ПОЧЕМУ preventDefault? Чтобы страница не перезагружалась. 
    // В SPA мы обрабатываем данные через JS, не прерывая работу приложения.
    e.preventDefault();

    // ВАЛИДАЦИЯ: .trim() убирает пробелы. Пустые задачи не создаем.
    if (!title.trim()) return;

    onAdd({ title, physics, date: new Date().toLocaleDateString() });
    setTitle(''); // Очистка поля после ввода
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} // ПОЧЕМУ value + onChange? Это превращает инпут в "управляемый компонент".
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Название объекта испытаний..."
      />
      <select value={physics} onChange={(e) => setPhysics(e.target.value)}>
        <option value="Механика">Механика</option>
        <option value="CFD">CFD (Потоки)</option>
        <option value="Тепло">Теплообмен</option>
      </select>
      <button type="submit">Создать заявку</button>
    </form>
  );
}