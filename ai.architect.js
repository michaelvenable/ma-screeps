let strategies = require('ai.architect.strategies');
let mapping = require('mapping');

/**
 * Decides where structures will be placed.
 */
function run() {
    if (Memory.lastBuildTime === undefined) {
        Memory.lastBuildTime = Game.time;
    }

    if (Game.time < (Memory.lastBuildTime + 100)) {
        // return;
    }

    Memory.lastBuildTime = Game.time;

    let employedStrategies = [
        strategies.buildRoadsFromSpawnToEnergy,
        strategies.buildRoadsFromEnergyToController,
        strategies.buildTowersNearSpawns,
        strategies.buildTowersNearControllers,
        // strategies.buildLinksNearEnergySources,
        // strategies.buildLinksNearSpawns,
        // strategies.buildExtensions
    ];

    for (let name in Game.rooms) {
        let room = Game.rooms[name];

        let map = mapping.structureMap.createFromRoom(room);
        let buildList = [];

        employedStrategies.forEach(strategy => strategy.run(room, map, buildList));

        mapping.structureMap.print(map);

        Memory.buildLists = Memory.buildList || {};
        Memory.buildLists[name] = buildList;
    }
}

module.exports = {
    run: run
};
