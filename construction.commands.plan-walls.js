let strategies = require('gods.architecture.strategies');
let mapping = require('mapping');
let worklist = require('models').worklist;

/**
 * Adds walls to the in-memory map for all occupied rooms.
 *
 * Usage:
 * require('cli').run('construction', 'plan-walls');
 */
function run() {
    Memory.architect = Memory.architect || {
        maps: {},
        buildLists: {}
    };

    for (let name in Game.rooms) {
        let room = Game.rooms[name];

        let map = Memory.architect.maps[name];
        if (map === undefined) {
            throw new Error("You must run construction.commands.create-maps before running construction.commands.plan-walls.");
        }

        let buildList = Memory.architect.buildLists[name] || [];

        strategies.placeWalls.run(room, map, buildList);
        mapping.structureMap.print(map);

        Memory.architect.maps[name] = map;
        Memory.architect.buildLists[name] = buildList;

        worklist.add('construction', 'build', { ticksFromNow: 3 });
    }
}

module.exports = run;

