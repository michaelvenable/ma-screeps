let strategies = require('gods.architecture.strategies');
let mapping = require('mapping');
let worklist= require('models').worklist;

/**
 * Builds objects in the game world based on the in-memory map.
 *
 * Usage:
 * require('cli').run('construction', 'build');
 */
function run() {
    Memory.architect = Memory.architect || {
        maps: {},
        buildLists: {}
    };

    for (let name in Game.rooms) {
        let room = Game.rooms[name];

        build(room);
    }

}

function build(room) {
    let numConstructionSites = room.find(FIND_CONSTRUCTION_SITES).length;

    let buildList = Memory.architect.buildLists[room.name];
    console.log("Construction: Placing construction sites. Build list has items: ", buildList.length);

    buildList.sort(buildTaskCompare);

    let nextBuildList = [];

    while (buildList.length > 0) {
        let action = buildList.shift();

        if (numConstructionSites <5) {
            let result = room.createConstructionSite(action.pos.x, action.pos.y, action.type);
            if (result === OK) {
                numConstructionSites += 1;
            } else {
                nextBuildList.push(action);
            }
        } else {
            nextBuildList.push(action);
        }
    }

    Memory.architect.buildLists[room.name] = nextBuildList;

    worklist.add('construction', 'build', { ticksFromNow: 250 });
}

function buildTaskCompare(a, b) {
    if (a.type === b.type) {
        return 0;
    }

    // Roads have priority.
    if (a.type === STRUCTURE_ROAD) {
        return -1;
    }

    if (b.type === STRUCTURE_ROAD) {
        return 1;
    }

    // Towers have 2nd priority.
    if (a.type === STRUCTURE_TOWER) {
        return -1;
    }

    if (b.type === STRUCTURE_TOWER) {
        return 1;
    }

    // Extensions have 3rd priority.
    if (a.type === STRUCTURE_EXTENSION) {
        return -1;
    }

    if (b.type === STRUCTURE_EXTENSION) {
        return 1;
    }

    // Links have 4th priority.
    if (a.type === STRUCTURE_LINK) {
        return -1;
    }

    if (b.type === STRUCTURE_LINK) {
        return 1;
    }
}

module.exports = run;

