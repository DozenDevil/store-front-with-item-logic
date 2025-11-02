import { initGoods, setGoods, getGoods } from './main/storage.js';
import { listOptions, goodsIndex, DEBUG_MODE } from './main/constants.js';
import { updateGoods } from './main/ui.js';
import { sortTable } from './main/sorting.js';
import { addGood, removeGood, testGoods } from './main/goods.js';
import { addToCart, removeFromCart } from './main/cart.js';

// Доступ к быстрому заполнению товаров при отладке
if (DEBUG_MODE) {
    window.testGoods = testGoods;
    console.log('[DEBUG] testGoods() доступна из консоли');
}

// Инициализация localStorage и интерфейса
initGoods();

// Инициализация модального окна Bootstrap
const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));

// Создание объекта List.js для поиска/сортировки
let userList = new List('goods-list', listOptions);

// Первичная отрисовка товаров
updateGoods(userList);

// Слушатели кликов по заголовкам таблиц для сортировки
document.getElementById('table1').onclick = e => {
    if (e.target.tagName === 'TH') {
        sortTable(e.target.cellIndex, e.target.dataset.type, 'table1');
    }
};
document.getElementById('table2').onclick = e => {
    if (e.target.tagName === 'TH') {
        sortTable(e.target.cellIndex, e.target.dataset.type, 'table2');
    }
};

// Добавление нового товара
document.querySelector('button.add-new').addEventListener('click', () => {
    const name = document.getElementById('good-name').value;
    const price = Math.min(Number(document.getElementById('good-price').value), 999999);
    const count = Math.min(Number(document.getElementById('good-count').value), 999);

    if (name && price && count) {
        document.getElementById('good-name').value = '';
        document.getElementById('good-price').value = '0';
        document.getElementById('good-count').value = '1';

        addGood(name, price, count);
        updateGoods(userList);
        myModal.hide();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: 'Пожалуйста, заполните все поля!'
        });
    }
});

// Обработка кликов по списку товаров
document.querySelector('.list').addEventListener('click', e => {
    if (e.target.dataset.remove) {
        const goods = getGoods()

        const targetGoodName = goods.find(
            g => g[goodsIndex.Id] === e.target.dataset.remove
        )?.[goodsIndex.Name];


        Swal.fire({
            title: 'Внимание!',
            html: `Вы действительно хотите удалить товар <br>
                <strong>"${targetGoodName}"</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да',
            cancelButtonText: 'Отмена'
        }).then((result) => {
            if (result.isConfirmed) {
                removeGood(e.target.dataset.remove)

                Swal.fire(
                    "Удалено",
                    "Выбранный товар был успешно удалён",
                    "success"
                )
            }
        })
    }

    if (e.target.dataset.addToCart) {
        addToCart(e.target.dataset.addToCart);
        updateGoods(userList);
    }
});

// Обработка кликов и ввода в корзине
document.querySelector('.cart').addEventListener('click', e => {
    if (e.target.dataset.removeFromCart) {
        removeFromCart(e.target.dataset.removeFromCart);
        updateGoods(userList);
    }
});

document.querySelector('.cart').addEventListener('input', e => {
    if (!e.target.dataset.goodId) return;

    const goods = getGoods();

    for (let g of goods) {
        if (g[goodsIndex.Id] === e.target.dataset.goodId) {
            if (!isNaN(e.target.value)) {
                if (e.target.value.length < 1) {
                    e.target.value = 0;
                } else if (e.target.value[0] == 0) {
                    e.target.value = e.target.value.slice(1);
                }

                if (e.target.value > 100) {
                    e.target.value = 100;
                }

                g[goodsIndex.Discount] = e.target.value;
                setGoods(goods);
            }

            updateGoods();

            let input = document.querySelector(`[data-good-id="${g[goodsIndex.Id]}"]`);
            input.focus();
            input.selectionStart = input.value.length;
        }
    }
});
