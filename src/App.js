import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AddRequestForm from './components/AddRequestForm';
import FilterPanel from './components/FilterPanel';
import RequestList from './components/RequestList';
import './App.css';

// ПОЧЕМУ вне компонента? Константы не должны пересоздаваться в памяти при каждом рендере.
const INITIAL_DATA = [
  { id: 1, title: "Турбина ВД", physics: "CFD", date: "2026-05-01" },
  { id: 2, title: "Опора вала", physics: "Механика", date: "2026-05-02" }
];

const STORAGE_KEY = "cae-requests-app";

function App() {
  // ПОЧЕМУ функция-инициализатор в useState? 
  // Она выполняется один раз при старте, извлекая данные из LocalStorage.
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch {
      return INITIAL_DATA;
    }
  });

  const [filter, setFilter] = useState("Все");
  const [role, setRole] = useState("Consultant");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // ПОЧЕМУ useEffect для LS? Синхронизируем состояние React с памятью браузера при любом изменении массива.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  // ПОЧЕМУ useEffect для сети? Отслеживаем BOM-события (Online/Offline).
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => { // CLEANUP: Удаляем слушателей при закрытии приложения.
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handleAdd = (newReq) => {
    // ПОЧЕМУ функциональное обновление? Гарантирует актуальность prev при асинхронных кликах.
    setRequests(prev => [...prev, { ...newReq, id: Date.now() }]);
  };

  const handleDelete = (id) => {
    // ПОЧЕМУ .filter()? Мы создаем НОВЫЙ массив, соблюдая табу на мутацию стейта.
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  // ПОЧЕМУ логика фильтрации здесь? App.js — владелец данных. 
  // Бизнес-логика живет рядом с данными.
  const filteredRequests = filter === "Все" 
    ? requests 
    : requests.filter(r => r.physics === filter);

  return (
    <Layout title="spa-mini-practice: Менеджер КЦ" isOnline={isOnline}>
      <div className="role-toolbar">
         Роль: <button onClick={() => setRole(role === 'Consultant' ? 'Engineer' : 'Consultant')}>{role}</button>
      </div>
      <AddRequestForm onAdd={handleAdd} />
      <FilterPanel activeFilter={filter} onFilterChange={setFilter} />
      <RequestList items={filteredRequests} role={role} onDelete={handleDelete} />
    </Layout>
  );
}

export default App; 