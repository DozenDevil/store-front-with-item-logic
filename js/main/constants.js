/**
 * Индексы полей внутри массива товара.
 * Используются для доступа к значениям по фиксированным позициям.
 * 
 * @readonly
 * @enum {number}
 */
export const goodsIndex = Object.freeze({
    Id: 0,
    Name: 1,
    Price: 2,
    Count: 3,
    InCartCount: 4,
    Discount: 5,
    InCartCost: 6,
});

/**
 * Настройки для библиотеки List.js.
 * Определяют, какие свойства элементов будут участвовать
 * в сортировке и поиске.
 * 
 * @type {Object}
 * @property {string[]} valueNames — список имён классов элементов для отслеживания.
 */
export const listOptions = {
    valueNames: ['name', 'price']
};

/**
 * Флаг режима отладки.
 * При включении активирует тестовые функции и вывод отладочной информации.
 * По умолчанию выключен для продакшн-среды.
 * 
 * @type {boolean}
 */
export const DEBUG_MODE = false;
