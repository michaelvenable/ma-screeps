let actions = require('gods.fertility.actions');

Memory.gods = Memory.gods || {};
Memory.gods.fertility = Memory.gods.fertility || {};

function run(action) {
    actions[action].run();
}

module.exports = {
    run: run
};
