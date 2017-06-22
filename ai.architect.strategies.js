module.exports = {
    buildExtensions: require('ai.architect.strategies.build-extensions'),
    buildRoadFromSpawnToEnergy: require('ai.architect.strategies.build-road-from-spawn-to-energy'),
    buildRoadFromEnergyToController: require('ai.architect.strategies.build-road-from-energy-to-controller'),
    buildTowersNearControllers: require('ai.architect.strategies.build-towers-near-controllers'),
    buildTowersNearSpawns: require('ai.architect.strategies.build-towers-near-spawns')
};
