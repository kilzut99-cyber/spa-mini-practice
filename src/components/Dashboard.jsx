// Декларативный импорт ядра React и хука кэширования useMemo
import React, { useMemo } from 'react';

// Импорт специализированных атомарных компонентов графической библиотеки Recharts для построения векторной SVG-аналитики
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts';

// Импорт чистой математической функции детерминированных CAE-расчетов из физического ядра приложения
import { runEngineeringSimulation } from '../utils/cartCalc';

// Экспорт функционального компонента Dashboard, принимающего иммутабельный проп tasks (массив инженерных задач)
export default function Dashboard({ tasks }) {

  /**
   * ИНИЦИАЛИЗАЦИЯ КЭШИРУЕМОГО УЗЛА useMemo НА ВЕРХНЕМ УРОВНЕ КОМПОНЕНТА
   * Вызов строго поднят выше любых условных операторов и инструкций return.
   * Это полностью удовлетворяет первому правилу React Hooks (Rules of Hooks) и устраняет ошибку react-hooks/rules-of-hooks.
   */
  const dashboardData = useMemo(() => {
    
    // Внутренний защитный барьер: если массив задач не инициализирован или пуст, возвращаются дефолтные пустые структуры
    if (!tasks || tasks.length === 0) {
      return { 
        pieData: [{ name: 'Нет данных', value: 0 }], 
        barData: [] 
      };
    }

    // 1. Сбор данных для круговой диаграммы: мапинг массива задач в плоский массив вердиктов ОТК ('success' или 'failed')
    const calculatedStatuses = tasks.map(t => runEngineeringSimulation(t.category, t.lod, t.loadValue || 100).resultStatus);
    
    // Иммутабельная фильтрация для подсчета общего количества успешно верифицированных изделий
    const passCount = calculatedStatuses.filter(s => s === 'success').length;
    
    // Иммутабельная фильтрация для подсчета общего количества забракованных конструкций
    const failCount = calculatedStatuses.filter(s => s === 'failed').length;

    // Формирование типизированного массива объектов, адаптированного под спецификацию компонента PieChart
    const pieData = [
      { name: 'Успешно (Passed)', value: passCount },
      { name: 'Критический брак (Failed)', value: failCount }
    ];

    // Определение константного перечня контролируемых физических дисциплин для построения гистограммы
    const disciplines = ['Mechanics', 'CFD', 'Thermal'];
    
    // 2. Сбор данных для столбчатого графика: декларативная агрегация и свертка массива задач за один проход метода map
    const barData = disciplines.map(disc => {
      // Изолированная фильтрация массива задач, принадлежащих к текущей рассматриваемой физической дисциплине
      const discTasks = tasks.filter(t => t.category === disc);
      
      // Фильтрация и подсчет количества дефектных изделий внутри выбранного физического направления
      const failedDiscTasks = discTasks.filter(t => runEngineeringSimulation(t.category, t.lod, t.loadValue || 100).resultStatus === 'failed');
      
      // Возврат агрегированного объекта с мета-данными для отрисовки столбцов гистограммы BarChart
      return {
        name: disc,
        'Всего расчетов': discTasks.length,
        'Выявлено дефектов': failedDiscTasks.length
      };
    });

    // Возврат монолитного кэшированного объекта аналитики. Пересчет выполнится строго при изменении зависимости [tasks]
    return { pieData, barData };
  }, [tasks]);

  /**
   * ОПЕРАТОР РАННЕГО ВЕТВЛЕНИЯ И ВОЗВРАТА (Early Return Pattern)
   * Перенесен строго ниже вызоваuseMemo. Если журнал пуст, компонент прерывает дальнейший рендеринг SVG-графиков,
   * предотвращая падение Recharts из-за передачи пустых массивов, и выводит презентационное сообщение.
   */
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-msg" style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>
        Журнал пуст. Запустите тесты для формирования графиков КЦ.
      </div>
    );
  }

  // Определение массива сигнальных цветов интерфейса: промышленный зеленый (успех) и сигнальный красный (брак)
  const CONFIG_COLORS = ['#4caf50', '#e53e3e'];

  // Возврат декларативной разметки JSX для рендеринга аналитического интерфейса
  return (
    <div className="dash-container">
      <div className="chart-item">
        <h4>Статус верификации изделий (ОТК)</h4>
        
        {/* Адаптивная обертка, динамически рассчитывающая ширину графиков под размеры сетки CSS Grid на ПЭВМ */}
        <ResponsiveContainer width="100%" height={160}>
          {/* Инициализация круговой диаграммы Recharts */}
          <PieChart>
            {/* Рендеринг секторов диаграммы с настройкой внутреннего и внешнего радиуса для эффекта Donut Chart */}
            <Pie data={dashboardData.pieData} innerRadius={45} outerRadius={60} dataKey="value" paddingAngle={5}>
              {/* Итеративный мапинг секторов для применения жестко заданных корпоративных цветов CONFIG_COLORS */}
              {dashboardData.pieData.map((entry, index) => <Cell key={index} fill={CONFIG_COLORS[index]} />)}
            </Pie>
            {/* Внедрение интерактивного всплывающего компонента подсказки при наведении курсора на сектор */}
            <Tooltip />
            {/* Отрисовка легенды графика в нижней части контейнера */}
            <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-item">
        <h4>Нагрузка по дисциплинам CAE / Дефекты</h4>
        <ResponsiveContainer width="100%" height={160}>
          {/* Инициализация столбчатого графика (гистограммы) на базе мемоизированного массива barData */}
          <BarChart data={dashboardData.barData}>
            {/* Рендеринг горизонтальных линий координатной сетки с паттерном штриховки (вертикальные линии отключены) */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            {/* Настройка абсцисс (ось X) с привязкой к названию дисциплины и оптимизацией размера шрифта */}
            <XAxis dataKey="name" fontSize={11} />
            {/* Настройка ординат (ось Y) для автоматического масштабирования числовых диапазонов расчетов */}
            <YAxis fontSize={11} />
            <Tooltip />
            <Legend iconSize={10} />
            {/* Генерация синего столбца для отображения общего объема запущенных виртуальных испытаний */}
            <Bar dataKey="Всего расчетов" fill="#0054a5" />
            {/* Генерация красного столбца для визуализации концентрации дефектов по физическим направлениям */}
            <Bar dataKey="Выявлено дефектов" fill="#e53e3e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}