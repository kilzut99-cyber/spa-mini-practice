import React, { useState } from 'react';

export default function AddTaskForm({ onAdd }) {
  const [task, setTask] = useState({ title: '', priority: 'Medium', deadline: '', lod: 'Medium' });

  const handleSubmit = (e) => {
    /* ПОЧЕМУ preventDefault? Чтобы остановить стандартную перезагрузку страницы браузером 
       и обработать данные силами React (принцип SPA). */
    e.preventDefault();
    if (!task.title.trim() || !task.deadline) return;

    // ПОЧЕМУ btoa? Имитируем генерацию Geometry_hash для "цифрового следа" изделия (стр. 30 ТЗ).
    const geoHash = btoa(task.title + Date.now()).slice(0, 12);
    onAdd({ ...task, geoHash });
    
    setTask({ title: '', priority: 'Medium', deadline: '', lod: 'Medium' });
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Название объекта (напр. Турбина ВД)..."
        value={task.title}
        /* ПОЧЕМУ onChange? Это паттерн "управляемый компонент". Состояние React 
           является единственным источником истины для того, что видит пользователь. */
        onChange={(e) => setTask({...task, title: e.target.value})}
      />
      <select value={task.priority} onChange={(e) => setTask({...task, priority: e.target.value})}>
        <option value="Low">Низкий (Низкая маржа)</option>
        <option value="Medium">Средний (Стандарт)</option>
        <option value="High">Критический (Срочно)</option>
      </select>
      <input 
        type="date" 
        value={task.deadline} 
        onChange={(e) => setTask({...task, deadline: e.target.value})}
      />
      <button type="submit">Создать заявку</button>
    </form>
  );
}