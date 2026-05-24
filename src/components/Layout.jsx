import React from 'react';

/**
 * Компонент высшего порядка (каркас интерфейса SPA), инкапсулирующий базовую разметку,
 * подвал, шапку и плашку мониторинга сетевого статуса BOM API.
 */
export default function Layout({ title, children, isOnline }) {
  return (
    <div className="layout-container">
      
      {/* Условный рендеринг системной плашки автономного режима (Логика Offline-First) */}
      {!isOnline && (
        <div className="offline-alert" style={{ background: '#e53e3e', color: 'white', padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>
          ⚠️ АВТОНОМНЫЙ РЕЖИМ: ВЫЧИСЛЕНИЯ НАПРАВЛЯЮТСЯ В ЛОКАЛЬНУЮ БД БРАУЗЕРА
        </div>
      )}

      {/* Верхний колонтитул приложения (Шапка) */}
      <header className="app-header">
        <div className="header-content">
          <h1>{title}</h1>
          
          {/* Индикатор связи с вычислительным кластером CAE */}
          <div 
            className={`net-status ${isOnline ? 'on' : 'off'}`} 
            style={{ color: isOnline ? '#4caf50' : '#e53e3e', fontWeight: 'bold' }}
          >
            {isOnline ? "● СВЯЗЬ С СЕРВЕРОМ CAE УСТАНОВЛЕНА" : "○ СЕТЬ ОТКЛЮЧЕНА"}
          </div>
        </div>
      </header>

      {/* Основное рабочее пространство (Монтирование дочерних узлов) */}
      <div className="main-content">
        {children} 
      </div>

      {/* Нижний колонтитул приложения (Подвал) */}
      <footer className="app-footer">
        <p>© 2026 Консалтинговый центр — Департамент проектирования и виртуальных испытаний</p>
      </footer>

    </div>
  );
}