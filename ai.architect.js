let strategies = require('ai.architect.strategies');

/**
 * Decides where structures will be placed.
 */
function run() {
    if (Memory.lastBuildTime === undefined) {
        Memory.lastBuildTime = Game.time;
    }

    if (Game.time < (Memory.lastBuildTime + 100)) {
        return;
    }

    Memory.lastBuildTime = Game.time;

    let employedStrategies = [
        strategies.buildExtensions,
        strategies.buildRoadFromSpawnToEnergy,
        strategies.buildRoadFromEnergyToController,
        strategies.buildTowersNearSpawns,
        strategies.buildTowersNearControllers,
        strategies.buildLinksNearEnergySources,
    ];

    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];
        employedStrategies.forEach(strategy => strategy.run(spawn.room));
    }
}

module.exports = {
    run: run
};
