export function getGoods() {
    return JSON.parse(localStorage.getItem('goods')) || [];
}

export function setGoods(goods) {
    localStorage.setItem('goods', JSON.stringify(goods));
}

export function clearGoods() {
    setGoods([]);
}

export function initGoods() {
    if (!localStorage.getItem('goods')) {
        setGoods([]);
    }
}
