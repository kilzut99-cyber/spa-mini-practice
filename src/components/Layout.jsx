import React from 'react';

export default function Layout({ title, children, isOnline }) {
  return (
    <div className="layout-container">
      {/* Условный рендеринг плашки отсутствия сети (Offline-First логика) */}
      {!isOnline && (
        <div className="offline-alert" style={{ background: '#e53e3e', color: 'white', textLight: 'center', padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>
          ⚠️ АВТОНОМНЫЙ РЕЖИМ: ВЫЧИСЛЕНИЯ НАПРАВЛЯЮТСЯ В ЛОКАЛЬНУЮ БД БРАУЗЕРА
        </div>
      )}
      
      <header className="app-header">
        <div className="header-content">
          <h1>{title}</h1>
          <div className={`net-status ${isOnline ? 'on' : 'off'}`} style={{ color: isOnline ? '#4caf50' : '#e53e3e', fontWeight: 'bold' }}>
            {isOnline ? "● СВЯЗЬ С СЕРВЕРОМ CAE УСТАНОВЛЕНА" : "○ СЕТЬ ОТКЛЮЧЕНА"}
          </div>
        </div>
      </header>

      <div className="main-content">
        {children} {/* Внедрение дочерних компонентов */}
      </div>

      <footer className="app-footer">
        <p>© 2026 Консалтинговый центр — Департамент сквозного проектирования и виртуальных испытаний</p>
      </footer>
    </div>
  );
}