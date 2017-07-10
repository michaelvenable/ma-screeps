let strategies = require('gods.architecture.strategies');
let mapping = require('mapping');
let worklist = require('models.worklist');

/**
 * Decides where structures will be placed.
 */
function run(action) {
    Memory.architect = Memory.architect || {
        maps: {},
        buildLists: {}
    };

    for (let name in Game.rooms) {
        let room = Game.rooms[name];

        let taskFn;

        switch (action) {
            case 'create-maps':
                Memory.architect.maps[name] = mapping.structureMap.createFromRoom(room);
                worklist.add('architecture', 'plan-links-near-energy-sources');
                break;

            case 'plan-links-near-energy-sources':
                taskFn = strategies.buildLinksNearEnergySources.run;
                worklist.add('architecture', 'plan-links-near-spawns');
                break;

            case 'plan-links-near-spawns':
                taskFn = strategies.buildLinksNearSpawns.run;
                worklist.add('architecture', 'plan-towers-near-spawns');
                break;

            case 'plan-towers-near-spawns':
                taskFn = strategies.buildTowersNearSpawns.run;
                worklist.add('architecture', 'plan-towers-near-controllers');
                break;

            case 'plan-towers-near-controllers':
                taskFn = strategies.buildTowersNearControllers.run;
                worklist.add('architecture', 'plan-extensions');
                break;

            case 'plan-extensions':
                taskFn = strategies.buildExtensions.run;
                break;

            case 'plan-roads-from-spawn-to-energy':
                taskFn = strategies.buildRoadsFromSpawnToEnergy.run;
                worklist.add('architecture', 'plan-roads-from-energy-to-controller', 3);
                break;

            case 'plan-roads-from-energy-to-controller':
                taskFn = strategies.buildRoadsFromEnergyToController.run;
                worklist.add('architecture', 'build', 3);
                break;

            case 'rebuild-from-structure-map':
                taskFn = strategies.rebuildFromStructureMap.run;
                let oneDayInTicks = 28800;
                worklist.add('architecture', 'rebuild-from-structure-map', oneDayInTicks);
                break;

            case 'build':
                build(room);
                break;

            default:
                taskFn = function () {
                    throw new Error(`God of Architecture: Unrecognized action: ${action}`);
                };
                break;
        }

        if (taskFn !== undefined) {
            let map = Memory.architect.maps[name];
            let buildList = Memory.architect.buildLists[name] || [];
            taskFn(room, map, buildList);
            mapping.structureMap.print(Memory.architect.maps[name]);

            Memory.architect.maps[name] = map;
            Memory.architect.buildLists[name] = buildList;
        }
    }
}

function build(room) {
    let numConstructionSites = room.find(FIND_CONSTRUCTION_SITES).length;

    let buildList = Memory.architect.buildLists[room.name];
    console.log("Architect: Placing construction sites. Build list has items: ", buildList.length);

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

    worklist.add('architecture', 'build', 250);
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

module.exports = {
    run: run
};
