export function sortTable(colNum, type, id) {
    let elem = document.getElementById(id);
    let tbody = elem.querySelector('tbody');
    let rowsArray = Array.from(tbody.rows);

    let compare = (a, b) => 0;
    if (type === 'number') {
        compare = (a, b) => a.cells[colNum].innerHTML - b.cells[colNum].innerHTML;
    } else if (type === 'string') {
        compare = (a, b) => a.cells[colNum].innerHTML.localeCompare(b.cells[colNum].innerHTML);
    }

    rowsArray.sort(compare);
    tbody.append(...rowsArray);
}
