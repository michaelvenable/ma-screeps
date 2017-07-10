let constants = require('constants');

function run(room, structureMap, buildList) {
    console.log("Rebuilding from the map");

    for (let y = 0; y < constants.roomHeight; y++) {
        for (let x = 0; x < constants.roomWidth; x++) {
            if (structureMap[y][x] !== 0) {
                let objects = room.lookAt(x, y);
                let hasMappedObject = false;

                // Does it exist on the map?
                objects.forEach(o => {
                    if (o.type === 'structure' && o.structureType === structureMap[y][x].type) {
                        hasMappedObject = true;
                    }

                    if (o.type === 'constructionSite' && o.structureType === structureMap[y][x].type) {
                        hasMappedObject = true;
                    }
                });

                if (!hasMappedObject) {
                    // Is it still in the build list?
                    buildList.forEach(item => {
                        if (item.pos.x === x && item.pos.y === y && item.type === structureMap[y][x].type) {
                            hasMappedObject = true;
                        }
                    });
                }

                if (!hasMappedObject) {
                    // The object must have been destroyed.
                    buildList.push({
                        type: structureMap[y][x].type,
                        pos: { x: x, y: y }
                    });
                }
           }
        }
    }
}

module.exports = {
    run: run
};
