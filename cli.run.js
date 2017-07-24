let worklist = require('models').worklist;

function run(component, command, ticksFromNow) {
    ticksFromNow = ticksFromNow || 1;
    worklist.add(component, command, ticksFromNow);
}

module.exports = run;
