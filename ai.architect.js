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
    //

    Memory.architect = Memory.architect || {};

    if (Memory.architect.startPlanTimestamp === undefined) {
        Memory.architect.startPlanTimestamp = Game.time;
    }

    let employedStrategies = [
        { at: 1, fn: strategies.buildLinksNearEnergySources },
        { at: 5, fn: strategies.buildLinksNearSpawns },
        { at: 10, fn: strategies.buildTowersNearSpawns },
        { at: 15, fn: strategies.buildTowersNearControllers },
        { at: 45, fn: strategies.buildExtensions },
        { at: 75, fn: strategies.buildRoadsFromSpawnToEnergy },
        { at: 100, fn: strategies.buildRoadsFromEnergyToController }
    ];

    for (let name in Game.rooms) {
        let room = Game.rooms[name];

        // Skip if we've already created a build list for this room.
        // if (Memory.buildLists === undefined || Memory.buildLists[name] === undefined) {
        if (Game.time < Memory.architect.startPlanTimestamp + 100) {
            Memory.architect.maps = Memory.architect.maps || {};
            if (Memory.architect.maps[name] === undefined) {
                Memory.architect.maps[name] = mapping.structureMap.createFromRoom(room);
            }
            let map = Memory.architect.maps[name];

            Memory.architect.buildLists = Memory.architect.buildLists || {};
            let buildList = Memory.architect.buildLists[name] || [];

            employedStrategies
                .filter(strategy => Game.time === Memory.architect.startPlanTimestamp + strategy.at)
                .forEach(strategy => {
                    strategy.fn.run(room, map, buildList)
                    mapping.structureMap.print(map);
                });

            Memory.architect.buildLists[name] = buildList;
        } else {
            if (Memory.lastBuildTime === undefined) {
                Memory.lastBuildTime = Game.time;
            }

            if (Game.time >= (Memory.lastBuildTime + 200)) {
                console.log("Placing construction sites. Build list has items: ", Memory.architect.buildLists[name].length);

                Memory.lastBuildTime = Game.time;

                let nextBuildList = [];

                while (Memory.architect.buildLists[name].length > 0) {
                    let action = Memory.architect.buildLists[name].shift();
                    let result = room.createConstructionSite(action.pos.x, action.pos.y, action.type);
                    if (result !== OK) {
                        nextBuildList.push(action);
                    }
                }

                Memory.architect.buildLists[name] = nextBuildList;
                Memory.lastBuildTime = Game.time;
            }
        }
    }
}

module.exports = {
    run: run
};
