let productionLog = require('gods.fertility.models.production-log');
let worklist = require('models.worklist');

function run() {
    for (let name in Game.rooms) {
        let room = Game.rooms[name];
        let controller = room.controller;

        if (controller === undefined || !controller.my) {
            continue;
        }

        productionLog.add(Game.time, name, controller.progress);

        // Re-run in approximately 12 hours.
        worklist.add('fertility', 'append-production-log', 14400);
    }
}

module.exports = {
    run: run
};
