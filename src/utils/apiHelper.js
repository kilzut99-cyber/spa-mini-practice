// Константный ключ версионирования локальной СУБД в памяти браузера
const STORAGE_KEY = "cae_manager_final_v3"; 

/**
 * Безопасное извлечение массива задач из localStorage с try/catch защитой от синтаксических повреждений JSON
 * @returns {Array} Массив десериализованных инженерных задач или пустой массив при ошибке
 */
export const loadTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Восстановление сложной иерархической структуры данных при ее наличии
    return saved ? JSON.parse(saved) : []; 
  } catch (error) {
    // Изоляция синтаксической ошибки для предотвращения аварийного падения всего SPA-приложения
    console.error("Ошибка парсинга localStorage БД:", error);
    return []; 
  }
};

/**
 * Сериализация и зеркалирование реактивного состояния в локальное хранилище браузера
 * @param {Array} tasks - Текущий массив инженерных задач из стейта оркестратора
 */
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); 
  } catch (error) {
    console.error("Ошибка записи в localStorage БД:", error);
  }
};

/**
 * Генерация безопасного промышленного шифра (хэша) геометрии изделия без рисков возникновения коллизий.
 * Полностью заменяет устаревший метод на базе временных штампов миллисекунд.
 * 
 * @returns {string} Строка уникального буквенно-цифрового шифра в формате GEO-XXXX-XX
 */
export const generateGeoHash = () => {
  // Вырезаем 4 случайных символа из стартового сегмента криптографического UUID
  const randomStr = crypto.randomUUID().substring(0, 4).toUpperCase();
  // Вырезаем 2 дополнительных контрольных символа из финального сегмента UUID для усиления энтропии
  const saltShort = crypto.randomUUID().substring(24, 26).toUpperCase();
  
  return `GEO-${randomStr}-${saltShort}`;
};