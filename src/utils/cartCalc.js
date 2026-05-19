/**
 * Вычисляет физические коэффициенты изделия на основе его характеристик
 * @param {string} category - Дисциплина CAE-анализа ('Механика', 'CFD', 'Тепло')
 * @param {string} lod - Уровень детализации сетки конечных элементов ('Low', 'Medium', 'High')
 * @param {number} rawValue - Базовое расчетное значение (нагрузка / температура / поток)
 * @returns {Object} Результаты расчетов и протокол статуса верификации
 */
export const runEngineeringSimulation = (category, lod, rawValue = 150) => {
  // Имитируем влияние детализации сетки (LOD) на погрешность вычислений (High LOD точнее)
  const meshMultiplier = lod === 'High' ? 1.02 : lod === 'Medium' ? 1.12 : 1.35;
  const calculatedValue = Number((rawValue * meshMultiplier).toFixed(2));
  
  let safetyFactor = 0; // Коэффициент запаса
  let limit = 0;        // Предельно допустимое значение для металла
  let label = '';       // Физическое наименование критерия
  
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
      safetyFactor = Number((limit / (calculatedValue || 1)).toFixed(2));
      label = 'Гидродинамическая стабильность';
      break;
    default:
      limit = 100;
      safetyFactor = 1.0;
      label = 'Общий запас';
  }

  // Критерий успешного прохождения теста Консалтингового Центра (нормативный запас >= 1.2)
  const isPassed = safetyFactor >= 1.2;

  return {
    calculatedValue,
    limit,
    safetyFactor,
    label,
    resultStatus: isPassed ? 'success' : 'failed' // 'success' = зеленая галочка, 'failed' = брак
  };
};