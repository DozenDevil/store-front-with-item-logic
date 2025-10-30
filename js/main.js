const goodsIndex = Object.freeze({
    Id: 0,
    Name: 1,
    Price: 2,
    Count: 3,
    InCartCount: 4,
    Discount: 5,
    InCartCost: 6,
})

if (!localStorage.getItem('goods')) {
    localStorage.setItem('goods', JSON.stringify([]))
}

function clear_goods() {
    localStorage.setItem('goods', JSON.stringify([]))
    update_goods()
}

function test_goods() {
    localStorage.setItem('goods', JSON.stringify([
        ["good_0", "Огурцы", 85, 50, 0, 0, 0],
        ["good_1", "Телевизор", 41300, 3, 0, 0, 0],
        ["good_2", "Куртка", 2999, 12, 0, 0, 0],
        ["good_3", "Outer Wilds - Archaeologist Edition", 1700, 999, 0, 0, 0],
    ]))
    update_goods()
}

const myModal = new bootstrap.Modal(document.getElementById('exampleModal'))

let options = {
    valueNames: ['name', 'price']
}

let userList

document.querySelector('button.add-new').addEventListener('click', function (e) {
    let name = document.getElementById('good-name').value
    let price = Math.min(Number(document.getElementById('good-price').value), 999999)
    let count = Math.min(Number(document.getElementById('good-count').value), 999)

    if (name && price && count) {
        document.getElementById('good-name').value = ''
        document.getElementById('good-price').value = '0'
        document.getElementById('good-count').value = '1'

        let goods = JSON.parse(localStorage.getItem('goods'))
        goods.push(['good_' + goods.length, name, price, count, 0, 0, 0])
        localStorage.setItem('goods', JSON.stringify(goods))

        update_goods()

        myModal.hide()
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: 'Пожалуйста, заполните все поля!'
        })
    }
})

update_goods()

function update_goods() {
    let totalCost = 0
    let tbody = document.querySelector('tbody.list')

    tbody.innerHTML = ""
    document.querySelector("tbody.cart").innerHTML = ""

    let goods = JSON.parse(localStorage.getItem('goods'))

    if (goods.length) {
        table1.hidden = false
        table2.hidden = false

        for (let i = 0; i < goods.length; i++) {
            tbody.insertAdjacentHTML('beforeend',
            `
                <tr class="align-middle">
                    <td>${i + 1}</td>
                    <td class="name">${goods[i][goodsIndex.Name]}</td>
                    <td class="price">${goods[i][goodsIndex.Price]}</td>
                    <td class="count">${goods[i][goodsIndex.Count]}</td>
                    <td>
                        <button
                            class="good-delete btn btn-danger"
                            data-delete="${goods[i][goodsIndex.Id]}"
                        >
                            &#10006;
                        </button>
                    </td>
                    <td>
                        <button
                            class="good-delete btn btn-primary"
                            data-goods="${goods[i][goodsIndex.Id]}"
                        >
                            &#10149;
                        </button>
                    </td>
                </tr>
            `
            )

            if (goods[i][goodsIndex.InCartCount] > 0) {
                goods[i][goodsIndex.InCartCost] = goods[i][goodsIndex.InCartCount] * goods[i][goodsIndex.Price] * (1 - goods[i][goodsIndex.Discount] / 100)
                totalCost += goods[i][goodsIndex.InCartCost]
                document.querySelector("tbody.cart").insertAdjacentHTML('beforeend',
                `
                    <tr class="align-middle">
                        <td>${i + 1}</td>
                        <td class="in-cart-name">${goods[i][goodsIndex.Name]}</td>
                        <td class="in-cart-price">${goods[i][goodsIndex.Price]}</td>
                        <td class="in-cart-count">${goods[i][goodsIndex.InCartCount]}</td>
                        <td class="in-cart-discount">
                            <input
                                data-good-id="${goods[i][goodsIndex.Id]}"
                                type="number"
                                min="0"
                                max="999"
                                value="${goods[i][goodsIndex.InCartCount]}"
                            />
                        </td>
                        <td class="in-cart-cost">${goods[i][goodsIndex.InCartCost]}</td>
                        <td>
                            <button
                                class="good-delete btn btn-danger"
                                data-delete="${goods[i][goodsIndex.Id]}"
                            >
                                &#10006;
                            </button>
                        </td>
                    </tr>
                `
                )
            }
        }

        userList = new List('goods', options)
    }
    else {
        table1.hidden = true
        table2.hidden = true
    }

    document.querySelector('.total-cost').innerHTML = totalCost + ' &#8381;'
}

document.querySelector('.list').addEventListener('click', function (e) {
    if (!e.target.dataset.delete) {
        return
    }
    Swal.fire({
        title: 'Внимание!',
        text: 'Вы действительно хотите удалить товар?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да',
        cancelButtonText: 'Отмена'
    }).then((result) => {
        if (result.isConfirmed) {
            let goods = JSON.parse(localStorage.getItem('goods'))

            for(let i = 0; i < goods.length; i++) {
                if (goods[i][goodsIndex.Id] == e.target.dataset.delete) {
                    goods.splice(i, 1)
                    localStorage.setItem('goods', JSON.stringify(goods))
                    update_goods()
                }
            }

            Swal.fire(
                "Удалено",
                "Выбранный товар был успешно удалён",
                "success"
            )
        }
    })
})