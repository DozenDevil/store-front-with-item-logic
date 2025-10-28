if (!localStorage.getItem('goods')) {
    localStorage.setItem('goods', JSON.stringify([]))
}

const myModal = new bootstrap.Modal(document.getElementById('exampleModal'))

document.querySelector('button.add-new').addEventListener('click', function (e) {
    let name = document.getElementById('good-name').value
    let price = document.getElementById('good-price').value
    let count = document.getElementById('good-count').value

    if (name && price && count) {
        document.getElementById('good-name').value = ''
        document.getElementById('good-price').value = ''
        document.getElementById('good-count').value = '1'

        let goods = JSON.parse(localStorage.getItem('goods'))
        goods.push(['good_' + goods.length, name, price, count, 0, 0, 0])
        localStorage.setItem('goods', JSON.stringify(goods))

        // update_goods()

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