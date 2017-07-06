/**
 * CLI command that cause the worklist to be printed on each tick.
 */
function toggleWorklist() {
    Memory.architect.settings = Memory.architect.settings || {};
    Memory.architect.settings.showWorklist = !Memory.architect.settings.showWorklist;

    if (Memory.architect.settings.showWorklist) {
        console.log("Worklist is on.");
    } else {
        console.log("Worklist is off.");
    }
}

module.exports = toggleWorklist;
