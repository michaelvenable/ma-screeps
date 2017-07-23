let row;

/**
 * Draws a table fo data.
 *
 * @param columns {Column[]}    Specifies the columns in the table.
 * @param data {object[][]}     Defines the data to be shown in the array.
 *
 * @example
 * let columns = [
 *      { title: 'Column 1', width: 10 },
 *      { title: 'Column 2', width: 5 },
 *  ];
 *
 *  let data = [
 *      [ 'value 1', 1 ],
 *      [ 'value 2', 10 ]
 *  ];
 *
 *  table.draw(columns, data);
 */
function draw(columns, data) {
    firstRow(columns);
    headerRow(columns);
    data.forEach(row => dataRow(columns, row));
    lastRow(columns);
}

function firstRow(columns) {
    let row = '\u250C';

    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        let columnWidth = columns[columnIndex].width;

        for (let i = 0; i < columnWidth + 2; i++) {
            row += '\u2500';
        }

        if (columnIndex < columns.length - 1) {
            row += '\u252C';
        }
    }

    row += '\u2510';

    console.log(row);
}

/**
 * Draws the header row.
 *
 * @param columns {Column[]}
 */
function headerRow(columns) {
    startOfRow();

    if (columns.length > 0) {
        cell(columns[0].title, columns[0].width);
    }

    for (let i = 1; i < columns.length; i++) {
        nextCell(columns[i].title, columns[i].width);
    }

    endOfRow();

    separatorRow(columns);
}

function dataRow(columns, values) {
    startOfRow();

    for (let i = 0; i < values.length; i++) {
        if (i === 0) {
            cell(values[i].toString(), columns[i].width);
        } else {
            nextCell(values[i].toString(), columns[i].width);
        }
    }

    endOfRow();
}

function startOfRow() {
    row = '\u2502 ';
}

function cell(content, width) {
    let text = content.substring(0, width);
    row += text;

    if (width !== undefined) {
        for (let i = width - text.length; i > 0; i--) {
            row += ' ';
        }
    }
}

function nextCell(content, width) {
    row += ' \u2502 ';
    cell(content, width);
}

function separatorRow(columns) {
    row = '\u251C';

    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        let width = columns[columnIndex].width;

        for (let i = 0; i < width + 2; i++) {
            row += '\u2500';
        }

        if (columnIndex < columns.length - 1) {
            row += '\u253C';
        }
    }

    row += '\u2524';

    console.log(row);
}

function endOfRow() {
    row += ' \u2502';
    console.log(row);
}

function lastRow(columns) {
    row = '\u2514';

    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        let columnWidth = columns[columnIndex].width;

        for (let i = 0; i < columnWidth + 2; i++) {
            row += '\u2500';
        }

        if (columnIndex < columns.length - 1) {
            row += '\u2534';
        }
    }

    row += '\u2518';
    console.log(row);
}

function Column(title, width) {
    this.title = title;
    this.width = width;
}

module.exports = {
    draw: draw
};
