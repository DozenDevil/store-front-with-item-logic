const goodsIndex = Object.freeze({
    Id: 0,
    Name: 1,
    Price: 2,
    Count: 3,
    InCartCount: 4,
    Discount: 5,
    InCartCost: 6,
})

table1.onclick = function (e) {
    if (e.target.tagName != 'TH')
        return

    let th = e.target
    sortTable(th.cellIndex, th.dataset.type, 'table1')
}

table2.onclick = function (e) {
    if (e.target.tagName != 'TH')
        return

    let th = e.target
    sortTable(th.cellIndex, th.dataset.type, 'table2')
}

function sortTable(colNum, type, id) {
    let elem = document.getElementById(id)
    let tbody = elem.querySelector('tbody')
    let rowsArray = Array.from(tbody.rows)

    let compare
    switch (type) {
        case 'number':
            compare = function (rowA, rowB) {
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML
            }
            break
        case 'string':
            compare = function (rowA, rowB) {
                return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1
            }
            break
    }

    rowsArray.sort(compare)
    tbody.append(...rowsArray)
}

if (!localStorage.getItem('goods')) {
    localStorage.setItem('goods', JSON.stringify([]))
}

function clear_goods() {
    localStorage.setItem('goods', JSON.stringify([]))
    update_goods()
}

function test_goods() {
    localStorage.setItem('goods', JSON.stringify([
        ["good_0", "Огурец", 85, 50, 0, 0, 0],
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
                            class="good-remove btn btn-danger"
                            data-remove="${goods[i][goodsIndex.Id]}"
                        >
                            &#10006;
                        </button>
                    </td>
                    <td>
                        <button
                            class="good-add-to-cart btn btn-primary"
                            data-add-to-cart="${goods[i][goodsIndex.Id]}"
                        >
                            &#10149;
                        </button>
                    </td>
                </tr>
            `
            )

            if (goods[i][goodsIndex.InCartCount] > 0) {
                goods[i][goodsIndex.InCartCost] = Math.round(Math.max(0, goods[i][goodsIndex.InCartCount] * goods[i][goodsIndex.Price] * (1 - goods[i][goodsIndex.Discount] / 100)) * 100) / 100
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
                                name="discount-field-${i + 1}"
                                data-good-id="${goods[i][goodsIndex.Id]}"
                                type="text"
                                maxLength="3"
                                value="${goods[i][goodsIndex.Discount]}"
                            />
                        </td>
                        <td class="in-cart-cost">${goods[i][goodsIndex.InCartCost]}</td>
                        <td>
                            <button
                                class="good-remove-from-cart btn btn-danger"
                                data-remove-from-cart="${goods[i][goodsIndex.Id]}"
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
    if (!e.target.dataset.remove) {
        return
    }

    let goods = JSON.parse(localStorage.getItem('goods'))

    let targetGoodName
    for (let i = 0; i < goods.length; i++) {
        if (goods[i][goodsIndex.Id] == e.target.dataset.remove) {
            targetGoodName = goods[i][goodsIndex.Name]
            break
        }
    }

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
            for (let i = 0; i < goods.length; i++) {
                if (goods[i][goodsIndex.Id] == e.target.dataset.remove) {
                    goods.splice(i, 1)
                    localStorage.setItem('goods', JSON.stringify(goods))
                    update_goods()
                    break
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

document.querySelector('.list').addEventListener('click', function (e) {
    if (!e.target.dataset.addToCart) {
        return
    }

    let goods = JSON.parse(localStorage.getItem('goods'))

    for (let i = 0; i < goods.length; i++) {
        if (goods[i][goodsIndex.Count] > 0 &&
            goods[i][goodsIndex.Id] == e.target.dataset.addToCart) {
            goods[i][goodsIndex.Count] -= 1
            goods[i][goodsIndex.InCartCount] += 1
            localStorage.setItem('goods', JSON.stringify(goods))
            update_goods()
        }
    }
})

document.querySelector('.cart').addEventListener('click', function (e) {
    if (!e.target.dataset.removeFromCart) {
        return
    }

    let goods = JSON.parse(localStorage.getItem('goods'))

    for (let i = 0; i < goods.length; i++) {
        if (goods[i][goodsIndex.InCartCount] > 0 &&
            goods[i][goodsIndex.Id] == e.target.dataset.removeFromCart) {
            goods[i][goodsIndex.Count] += goods[i][goodsIndex.InCartCount]
            goods[i][goodsIndex.InCartCount] = 0
            localStorage.setItem('goods', JSON.stringify(goods))
            update_goods()
        }
    }
})

document.querySelector('.cart').addEventListener('input', function (e) {
    if (!e.target.dataset.goodId) {
        return
    }

    let goods = JSON.parse(localStorage.getItem('goods'))

    for (let i = 0; i < goods.length; i++) {
        if (goods[i][goodsIndex.Id] == e.target.dataset.goodId) {
            if (!isNaN(e.target.value)) {
                if (e.target.value.length < 1) {
                    e.target.value = 0
                }
                else if (e.target.value[0] == 0) {
                    e.target.value = e.target.value.slice(1)
                }

                if (e.target.value > 100) {
                    e.target.value = 100
                }

                goods[i][goodsIndex.Discount] = e.target.value
                localStorage.setItem('goods', JSON.stringify(goods))
            }
            
            update_goods()

            let input = document.querySelector(`[data-good-id="${goods[i][goodsIndex.Id]}"]`)
            input.focus()
            input.selectionStart = input.value.length
        }
    }
})