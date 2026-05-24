/**
 * Вычисляет физические коэффициенты изделия на основе его характеристик
 * @param {string} category - Дисциплина CAE-анализа ('Механика', 'CFD', 'Тепло')
 * @param {string} lod - Уровень детализации сетки конечных элементов ('Low', 'Medium', 'High')
 * @param {number} rawValue - Базовое расчетное значение (нагрузка / температура / поток)
 * @returns {Object} Результаты расчетов и протокол статуса верификации
 */
export const runEngineeringSimulation = (category, lod, rawValue = 150) => {
  // Оборачиваем входящее значение в модуль для корректного учета сил сжатия
  const validRawValue = Math.abs(rawValue);

  // Имитируем влияние детализации сетки (LOD) на погрешность вычислений
  // Для механики и тепла: консервативное завышение нагрузок при грубой сетке
  // Для CFD: при Low LOD скорость потока корректируется с учетом турбулентных пульсаций
  const meshMultiplier = lod === 'High' ? 1.02 : lod === 'Medium' ? 1.12 : 1.35;
  
  let calculatedValue = Number((validRawValue * meshMultiplier).toFixed(2));
  let safetyFactor = 0; 
  let limit = 0; 
  let label = ''; 

  switch (category) {
    case 'Механика':
      limit = 250; // Предел текучести конструкционной стали (МПа)
      safetyFactor = Number((limit / (calculatedValue || 1)).toFixed(2));
      label = 'Коэффициент запаса прочности';
      break;
    case 'Тепло':
      limit = 600; // Температурный порог термической деформации сплава (°C)
      safetyFactor = Number((limit / (calculatedValue || 1)).toFixed(2));
      label = 'Запас теплостойкости';
      break;
    case 'CFD':
      limit = 40; // Максимальная критическая скорость потока газа/жидкости (м/с)
      // КОРРЕКЦИЯ CFD-МОДЕЛИ: Высокий LOD дает наиболее точную оценку пиковой скорости
      const cfdMultiplier = lod === 'High' ? 1.00 : lod === 'Medium' ? 0.90 : 0.75;
      calculatedValue = Number((validRawValue * cfdMultiplier).toFixed(2));
      safetyFactor = Number((limit / (calculatedValue || 1)).toFixed(2));
      label = 'Гидродинамическая стабильность';
      break;
    default:
      limit = 100;
      safetyFactor = 1.0;
      label = 'Общий запас';
  }

  // Нормативный критерий Консалтингового Центра (запас >= 1.2)
  const isPassed = safetyFactor >= 1.2;

  return {
    calculatedValue,
    limit,
    safetyFactor,
    label,
    resultStatus: isPassed ? 'success' : 'failed'
  };
};