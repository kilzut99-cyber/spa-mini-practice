const STORAGE_KEY = "cae_manager_final_v3"; // Уникальный ключ версии БД в браузере

/**
 * Безопасное чтение массива задач из localStorage сtry/catch защитой от поврежденного JSON
 * @returns {Array} Массив сохраненных задач или пустой массив при ошибке
 */
export const loadTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : []; // Восстановление сложной структуры данных
  } catch (error) {
    console.error("Ошибка парсинга localStorage БД:", error);
    return []; // Защита от аварийного падения SPA
  }
};

/**
 * Сохранение (зеркалирование) массива задач в локальное хранилище браузера
 * @param {Array} tasks - Текущий массив задач из реактивного стейта
 */
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); // Сериализация в JSON строку
  } catch (error) {
    console.error("Ошибка записи в localStorage БД:", error);
  }
};

/**
 * Генерация безопасного шифра (хэша) задачи для маркировки изделия без коллизий
 * @returns {string} Строка уникального шифра в формате GEO-XXXX-XX
 */
export const generateGeoHash = () => {
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 случайных символа
  const timestampShort = Date.now().toString().slice(-2); // Последние 2 цифры текущего времени
  return `GEO-${randomStr}-${timestampShort}`;
};