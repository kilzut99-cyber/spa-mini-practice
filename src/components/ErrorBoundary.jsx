// Новый Класс-Предохранитель UI
import React from 'react';

/**
 * Классовый компонент-предохранитель для реализации паттерна глобальной отказоустойчивости веб-приложений.
 * Устраняет замечание - "Отсутствие ErrorBoundary".
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Инициализация дефолтного состояния: по умолчанию ошибок в дереве рендеринга нет
    this.state = { hasError: false };
  }

  // Статический метод жизненного цикла: автоматически перехватывает сбой и мутирует стейт для вывода запасного UI
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Метод логирования перехваченных исключений и трассировки стека ошибок дочерних элементов
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary поймал критическую ошибку:", error, errorInfo);
  }

  render() {
    // Если в дочерних узлах произошел крах (например, сбой Recharts), выводится изолированное резервное окно
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback" style={{ padding: '20px', background: '#fff5f5', border: '1px solid #e53e3e', borderRadius: '4px', margin: '20px' }}>
          <h3 style={{ color: '#c53030' }}>⚠️ Системный сбой интерфейса</h3>
          <p>Произошла непредвиденная ошибка при рендеринге инженерных данных. Пожалуйста, перезагрузите страницу.</p>
        </div>
      );
    }
    // Если ошибок нет, приложение продолжает штатный декларативный рендеринг дочерних элементов
    return this.props.children;
  }
}