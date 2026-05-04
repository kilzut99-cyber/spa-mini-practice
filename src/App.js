import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import FilterPanel from './components/FilterPanel';
import RoleToolbar from './components/RoleToolbar'; // ПОЧЕМУ вынесли? Чтобы App.js не был монолитом.
import './App.css';

const STORAGE_KEY = "cae-manager-v2";

function App() {
  const [tasks, setTasks] = useState(() => {
    /* ПОЧЕМУ try/catch? Чтобы приложение не "упало", если в LocalStorage 
       окажется поврежденный JSON (требование преподавателя). */
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [role, setRole] = useState("Consultant");
  const [filter, setFilter] = useState("Все");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // ПОЧЕМУ useEffect для сети? Отслеживаем состояние BOM-объекта navigator.
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    // ПОЧЕМУ cleanup? Чтобы не было утечек памяти при закрытии приложения.
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []); // Используем setIsOnline здесь!
    
  // ПОЧЕМУ useCallback? Оптимизация. Функции не пересоздаются в памяти при каждом 
  // рендере, что важно при передаче их в глубокие дочерние компоненты.
  const handleAdd = useCallback((newTask) => {
    setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
  }, []);

  const handleStatus = useCallback((id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  }, []);

  const handleDelete = (id) => {
    /* ПОЧЕМУ filter? Мы создаем НОВЫЙ массив. В React запрещено менять (мутировать) state напрямую. */
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => filter === "Все" || t.status === filter);

  return (
    <Layout title="CAE Manager: Digital Thread" isOnline={isOnline}>
      <RoleToolbar role={role} setRole={setRole} />
      {role === 'Consultant' && <AddTaskForm onAdd={handleAdd} />}
      <FilterPanel activeFilter={filter} onFilterChange={setFilter} />
      <TaskList 
        items={filteredTasks} 
        role={role} 
        onDelete={handleDelete} 
        onStatusChange={handleStatus} 
      />
    </Layout>
  );
}

export default App;