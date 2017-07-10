module.exports = {
    buildExtensions: require('gods.architecture.strategies.build-extensions'),
    buildRoadsFromSpawnToEnergy: require('gods.architecture.strategies.build-roads-from-spawn-to-energy'),
    buildRoadsFromEnergyToController: require('gods.architecture.strategies.build-roads-from-energy-to-controller'),
    buildTowersNearControllers: require('gods.architecture.strategies.build-towers-near-controllers'),
    buildTowersNearSpawns: require('gods.architecture.strategies.build-towers-near-spawns'),
    buildLinksNearEnergySources: require('gods.architecture.strategies.build-links-near-energy-sources'),
    buildLinksNearSpawns: require('gods.architecture.strategies.build-links-near-spawns'),
    rebuildFromStructureMap: require('gods.architecture.strategies.rebuild-from-structure-map')
};
