let builds = require('constants').builds;

let columnWidths = [20, 10, 10, 15];

let row = '';

function showBuilds() {
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
    cell('CLASS', columnWidths[0]);
    nextCell('LEVEL', columnWidths[1]);
    nextCell('# PARTS', columnWidths[2]);
    nextCell('COST', columnWidths[3]);
    endOfRow();
}

function startOfRow() {
    row = '\u2502 ';
}

function body() {
    for (let name in builds) {
        for (let i = 0; i < builds[name].length; i++) {
            let build = builds[name][i];

            startOfRow();
            cell(name, columnWidths[0]);
            nextCell(i.toString(), columnWidths[1]);
            nextCell(build.parts.length.toString(), columnWidths[2]);
            nextCell(build.getCost().toString(), columnWidths[3]);
            endOfRow();
        }
    }
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

module.exports = showBuilds;
