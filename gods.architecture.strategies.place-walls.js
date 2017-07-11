let BoundingBox = require('class.bounding-box');

function run(room, structureMap, buildList) {
    room.find(FIND_MY_SPAWNS)
        .forEach(spawn => {
            let walledArea = new BoundingBox(spawn.pos, 5);

            let locations = walledArea.getBoundary();
            for (let i = 0; i < locations.length; i++) {
                let location = locations[i];

                if (structureMap[location.y][location.x] === 0) {
                    structureMap[location.y][location.x] =  {
                        type: STRUCTURE_WALL,
                        state: 'planned'
                    };

                    buildList.push({
                        type: STRUCTURE_WALL,
                        pos: location
                    });
                }
            }
        });
}

module.exports = {
    run: run
};
