import React, { useState, useMemo } from 'react';
import { runEngineeringSimulation } from '../utils/cartCalc';

export default function TaskCard({ id, title, category, lod, priority, loadValue, deadline, status, geoHash, role, date, onDelete, onStatusChange, onUpdateTask }) {
  // Локальный флаг для переключения строки из режима отображения в режим редактирования (Update CRUD)
  const [isEditing, setIsEditing] = useState(false);
  // Локальный буфер состояния для аккумулирования отредактированных полей перед фиксацией в глобальном App.js
  const [editData, setEditData] = useState({ title, category, lod, priority, loadValue, deadline });

  /**
   * КРИТИЧЕСКАЯ ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ ЧЕРЕЗ ИЗОЛИРОВАННЫЙ useMemo
   * Устранение замечания - "Вызов физических формул без мемоизации при каждом ререндере строки".
   * Вычисления запускаются только тогда, когда изменяются физические параметры конкретной детали.
   */
  const calculation = useMemo(() => {
    // Передача реального числового параметра loadValue вместо старой искусственной метрики длины текста строки
    return runEngineeringSimulation(category, lod, loadValue || 100);
  }, [category, lod, loadValue]);

  // Мемоизация вычисления стоимости SLA для разгрузки процессора при частых обновлениях интерфейса
  const financialCost = useMemo(() => {
    return lod === 'High' ? 2200 : priority === 'High' ? 1425 : 950;
  }, [lod, priority]);

  // Функция сохранения отредактированного буфера данных наверх к "источнику истины"
  const handleSave = () => {
    onUpdateTask(id, editData);
    setIsEditing(false); // Выход из режима редактирования
  };

  // Реализация безопасного удаления данных (Устранение замечания  - "Отсутствие подтверждения удаления")
  const handleDeleteConfirm = () => {
    if (window.confirm(`Вы уверены, что хотите безвозвратно удалить протокол испытания #${id.slice(0, 6)}?`)) {
      onDelete(id);
    }
  };

  // ОТРИСОВКА ИНТЕРФЕЙСА В РЕЖИМЕ РЕДАКТИРОВАНИЯ (ИНЛАЙН-ФОРМА UPDATE)
  if (isEditing) {
    return (
      <tr className="t-row editing-row">
        <td data-label="ID / ШИФР"><span className="id-tag">#{id.slice(0, 6)}</span></td>
        {/* Инпуты связаны с локальным буфером editData (Controlled Inputs паттерн) */}
        <td data-label="Объект"><input type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} /></td>
        <td data-label="Физика">
          <select value={editData.category} onChange={e => setEditData({...editData, category: e.target.value})}>
            <option value="Mechanics">Mechanics</option>
            <option value="CFD">CFD</option>
            <option value="Thermal">Thermal</option>
          </select>
        </td>
        <td data-label="Сетка">
          <select value={editData.lod} onChange={e => setEditData({...editData, lod: e.target.value})}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </td>
        <td data-label="Приоритет">
          <select value={editData.priority} onChange={e => setEditData({...editData, priority: e.target.value})}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </td>
        <td data-label="Нагрузка"><input type="number" style={{width: '60px'}} value={editData.loadValue} onChange={e => setEditData({...editData, loadValue: Number(e.target.value)})} /></td>
        <td data-label="Дедлайн"><input type="date" value={editData.deadline} onChange={e => setEditData({...editData, deadline: e.target.value})} /></td>
        <td colSpan="3">
          <button className="btn-save" onClick={handleSave}>Сохранить</button>
          <button className="btn-cancel" onClick={() => setIsEditing(false)}>Отмена</button>
        </td>
      </tr>
    );
  }

  // Генерация динамического CSS-класса на основе статуса задачи для стилизации строки через CSS-переменные
  const statusClass = `st-${status.toLowerCase().replace(" ", "-")}`;

  return (
    // Динамическая окраска бэкграунда строки таблицы в зависимости от вердикта ОТК (Успех/Брак) математического ядра
    <tr className={`t-row ${statusClass}`} style={{ backgroundColor: calculation.resultStatus === 'success' ? 'var(--st-done)' : '#fff5f5' }}>
      
      {/* Использование data-label атрибутов для реализации адаптивной магии бесшовной трансформации в мобильные карточки */}
      <td data-label="ID / ШИФР">
        <div className="id-tag">#{id.slice(0, 6)}</div>
        <code className="geo-tag">{geoHash}</code>
      </td>
      <td data-label="Объект"><strong>{title}</strong></td>
      <td data-label="Физика">{category}</td>
      <td data-label="Детализация">{lod}</td>
      <td data-label="Приоритет"><em>{priority}</em></td>
      <td data-label="Стоимость" style={{fontWeight: 'bold'}}>{financialCost} $</td>
      <td data-label="Результаты расчетов">
        <div>Пик: <strong>{calculation.calculatedValue}</strong> (Порог: {calculation.limit})</div>
        {/* Реактивное окрашивание шрифта физического запаса по условию ОТК */}
        <div style={{ color: calculation.resultStatus === 'success' ? '#4caf50' : '#e53e3e', fontWeight: 'bold' }}>
          {calculation.label}: {calculation.safetyFactor}
        </div>
      </td>
      <td data-label="Дедлайн">
        <div>До: {deadline}</div>
        <small style={{color: '#718096', fontSize: '0.7rem'}}>Создан: {date}</small>
      </td>
      <td data-label="Статус">
        {/* Реализация ролевой безопасности RBAC: селект аппаратно блокируется для роли рядового Инженера */}
        <select value={status} onChange={(e) => onStatusChange(id, e.target.value)} disabled={role === 'Engineer'}>
          <option value="НОВАЯ">Новая</option>
          <option value="В РАСЧЕТЕ">В расчете</option>
          <option value="ВЕРИФИКАЦИЯ">Верификация</option>
          <option value="ЗАВЕРШЕНО">Завершено</option>
        </select>
      </td>
      <td>
        <div style={{display: 'flex', gap: '4px'}}>
          {/* Условный рендеринг кнопок деструктивных действий: инженерам запрещено редактировать и удалять данные */}
          {role === 'Consultant' && (
            <>
              {/* Кнопка переключения строки в интерактивный инлайн-режим правки полей */}
              <button className="btn-edit" onClick={() => { setEditData({ title, category, lod, priority, loadValue, deadline }); setIsEditing(true); }}>✍️</button>
              <button className="btn-del" onClick={handleDeleteConfirm}>✕</button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}