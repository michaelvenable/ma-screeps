let worklist = require('models').worklist;

function scheduleTask(god, action, ticksFromNow) {
    ticksFromNow = ticksFromNow || 1;
    worklist.add(god, action, ticksFromNow);
}

module.exports = scheduleTask;
