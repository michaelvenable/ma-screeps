module.exports = {
    buildExtensions: require('ai.architect.strategies.build-extensions'),
    buildRoadsFromSpawnToEnergy: require('ai.architect.strategies.build-roads-from-spawn-to-energy'),
    buildRoadFromEnergyToController: require('ai.architect.strategies.build-road-from-energy-to-controller'),
    buildTowersNearControllers: require('ai.architect.strategies.build-towers-near-controllers'),
    buildTowersNearSpawns: require('ai.architect.strategies.build-towers-near-spawns'),
    buildLinksNearEnergySources: require('ai.architect.strategies.build-links-near-energy-sources'),
    buildLinksNearSpawns: require('ai.architect.strategies.build-links-near-spawns')
};
