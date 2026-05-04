import React, { useState } from 'react';

export default function AddTaskForm({ onAdd }) {
  // ПОЧЕМУ здесь? Состояние должно быть внутри функции компонента.
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium',
    deadline: '',
    lod: 'Medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.deadline) {
      alert("Заполните название и дату дедлайна!");
      return;
    }

    // Безопасный хэш для кириллицы (Задача 3.1 ТЗ)
    const geoHash = `GEO-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Date.now().toString().slice(-2)}`;

    onAdd({ ...formData, geoHash });
    
    // Сброс формы
    setFormData({ title: '', priority: 'Medium', deadline: '', lod: 'Medium' });
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Наименование изделия..."
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      <select 
        value={formData.lod} 
        onChange={(e) => setFormData({...formData, lod: e.target.value})}
      >
        <option value="Low">Low LOD</option>
        <option value="Medium">Medium LOD</option>
        <option value="High">High LOD</option>
      </select>
      <input 
        type="date" 
        value={formData.deadline}
        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
      />
      <button type="submit">Добавить в реестр</button>
    </form>
  );
}