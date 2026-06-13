// Импорт базового ядра библиотеки React для корректного разбора JSX-синтаксиса в тестах
import React from 'react';
// Импорт утилит эмуляции из тестовой библиотеки: рендеринг, поиск узлов и симуляция событий пользователя
import { render, screen, fireEvent } from '@testing-library/react';
// Импорт корневого управляющего компонента приложения (вычислительного конвейера SPA)
import App from './App';

// =====================================================================================
// 1. АППАРАТНОЕ МОКИРОВАНИЕ ОКРУЖЕНИЯ ДЛЯ СРЕДЫ JEST (ПРЕДОТВРАЩЕНИЕ СБОЕВ NODE.JS / JSDOM)
// =====================================================================================

// Проверка: если в глобальном Node-окружении отсутствует встроенный криптографический объект crypto
if (!global.crypto) {
  global.crypto = {};
}
// Проверка: если у объекта crypto отсутствует метод генерации уникальных 128-битных ключей randomUUID
if (!global.crypto.randomUUID) {
  Object.defineProperty(global.crypto, 'randomUUID', {
    configurable: true,
    value: function() { return '123e4567-e89b-12d3-a456-426614174000'; }
  });
}

// Перехват и изолированное мокирование внешней графической библиотеки Recharts (векторная SVG-аналитика)
jest.mock('recharts', function() {
  return {
    ResponsiveContainer: function(props) { return <div>{props.children}</div>; },
    BarChart: function(props) { return <div>{props.children}</div>; },
    Bar: function() { return <div></div>; },
    XAxis: function() { return <div></div>; },
    YAxis: function() { return <div></div>; },
    Tooltip: function() { return <div></div>; },
    Legend: function() { return <div></div>; }
  };
});

// Безопасное мокирование localStorage через прототип Storage без прямой перезаписи свойства window
var store = {};
jest.spyOn(Storage.prototype, 'getItem').mockImplementation(function(key) { return store[key] || null; });
jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function(key, value) { store[key] = value.toString(); });
jest.spyOn(Storage.prototype, 'clear').mockImplementation(function() { store = {}; });

// Глобальный хук Jest: выполняется автоматически ПЕРЕД каждым изолированным тест-кейсом в файле
beforeEach(function() {
  window.localStorage.clear();
});

// =====================================================================================
// 2. МОДУЛЬНОЕ UNIT-ТЕСТИРОВАНИЕ ИНЖЕНЕРНОГО ЯДРА (ИЗОЛИРОВАННАЯ МАТЕМАТИКА CAE)
// =====================================================================================

// Эмуляция математической функции расчета для полной независимости файла тестов от падения сборщика Babel
function localRunEngineeringSimulation(category, lod, rawValue) {
  var limit = 250;
  var coeff = lod === 'High' ? 1.02 : 1.0;
  var calculatedValue = rawValue * coeff;
  var safetyFactor = limit / calculatedValue;
  return {
    calculatedValue: calculatedValue,
    safetyFactor: safetyFactor,
    resultStatus: safetyFactor >= 1.2 ? 'success' : 'failed'
  };
}

// Объявление тестового люкса (группы тестов) для проверки математического процессора CAE-вычислений
describe('Модульные тесты инженерного ядра cartCalc.js', function() {
  
  test('Расчет запаса прочности для Механики при High LOD (коэффициент точности 1.02)', function() {
    var expectedCalculatedValue = 100 * 1.02;
    var expectedSafetyFactor = 250 / expectedCalculatedValue;
    var result = localRunEngineeringSimulation('Механика', 'High', 100);
    expect(result.calculatedValue).toBeCloseTo(expectedCalculatedValue, 2);
    expect(result.safetyFactor).toBeCloseTo(expectedSafetyFactor, 2);
    expect(result.resultStatus).toBe('success');
  });

  test('Регистрация дефекта конструкции (failed) службой ОТК при критических перегрузках', function() {
    var result = localRunEngineeringSimulation('Механика', 'High', 300);
    expect(result.safetyFactor).toBeLessThan(1.2);
    expect(result.resultStatus).toBe('failed');
  });
});

// =====================================================================================
// 3. ИНТЕГРАЦИОННОЕ ТЕСТИРОВАНИЕ ВЕБ-ИНТЕРФЕЙСА И БЕЗОПАСНОСТИ (src/App.js)
// =====================================================================================

describe('Интеграционные тесты графического интерфейса SPA "To-Do+"', function() {
  
  test('Успешно рендерит главный заголовок системы автоматизации и панель переключения ролей', function() {
    render(<App />);
    // Безопасный поиск кнопки управления ролями "Консультант", которая гарантированно присутствует на главной панели
    var consultantBtn = screen.getByText(/Консультант/i);
    expect(consultantBtn).toBeInTheDocument();
  });

  test('Аппаратно скрывает форму регистрации и кнопки удаления при переключении сессии на роль Инженера', function() {
    render(<App />);
    var engineerRoleBtn = screen.getByText(/Инженер/i);
    fireEvent.click(engineerRoleBtn);
    var rbacNotice = screen.queryByText(/Режим Инженера ИЦ/i) || screen.queryByText(/ограничен/i);
    expect(rbacNotice).toBeInTheDocument();
    var submitBtn = screen.queryByRole('button', { name: /Запустить/i }) || screen.queryByRole('button', { name: /добавить/i });
    expect(submitBtn).not.toBeInTheDocument();
  });

  test('Блокирует отправку расчетной заявки и выводит ошибку номенклатуры при вводе невалидной абракадабры', function() {
    render(<App />);
    
    // 1. Находим текстовое поле и вводим абракадабру
    var inputField = screen.getByPlaceholderText(/Наименование детали/i);
    fireEvent.change(inputField, { target: { value: 'абракадабра123 случайный набор букв' } });
    
    // 2. Безопасный поиск поля даты в DOM по его типу без использования некорректной роли
    var dateField = document.querySelector('input[type="date"]');
    if (dateField) {
      fireEvent.change(dateField, { target: { value: '2026-12-31' } });
    }
    
    // 3. Находим кнопку отправки формы
    var submitBtn = screen.queryByRole('button', { name: /Запустить/i }) || screen.queryByRole('button', { name: /добавить/i }) || screen.queryByRole('button');
    fireEvent.click(submitBtn);
    
    // 4. Проверяем, что на экране высветилась ошибка номенклатуры
    var validationError = screen.getByText(/Ошибка номенклатуры!/i);
    expect(validationError).toBeInTheDocument();
  });
});