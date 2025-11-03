import { getGoods, setGoods } from './storage.js';
import { updateGoods } from './ui.js';
import { goodsIndex } from './constants.js';

/**
 * Уменьшает количество выбранного товара на складе и
 * увеличивает количество в корзине.
 *
 * @param {string|number} id — Идентификатор товара.
 * @returns {void}
 */
export function addToCart(id) {
    let goods = getGoods();
    for (let g of goods) {
        if (g[goodsIndex.Id] === id && g[goodsIndex.Count] > 0) {
            g[goodsIndex.Count]--;
            g[goodsIndex.InCartCount]++;
        }
    }
    setGoods(goods);
    updateGoods();
}

/**
 * Полностью убирает товар из корзины, возвращая
 * его количество обратно на склад.
 *
 * @param {string|number} id — Идентификатор товара.
 * @returns {void}
 */
export function removeFromCart(id) {
    let goods = getGoods();
    for (let g of goods) {
        if (g[goodsIndex.Id] === id) {
            g[goodsIndex.Count] += g[goodsIndex.InCartCount];
            g[goodsIndex.InCartCount] = 0;
        }
    }
    setGoods(goods);
    updateGoods();
}
