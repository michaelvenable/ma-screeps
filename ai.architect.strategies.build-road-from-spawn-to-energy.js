let helpers = require('ai.architect.helpers');

function run(room) {
    let spawns = room.find(FIND_MY_SPAWNS);
    let sources = room.find(FIND_SOURCES);

    for (let i = 0; i < spawns.length; i++) {
        let spawn = spawns[i];

        for (let i = 0; i < sources.length; i++) {
            let source = sources[i];
            helpers.establishRoad(room, spawn.pos, source.pos);
        }
    }
}

module.exports = {
    run: run
};
