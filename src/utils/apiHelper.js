// Определение константных ключей для изоляции данных приложения в глобальном пространстве Web Storage
const STORAGE_KEY = "cae_manager_final_v4"; 
const ROLE_KEY = "cae_manager_user_role";

/**
 * Безопасное считывание массива инженерных задач из локального хранилища браузера
 * @returns {Array} Массив сохраненных объектов или пустой массив при структурном сбое
 */
export const loadTasks = () => {
  try {
    // Декларативное чтение строкового значения из localStorage по уникальному ключу-идентификатору
    const saved = localStorage.getItem(STORAGE_KEY);
    // Десериализация JSON-строки в динамический массив объектов; возврат пустого массива, если ключ отсутствует
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    // Перехват исключений (например, при аппаратном повреждении JSON-структуры или лимитах памяти)
    console.error("Ошибка парсинга localStorage БД:", error);
    // Паттерн Graceful Degradation: предотвращение аварийного падения SPA путем возврата дефолтных пустых данных
    return [];
  }
};

/**
 * Синхронная запись (зеркалирование) массива задач из реактивного стейта в localStorage
 * @param {Array} tasks - Текущее состояние базы данных из главного компонента App.js
 */
export const saveTasks = (tasks) => {
  try {
    // Сериализация реактивного массива объектов в плоскую строку JSON для персистентного хранения
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    // Логирование критической ошибки (например, при превышении браузерного квоты хранилища в 5Мб)
    console.error("Ошибка записи в localStorage БД:", error);
  }
};

/**
 * Построение персистентного считывания роли пользователя для предотвращения сброса UI при перезагрузке страницы
 * Устраняет замечание  - "Пресистирование роли" 
 */
export const loadUserRole = () => {
  try {
    const saved = localStorage.getItem(ROLE_KEY);
    // Если сессия пустая, по умолчанию выставляется роль администратора Консалтингового центра
    return saved || "Consultant";
  } catch (error) {
    return "Consultant";
  }
};

/**
 * Сохранение измененной роли в локальный кэш браузера при интерактивном переключении в RoleToolbar
 */
export const saveUserRole = (role) => {
  try {
    localStorage.setItem(ROLE_KEY, role);
  } catch (error) {
    console.error("Ошибка записи роли в localStorage:", error);
  }
};

/**
 * Реализация ранее "мертвого кода": утилита генерации технологического шифра изделия
 * Устранение замечания  - "Мёртвый код функции generateGeoHash"
 */
export const generateGeoHash = () => {
  // Генерация псевдослучайной строки из 4 символов в верхнем регистре на основе 36-ричной системы счисления
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  // Выделение временного отпечатка (микросекунд) для обеспечения дополнительной уникальности шифра
  const timestampShort = Date.now().toString().slice(-2);
  // Формирование итогового регламентированного буквенно-цифрового кода CAE-заявки
  return `GEO-${randomStr}-${timestampShort}`;
};