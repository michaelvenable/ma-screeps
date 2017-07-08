Memory.worklist = Memory.worklist || [];

function add(recipient, action, ticksFromNow) {
    Memory.worklist.push({
        god: recipient,
        action: action,
        runAt: Game.time + ticksFromNow
    });

    sortWorklist();
}

function sortWorklist() {
    Memory.worklist.sort(compareWorklistItem);
}

function getNext() {
    if (Memory.worklist.length > 0 && Memory.worklist[0].runAt <= Game.time) {
        return Memory.worklist.shift();
    }

    return null;
}

function compareWorklistItem(a, b) {
    if (a.runAt < b.runAt) {
        return -1;
    } else if (a.runAt > b.runAt) {
        return 1;
    }

    return 0;
}

module.exports = {
    add: add,
    getNext: getNext
}
