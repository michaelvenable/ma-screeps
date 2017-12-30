Memory.performance = Memory.performance || {};
Memory.performance.log = Memory.performance.log || {};

function append(metric, amount) {
    if (Memory.performance.isMeasuringOn) {
        ensureValidMetric(metric);

        if (Memory.performance.log[metric] === undefined) {
            Memory.performance.log[metric] = 0;
            reset(metric);
        };

        Memory.performance.log[metric] += amount;
    }
}

function get(metric) {
    ensureValidMetric(metric);

    if (Memory.performance.log[metric] === undefined) {
        Memory.performance.log[metric] = 0;
        reset(metric);
    };

    return Memory.performance.log[metric];
}

function reset(metric) {
    ensureValidMetric(metric);
    Memory.performance.log[metric] = 0;
}

function ensureValidMetric(metric) {
    let knownMetrics = ['harvested'];

    if (!knownMetrics.includes(metric)) {
        throw new Error(`Performance.log: Unrecognized metric: ${metric}`);
    }
}

module.exports = {
    append: append,
    get: get,
    reset: reset,
};
