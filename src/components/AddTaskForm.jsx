import React, { useState } from 'react';

/**
 * Презентационный контролируемый компонент формы регистрации новых расчетных заявок.
 * Обеспечивает первичную валидацию пользовательского ввода на стороне клиента.
 * 
 * @param {Object} props - Входные свойства компонента
 * @param {Function} props.onAdd - Колбэк-функция передачи валидных данных в родительский оркестратор
 */
export default function AddTaskForm({ onAdd }) {
  // Единый объект состояния полей формы для обеспечения атомарности и предотвращения избыточных ререндеров
  const [formData, setFormData] = useState({ 
    title: '', 
    category: 'Механика', 
    lod: 'Medium', 
    deadline: '' 
  });

  // Локальное реактивное состояние для вывода ошибок интерфейса (Обеспечение паттерна Good UX)
  const [error, setError] = useState('');

  /**
   * Перехватчик и обработчик события отправки формы (Submit)
   */
  const handleSubmit = (e) => {
    // Блокировка деструктивной дефолтной перезагрузки страницы браузером
    e.preventDefault(); 

    // Комплексная валидация полей ввода перед подъемом состояния (Lifting State Up)
    if (!formData.title.trim() || !formData.deadline) {
      setError("Заполните наименование объекта машиностроения и нормативную дату дедлайна!");
      return;
    }

    // Сброс состояния ошибки при успешном прохождении валидационного фильтра
    setError(''); 

    // Передача верифицированных данных на верхний уровень иерархии (в компонент App.js)
    onAdd(formData); 

    // Возврат полей формы к исходным спецификациям (сброс состояния)
    setFormData({ 
      title: '', 
      category: 'Механика', 
      lod: 'Medium', 
      deadline: '' 
    });
  };

  return (
    <form className="engineering-form" onSubmit={handleSubmit}>
      <h3>Регистрация новой задачи виртуальных испытаний</h3>
      <div className="form-row">
        
        {/* Текстовый инпут ввода наименования объекта машиностроения */}
        <input
          type="text"
          placeholder="Наименование детали (напр., Турбина Т-100)..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Селектор выбора физической дисциплины CAE-анализа */}
        <select 
          value={formData.category} 
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="Механика">Механика (Прочность МПа)</option>
          <option value="CFD">CFD (Аэродинамика м/с)</option>
          <option value="Тепло">Теплофизика (°C)</option>
        </select>

        {/* Селектор плотности конечно-элементной сетки FEM */}
        <select 
          value={formData.lod} 
          onChange={(e) => setFormData({ ...formData, lod: e.target.value })}
        >
          <option value="Low">Low LOD (Грубая сетка)</option>
          <option value="Medium">Medium LOD (Стандартная расчетная сетка)</option>
          <option value="High">High LOD (Высокоточный расчет версий)</option>
        </select>

        {/* Поле ввода временных рамок контроля (Дедлайн) */}
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        />

        <button type="submit">Запустить симуляцию изделия</button>
      </div>

      {/* Рендеринг сообщения об ошибке строго под элементами управления в соответствии с правилами UI */}
      {error && (
        <p className="error-msg" style={{ color: '#e53e3e', fontSize: '0.85rem', fontWeight: 'bold', margin: '10px 0 0 0' }}>
          ⚠️ Ошибка: {error}
        </p>
      )}
    </form>
  );
}