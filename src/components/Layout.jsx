import React from 'react';

export default function Layout({ title, children, isOnline }) {
  return (
    <div className="layout-container">
      {/* ПОЧЕМУ isOnline? Реализация требования PRO по работе с BOM API. 
          Инженер должен видеть статус сети, так как данные пишутся в LocalStorage. */}
      {!isOnline && (
        <div className="offline-alert">⚠️ Режим Offline. Изменения сохранятся локально.</div>
      )}
      <header className="app-header">
        <h1>{title}</h1>
      </header>
      {/* ПОЧЕМУ children? Это механизм композиции. Layout задает "скелет" 1С-интерфейса, 
          а контент (формы, списки) вкладывается внутрь, не дублируя код шапки. */}
      <main className="layout-main">{children}</main>
    </div>
  );
}