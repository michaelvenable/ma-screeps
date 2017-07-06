let strategies = require('ai.architect.strategies');
let mapping = require('mapping');

/**
 * Decides where structures will be placed.
 */
function run() {
    Memory.architect = Memory.architect || {
        maps: {},
        buildLists: {}
    };

    if (Memory.architect.worklist !== undefined) {
        Memory.architect.worklist.sort((a, b) => {
            if (a.runAt < b.runAt) {
                return -1;
            } else if (a.runAt > b.runAt) {
                return 1;
            }

            return 0;
        });
    }

    if (Memory.architect.worklist === undefined) {
        Memory.architect.worklist = [
            {
                runAt: Game.time + 1,
                action: 'create-maps'
            }, {
                runAt: Game.time + 2,
                action: 'plan-links-near-energy-sources'
            }, {
                runAt: Game.time + 3,
                action: 'plan-links-near-spawns'
            }, {
                runAt: Game.time + 4,
                action: 'plan-towers-near-spawns'
            }, {
                runAt: Game.time + 5,
                action: 'plan-towers-near-controllers'
            }, {
                runAt: Game.time + 8,
                action: 'plan-extensions'
            }, {
                runAt: Game.time + 15,
                action: 'plan-extensions'
            }, {
                runAt: Game.time + 20,
                action: 'plan-extensions'
            }, {
                runAt: Game.time + 25,
                action: 'plan-extensions'
            }, {
                runAt: Game.time + 30,
                action: 'plan-extensions'
            }, {
                runAt: Game.time + 35,
                action: 'plan-extensions'
            }, {
                runAt: Game.time + 40,
                action: 'plan-extensions'
            }, {
                runAt: Game.time + 45,
                action: 'plan-extensions'
            }, {
                runAt: Game.time + 50,
                action: 'plan-roads-from-spawn-to-energy'
            }, {
                runAt: Game.time + 55,
                action: 'plan-roads-from-energy-to-controller'
            }, {
                runAt: Game.time + 56,
                action: 'build'
            }
        ];
    }

    let worklist = Memory.architect.worklist;
    while (worklist.length > 0 && worklist[0].runAt <= Game.time) {
        for (let name in Game.rooms) {
            let room = Game.rooms[name];

            let task = worklist.shift();

            let taskFn;

            switch (task.action) {
                case 'create-maps':
                    Memory.architect.maps[name] = mapping.structureMap.createFromRoom(room);
                    break;

                case 'plan-links-near-energy-sources':
                    taskFn = strategies.buildLinksNearEnergySources.run;
                    break;

                case 'plan-links-near-spawns':
                    taskFn = strategies.buildLinksNearSpawns.run;
                    break;

                case 'plan-towers-near-spawns':
                    taskFn = strategies.buildTowersNearSpawns.run;
                    break;

                case 'plan-towers-near-controllers':
                    taskFn = strategies.buildTowersNearControllers.run;
                    break;

                case 'plan-extensions':
                    taskFn = strategies.buildExtensions.run;
                    break;

                case 'plan-roads-from-spawn-to-energy':
                    taskFn = strategies.buildRoadsFromSpawnToEnergy.run;
                    break;

                case 'plan-roads-from-energy-to-controller':
                    taskFn = strategies.buildRoadsFromEnergyToController.run;
                    break;

                case 'build':
                    build(room);
                    break;

                default:
                    taskFn = function () {
                        console.log(`Architect: ERROR!: Unrecognized action: ${task.action}`);
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

    Memory.architect.worklist.push({
        runAt: Game.time + 250,
        action: 'build'
    });
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
