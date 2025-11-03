/**
 * Сортирует строки таблицы по заданному столбцу.
 *
 * @param {number} colNum — Номер столбца, по которому выполняется сортировка (начиная с 0).
 * @param {'number'|'string'} type — Тип данных в столбце: числовой или строковый.
 * @param {string} id — Идентификатор элемента таблицы.
 * @returns {void}
 *
 * @example
 * // Сортировка по первому столбцу как по строкам:
 * sortTable(0, 'string', 'goods-list');
 */
export function sortTable(colNum, type, id) {
    let elem = document.getElementById(id);
    let tbody = elem.querySelector('tbody');
    let rowsArray = Array.from(tbody.rows);

    let compare = (a, b) => 0;

    if (type === 'number') {
        compare = (a, b) =>
            a.cells[colNum].innerHTML - b.cells[colNum].innerHTML;
    } else if (type === 'string') {
        compare = (a, b) =>
            a.cells[colNum].innerHTML.localeCompare(b.cells[colNum].innerHTML);
    }

    rowsArray.sort(compare);
    tbody.append(...rowsArray);
}
