let boardWidth = 100;
let borderWidth = 1;

let nameWidth = 15;
let taskWidth = 15
let marginWidth = 1;

let columnWidths = [20, 20, 60, 15];
let tableWidth = _.sum(columnWidths) + 4 + 3 * columnWidths.length - 1;

let row = '';

function showJobs() {
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
    cell('CREEP', columnWidths[0]);
    nextCell('JOB', columnWidths[1]);
    nextCell('TARGET', columnWidths[2]);
    nextCell('ENERGY', columnWidths[3]);
    endOfRow();
}

function startOfRow() {
    row = '\u2502 ';
}

function body() {
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        startOfRow();
        cell(name, columnWidths[0]);
        nextCell(creep.memory.job !== undefined ? creep.memory.job.action : '', columnWidths[1]);

        let targetId = creep.memory.job !== undefined ? creep.memory.job.target : undefined;
        let target = targetId ? Game.getObjectById(targetId) : '';
        nextCell(target.toString(), columnWidths[2]);

        let energy = creep.carry.energy;
        let capacity = creep.carryCapacity;
        nextCell(`${energy} / ${capacity}`, columnWidths[3]);
        endOfRow();
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


module.exports = showJobs;
