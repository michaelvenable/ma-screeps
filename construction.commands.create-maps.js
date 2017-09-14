let mapping = require('mapping');
let worklist = require('models').worklist;

/**
 * Creates an in-memory map for each room that is occupied by us. The map contains information about where
 * obstacles, walls, and structures are in the room. Other commands, like construction.commands.place-walls
 * can be used to add structures to the map. The construction.commands.build command can be used to build
 * the mapped objects in the game world.
 *
 * Usage:
 * require('cli').run('construction', 'create-maps');
 */
function run() {
    Memory.architect = Memory.architect || {
        maps: {},
        buildLists: {}
    };

    for (let name in Game.rooms) {
        let room = Game.rooms[name];

        let map = mapping.structureMap.createFromRoom(room);
        Memory.architect.maps[name] = map
        mapping.structureMap.print(map);
    }

    worklist.add('construction', 'plan-links-near-energy-sources', { ticksFromNow: 3 });
}

module.exports = run;
