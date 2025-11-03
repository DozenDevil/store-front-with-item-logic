import { getGoods, setGoods } from './storage.js';
import { goodsIndex, listOptions } from './constants.js';

/**
 * Обновляет интерфейс списка товаров и корзины:
 *  - перерисовывает таблицы,
 *  - пересчитывает итоговую стоимость,
 *  - включает/выключает элементы управления,
 *  - при необходимости пересоздаёт объект List.js.
 *
 * @param {List|false} userList — Экземпляр List.js или false, если список ещё не создан.
 * @returns {void}
 */
export function updateGoods(userList = false) {
    const totalCostElement = document.querySelector('.total-cost');
    const tbodyList = document.querySelector('tbody.list');
    const tbodyCart = document.querySelector('tbody.cart');
    const table1 = document.getElementById('table1');
    const table2 = document.getElementById('table2');
    const searchField = document.getElementById('search-field');

    let totalCost = 0;

    // Очистка таблиц
    tbodyList.innerHTML = '';
    tbodyCart.innerHTML = '';

    const goods = getGoods();

    // Есть товары
    if (goods.length) {
        table1.hidden = false;
        table2.hidden = false;
        searchField.disabled = false;

        for (let i = 0; i < goods.length; i++) {
            const g = goods[i];

            // Рендер списка товаров
            tbodyList.insertAdjacentHTML('beforeend', `
                <tr class="align-middle">
                    <td>${i + 1}</td>
                    <td class="name">${g[goodsIndex.Name]}</td>
                    <td class="price">${g[goodsIndex.Price]}</td>
                    <td class="count">${g[goodsIndex.Count]}</td>
                    <td>
                        <button
                            class="good-remove btn btn-danger"
                            data-remove="${g[goodsIndex.Id]}"
                        >
                            &#10006;
                        </button>
                    </td>
                    <td>
                        <button
                            class="good-add-to-cart btn btn-primary"
                            data-add-to-cart="${g[goodsIndex.Id]}"
                        >
                            &#10149;
                        </button>
                    </td>
                </tr>
            `);

            // Пересчёт стоимости товара в корзине
            g[goodsIndex.InCartCost] =
                Math.round(
                    Math.max(
                        0,
                        g[goodsIndex.InCartCount] *
                        g[goodsIndex.Price] *
                        (1 - g[goodsIndex.Discount] / 100)
                    ) * 100
                ) / 100;

            // Рендер корзины
            if (g[goodsIndex.InCartCount] > 0) {
                tbodyCart.insertAdjacentHTML('beforeend', `
                    <tr class="align-middle">
                        <td>${i + 1}</td>
                        <td class="in-cart-name">${g[goodsIndex.Name]}</td>
                        <td class="in-cart-price">${g[goodsIndex.Price]}</td>
                        <td class="in-cart-count">${g[goodsIndex.InCartCount]}</td>
                        <td class="in-cart-discount">
                            <input
                                name="discount-field-${i + 1}"
                                data-good-id="${g[goodsIndex.Id]}"
                                type="text"
                                maxLength="3"
                                value="${g[goodsIndex.Discount]}"
                            />
                        </td>
                        <td class="in-cart-cost">${g[goodsIndex.InCartCost]}</td>
                        <td>
                            <button
                                class="good-remove-from-cart btn btn-danger"
                                data-remove-from-cart="${g[goodsIndex.Id]}"
                            >
                                &#10006;
                            </button>
                        </td>
                    </tr>
                `);
            }

            totalCost += g[goodsIndex.InCartCost];
        }

        // Сохраняем пересчитанные стоимости
        setGoods(goods);
    }

    // Нет товаров
    else {
        table1.hidden = true;
        table2.hidden = true;
        searchField.disabled = true;

        // Пустая строка для корректной инициализации List.js
        tbodyList.insertAdjacentHTML('beforeend', `
            <tr>
                <td></td>
                <td class="name"></td>
                <td class="price"></td>
                <td class="count"></td>
                <td></td>
                <td></td>
            </tr>
        `);
    }

    // Пересоздать объект List.js, если он передан
    if (userList) {
        userList = new List('goods-list', listOptions);
    }

    // Вывод общей стоимости
    totalCostElement.innerHTML = `${totalCost} &#8381;`;
}
