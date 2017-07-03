let strategies = require('ai.architect.strategies');
let mapping = require('mapping');

/**
 * Decides where structures will be placed.
 */
function run() {
    // if (Memory.lastBuildTime === undefined) {
    //     Memory.lastBuildTime = Game.time;
    // }

    // if (Game.time < (Memory.lastBuildTime + 100)) {
        // return;
    // }

    // Memory.lastBuildTime = Game.time;

    let employedStrategies = [
        strategies.buildLinksNearEnergySources,
        strategies.buildLinksNearSpawns,
        strategies.buildTowersNearSpawns,
        strategies.buildTowersNearControllers,
        strategies.buildExtensions,
        strategies.buildRoadsFromSpawnToEnergy,
        strategies.buildRoadsFromEnergyToController
    ];

    for (let name in Game.rooms) {
        let room = Game.rooms[name];

        // Skip if we've already created a build list for this room.
        if (Memory.buildLists === undefined || Memory.buildLists[name] === undefined) {
            let map = mapping.structureMap.createFromRoom(room);
            let buildList = [];

            employedStrategies.forEach(strategy => strategy.run(room, map, buildList));

            mapping.structureMap.print(map);

            Memory.buildLists = Memory.buildList || {};
            Memory.buildLists[name] = buildList;
        } else {
            if (Memory.lastBuildTime === undefined) {
                Memory.lastBuildTime = Game.time;
            }

            if (Game.time >= (Memory.lastBuildTime + 20)) {
                console.log("Placing construction sites. Build list has items: ", Memory.buildLists[name].length);

                Memory.lastBuildTime = Game.time;

                let nextBuildList = [];

                while (Memory.buildLists[name].length > 0) {
                    let action = Memory.buildLists[name].shift();
                    let result = room.createConstructionSite(action.pos.x, action.pos.y, action.type);
                    if (result !== OK) {
                        nextBuildList.push(action);
                    }
                }

                Memory.buildLists[name] = nextBuildList;
            }
        }
    }
}

module.exports = {
    run: run
};
