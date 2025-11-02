import { getGoods, setGoods } from './storage.js';
import { updateGoods } from './ui.js';
import { goodsIndex } from './constants.js';

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
