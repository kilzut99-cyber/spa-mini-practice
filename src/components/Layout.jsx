import React from 'react';

// ПОЧЕМУ экспортируем через export default? Это делает компонент доступным для импорта в App.js.
export default function Layout({ title, children, isOnline }) {
  return (
    <div className="layout-container">
      {/* ПОЧЕМУ navigator.onLine? Реализация требования PRO по работе с BOM. 
          Пользователь должен знать статус сети. */}
      {!isOnline && <div className="offline-alert">⚠️ Режим Offline. Данные пишутся в LocalStorage.</div>}
      
      <header className="app-header">
        <h1>{title}</h1>
      </header>

      {/* ПОЧЕМУ children? Это механизм композиции React. 
          Layout задаёт каркас (шапку, футер), а контент вкладывается снаружи. 
          Это избавляет от копипаста структуры на каждой странице (ТЗ, стр. 5). */}
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}