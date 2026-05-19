import React, { useState } from 'react';

export default function AddTaskForm({ onAdd }) {
  // Единый объект состояния полей формы для устранения хаоса
  const [formData, setFormData] = useState({ title: '', category: 'Механика', lod: 'Medium', deadline: '' });
  const [error, setError] = useState(''); // Стейт вывода ошибки под полем ввода (Good UX взамен alert)

  const handleSubmit = (e) => {
    e.preventDefault(); // Блокировка дефолтной перезагрузки страницы браузером
    
    // Валидация полей ввода перед подъемом состояния (Lifting State Up)
    if (!formData.title.trim() || !formData.deadline) {
      setError("Заполните наименование объекта машиностроения и дату дедлайна!");
      return;
    }

    setError(''); // Сброс ошибки
    onAdd(formData); // Передача чистых данных наверх Начальнику (App.js)
    
    // Сброс формы к заводским настройкам
    setFormData({ title: '', category: 'Механика', lod: 'Medium', deadline: '' });
  };

  return (
    <form className="engineering-form" onSubmit={handleSubmit}>
      <h3>Регистрация новой задачи виртуальных испытаний</h3>
      <div className="form-row">
        <input
          type="text"
          placeholder="Наименование детали (напр., Турбина Т-100)..."
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
          <option value="Механика">Механика (Прочность МПа)</option>
          <option value="CFD">CFD (Аэродинамика м/с)</option>
          <option value="Тепло">Теплофизика (°C)</option>
        </select>
        <select value={formData.lod} onChange={(e) => setFormData({...formData, lod: e.target.value})}>
          <option value="Low">Low LOD (Грубая сетка)</option>
          <option value="Medium">Medium LOD (Стандартная конечно-элементная сетка)</option>
          <option value="High">High LOD (Высокоточный расчет версий)</option>
        </select>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
        />
        <button type="submit">Запустить симуляцию изделия</button>
      </div>
      {/* Рендеринг текста ошибки строго под инпутами по правилам UI */}
      {error && <p className="error-msg" style={{ color: '#e53e3e', fontSize: '0.85rem', fontWeight: 'bold', margin: '10px 0 0 0' }}>⚠️ Ошибка: {error}</p>}
    </form>
  );
}