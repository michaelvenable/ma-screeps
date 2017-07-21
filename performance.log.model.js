Memory.performance = Memory.performance || {};
Memory.performance.log = Memory.performance.log || {};

function append(action, amount) {
    ensureValidAction(action);

    if (Memory.performance.log[action] === undefined) {
        Memory.performance.log[action] = 0;
        reset(action);
    };

    Memory.performance.log[action] += amount;
}

function get(action) {
    ensureValidAction(action);

    if (Memory.performance.log[action] === undefined) {
        Memory.performance.log[action] = 0;
        reset(action);
    };

    return Memory.performance.log[action];
}

function reset(action) {
    ensureValidAction(action);
    Memory.performance.log[action] = 0;
}

function ensureValidAction(action) {
    let knownActions = ['harvest'];

    if (!knownActions.includes(action)) {
        throw new Error(`Performance.log: Unrecognized action: ${action}`);
    }
}

module.exports = {
    append: append,
    get: get,
    reset: reset
};
