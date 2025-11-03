/**
 * Возвращает список товаров из локального хранилища.
 *
 * @returns {Array} Массив товаров. Если данных нет, возвращает пустой массив.
 */
export function getGoods() {
    return JSON.parse(localStorage.getItem('goods')) || [];
}

/**
 * Сохраняет переданный массив товаров в локальное хранилище.
 *
 * @param {Array} goods — Массив товаров для сохранения.
 * @returns {void}
 */
export function setGoods(goods) {
    localStorage.setItem('goods', JSON.stringify(goods));
}

/**
 * Очищает список товаров в локальном хранилище.
 *
 * @returns {void}
 */
export function clearGoods() {
    setGoods([]);
}

/**
 * Инициализирует локальное хранилище, если оно пустое.
 * Создаёт ключ 'goods' с пустым массивом.
 *
 * @returns {void}
 */
export function initGoods() {
    if (!localStorage.getItem('goods')) {
        setGoods([]);
    }
}
