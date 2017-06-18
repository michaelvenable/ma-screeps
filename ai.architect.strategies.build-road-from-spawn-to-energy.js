let helpers = require('ai.architect.helpers');

function run(room) {
    let spawns = room.find(FIND_MY_SPAWNS);
    let sources = room.find(FIND_SOURCES);

    spawns.forEach(spawn => {
        sources.forEach(source => {
            helpers.establishRoad(room, spawn.pos, source.pos);
        });
    });
}

module.exports = {
    run: run
};
