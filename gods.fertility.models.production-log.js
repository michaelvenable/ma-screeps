let columnWidths = [10, 10, 10];
let row = '';

function add(time, roomName, progress) {
    getProductionLog().push({
        time: time,
        room: roomName,
        progress: progress
    });

    let logLength = getProductionLog().length;
    if (getProductionLog().length > logLength) {
        getProductionLog().splice(-50);
    }
}

function print() {
    firstRow();
    headerRow();
    separatorRow();
    body();
    lastRow();
}

function getProductionLog() {
    Memory.gods.fertility.productionLog = Memory.gods.fertility.productionLog || [];
    return Memory.gods.fertility.productionLog;
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
    nextCell('ROOM', columnWidths[1]);
    nextCell('PROGRESS', columnWidths[2]);
    endOfRow();
}

function startOfRow() {
    row = '\u2502 ';
}

function body() {
    let log = getProductionLog();

    log.forEach(entry => {
        startOfRow();
        cell(entry.time.toString(), columnWidths[0]);
        nextCell(entry.room, columnWidths[1]);
        nextCell(entry.progress.toString(), columnWidths[2]);
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
    add: add,
    print: print
}
