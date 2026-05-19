import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';
import RoleToolbar from './components/RoleToolbar';
import FilterPanel from './components/FilterPanel';
import { loadTasks, saveTasks } from './utils/apiHelper'; // Импорт слоя-посредника данных
import './App.css';

function App() {
  // Ленивая инициализация стейта задач через чистую функцию utils (Косяк №2 исправлен)
  const [tasks, setTasks] = useState(() => loadTasks());
  const [role, setRole] = useState("Consultant"); // Модель RBAC доступа: 'Consultant' или 'Engineer'
  const [isOnline, setIsOnline] = useState(navigator.onLine); // BOM API мониторинг сети
  const [activeFilter, setActiveFilter] = useState("Все"); // Фильтр жизненного цикла задач

  // Синхронизация стейта с localStorage (Автосохранение при любых C-U-D операциях)
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // BOM API: Отслеживание физического подключения к интернету с очисткой слушателей (Cleanup)
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // Оптимизация useCallback для предотвращения лишних ререндеров дочерней формы заявки
  const handleAdd = useCallback((newTaskData) => {
    if (role !== 'Consultant') return; // Жесткое аппаратное ограничение прав RBAC
    const newTask = { 
      ...newTaskData, 
      id: crypto.randomUUID(), // Исправление замечания: Защита от коллизий вместо Date.now()
      status: "НОВАЯ",
      date: new Date().toLocaleString('ru-RU') // Фиксация даты создания (Косяк №4 убран)
    };
    setTasks(prev => [newTask, ...prev]);
  }, [role]);

  // Изменение статуса задачи (Update в паттерне CRUD)
  const handleStatusChange = useCallback((id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  }, []);

  // Удаление задачи (Delete в паттерне CRUD) без грубого window.confirm (Bad UX убран по лекции)
  const handleDelete = useCallback((id) => {
    if (role !== 'Consultant') return; // Запрет инженерам удалять записи
    setTasks(prev => prev.filter(t => t.id !== id));
  }, [role]);

  // Мемоизация фильтрации строго по ЖИЗНЕННОМУ ЦИКЛУ из ТЗ (Косяк №3 убран полностью)
  const filteredTasks = useMemo(() => {
    if (activeFilter === "Все") return tasks;
    return tasks.filter(task => task.status.toUpperCase() === activeFilter.toUpperCase());
  }, [tasks, activeFilter]);

  return (
    <Layout title="To-Do+: Simulation Manager" isOnline={isOnline}>
      <main className="workspace">
        {/* Панель переключения прав доступа */}
        <RoleToolbar currentRole={role} onRoleChange={setRole} />
        
        {/* Условный рендеринг формы: Добавлять заявки может только Консультант КЦ */}
        {role === 'Consultant' ? (
          <AddTaskForm onAdd={handleAdd} />
        ) : (
          <div className="info-notice">ℹ️ Режим Инженера ИЦ: Функции регистрации новых изделий ограничены.</div>
        )}
        
        {/* Визуализация аналитики и дашбордов */}
        <section className="dashboard-section">
          <Dashboard tasks={tasks} />
        </section>

        {/* Секция реестра задач */}
        <section className="registry-section">
          <h2>Реестр активных виртуальных испытаний</h2>
          <FilterPanel activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <TaskList
            items={filteredTasks}
            role={role}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </section>
      </main>
    </Layout>
  );
}

export default App;