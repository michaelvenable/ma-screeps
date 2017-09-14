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
                // Use construction.commands.create-maps

            case 'plan-links-near-energy-sources':
                // Use construction.commands.plan-links-near-energy-sources

            case 'plan-links-near-spawns':
                // Use construction.commands.plan-links-near-spawns

            case 'plan-towers-near-spawns':
                // Use construction.commands.plan-towers-near-spawns

            case 'plan-towers-near-controllers':
                // Use construction.commands.plan-towers-near-controllers

            case 'plan-extensions':
                // Use construction.commands.plan-extensions

            case 'plan-roads-from-spawn-to-energy':
                // Use construction.commands.plan-roads-from-spawn-to-energy

            case 'plan-roads-from-energy-to-controller':
                // Use construction.commands.plan-roads-from-energy-to-controller

            case 'place-walls':
                // Use construction.commands.plan-walls

            case 'build':
                // Use construction.commands.build

            case 'rebuild-from-structure-map':
                taskFn = strategies.rebuildFromStructureMap.run;
                worklist.add('architecture', 'place-walls', { ticksFromNow: 3 });
                let oneDayInTicks = 28800;
                worklist.add('architecture', 'rebuild-from-structure-map', oneDayInTicks);
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

module.exports = {
    run: run
};
