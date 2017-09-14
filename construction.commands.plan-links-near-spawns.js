let strategies = require('gods.architecture.strategies');
let mapping = require('mapping');
let worklist = require('models').worklist;

/**
 * Adds links to the in-memory map for all occupied rooms. The links are placed near spawns.
 *
 * Usage:
 * require('cli').run('construction', 'plan-links-near-spawns');
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
            throw new Error("You must run construction.commands.create-maps before running construction.commands.plan-links-near-energy-sources.");
        }

        let buildList = Memory.architect.buildLists[name] || [];

        strategies.buildLinksNearSpawns.run(room, map, buildList);
        mapping.structureMap.print(map);

        Memory.architect.maps[name] = map;
        Memory.architect.buildLists[name] = buildList;
    }

    worklist.add('construction', 'plan-towers-near-spawns', { ticksFromNow: 3 });
}

module.exports = run;

