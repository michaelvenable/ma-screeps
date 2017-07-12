let columnWidths = [15, 10];
let row = '';

function run() {
    firstRow();
    headerRow();
    separatorRow();
    body();
    lastRow();
}

function firstRow() {
    row = '\u250C';

    for (let columnIndex = 0; columnIndex < columnWidths.length; columnIndex++) {
        let columnWidth = columnWidths[columnIndex];

        for (let i = 0; i < columnWidth + 2; i++) {
            row += '\u2500';
        }

        if (columnIndex < columnWidths.length - 1) {
            row += '\u252C';
        }
    }

    row += '\u2510';

    console.log(row);
}

function headerRow() {
    startOfRow();
    cell('TIME', columnWidths[0]);
    nextCell('GROWTH', columnWidths[1]);
    endOfRow();
}

function startOfRow() {
    row = '\u2502 ';
}

function body() {
    let log = Memory.gods.fertility.productionLog || [];

    log.forEach(entry => {
        startOfRow();
        cell(entry.time, columnWidths[0]);
        nextCell(entry.growth, columnWidths[1]);
        endOfRow();
    });
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

function endOfRow() {
    row += ' \u2502';
    console.log(row);
}

function separatorRow() {
    row = '\u251C';

    for (let columnIndex = 0; columnIndex < columnWidths.length; columnIndex++) {
        let width = columnWidths[columnIndex];

        for (let i = 0; i < width + 2; i++) {
            row += '\u2500';
        }

        if (columnIndex < columnWidths.length - 1) {
            row += '\u253C';
        }
    }

    row += '\u2524';

    console.log(row);
}

function lastRow() {
    row = '\u2514';

    for (let columnIndex = 0; columnIndex < columnWidths.length; columnIndex++) {
        let columnWidth = columnWidths[columnIndex];

        for (let i = 0; i < columnWidth + 2; i++) {
            row += '\u2500';
        }

        if (columnIndex < columnWidths.length - 1) {
            row += '\u2534';
        }
    }

    row += '\u2518';
    console.log(row);
}
module.exports = {
    run: run
}
