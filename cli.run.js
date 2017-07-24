let worklist = require('models').worklist;

function run(component, command, options) {
    worklist.add(component, command, options);
}

module.exports = run;
