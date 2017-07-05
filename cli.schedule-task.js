function scheduleTask(action, ticksFromNow) {
    ticksFromNow = ticksFromNow || 1;

    Memory.architect.worklist.push({
        action: action,
        runAt: Game.time + ticksFromNow
    });
}

module.exports = scheduleTask;
