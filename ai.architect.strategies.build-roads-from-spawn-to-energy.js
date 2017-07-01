let mappingHelpers = require('mapping.helpers');

function run(room, structureMap, buildList) {
    let spawns = room.find(FIND_MY_SPAWNS);
    let sources = room.find(FIND_SOURCES);

    spawns.forEach(spawn => {
        sources.forEach(source => {
            let path = room.findPath(spawn.pos, source.pos, { ignoreCreeps: true, ignoreRoads: true });

            for (let i = 0; i < path.length; i++) {
                let location = path[i];

                if (!mappingHelpers.isObstacle(structureMap[location.y][location.x])) {
                    structureMap[location.y][location.x] = {
                        type: STRUCTURE_ROAD,
                        state: 'planned'
                    };

                    buildList.push({
                        type: STRUCTURE_ROAD,
                        pos: {
                            x: location.x,
                            y: location.y
                        }
                    });
                }
            }
        });
    });
}

module.exports = {
    run: run
};
