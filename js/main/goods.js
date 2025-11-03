import { getGoods, setGoods } from './storage.js';
import { updateGoods } from './ui.js';
import { goodsIndex } from './constants.js';

/**
 * Добавляет новый товар в список.
 *
 * @param {string} name — Название товара.
 * @param {number} price — Цена товара.
 * @param {number} count — Количество товара на складе.
 * @returns {void}
 */
export function addGood(name, price, count) {
    let goods = getGoods();
    goods.push(['good_' + goods.length, name, price, count, 0, 0, 0]);
    setGoods(goods);
    updateGoods();
}

/**
 * Удаляет товар из списка по его идентификатору.
 *
 * @param {string} id — Идентификатор товара.
 * @returns {void}
 */
export function removeGood(id) {
    let goods = getGoods().filter(g => g[goodsIndex.Id] !== id);
    setGoods(goods);
    updateGoods();
}

/**
 * Заполняет хранилище тестовыми товарами для отладки.
 *
 * @example
 * testGoods(); // создаёт несколько тестовых товаров
 * @returns {void}
 */
export function testGoods() {
    const testData = [
        ["good_0", "Огурец", 85, 50, 0, 0, 0],
        ["good_1", "Телевизор", 41300, 3, 0, 0, 0],
        ["good_2", "Куртка", 2999, 12, 0, 0, 0],
        ["good_3", "Outer Wilds - Archaeologist Edition", 1700, 999, 0, 0, 0],
    ];

    setGoods(testData);
    updateGoods();
}
