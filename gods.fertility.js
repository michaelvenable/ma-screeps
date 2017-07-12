let actions = require('gods.fertility.actions');

Memory.gods = Memory.gods || {};
Memory.gods.fertility = Memory.gods.fertility || {};

function run(action) {
    actions[action].run();
}

function getProductionLog() {
    Memory.gods.fertility.productionLog = Memory.gods.fertility.productionLog || [];
    return Memory.gods.fertility.productionLog;
}

module.exports = {
    run: run,
    getProductionLog: getProductionLog
};
