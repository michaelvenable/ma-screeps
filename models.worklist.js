Memory.worklist = Memory.worklist || [];

/**
 * Adds a task to the worklist.
 *
 * @param component {string}                    Specifies the component that will handle the task.
 * @param command {string}                      Specifies the command that the component will run.
 * @param [options] {object}                    Optional settings.
 * @param [options.ticksFromNow] {number}       Specifies when the command should run. Expressed in number of
 *                                              ticks from now. If not provided, the command will run during
 *                                              the next tick.
 * @param [options.ticksUntilRepeat] {number}   Number of ticks to wait after running the command before
 *                                              running the commang again. If this value is not provided, the
 *                                              command will runa single time. If this value is provided, the
 *                                              command will be placed on the queue each time after it is run,
 *                                              so it will run indefinitely.
 */
function add(component, command, options) {
    options = options || {};

    let ticksFromNow = options.ticksFromNow || 1;

    Memory.worklist.push({
        god: component,
        action: command,
        runAt: Game.time + ticksFromNow,
        ticksUntilRepeat: options.ticksUntilRepeat
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
