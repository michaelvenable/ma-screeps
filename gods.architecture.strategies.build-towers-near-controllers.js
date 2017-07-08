let BoundingBox = require('class.bounding-box');
let helpers = require('helpers');
let mappingHelpers = require('mapping.helpers');

/**
 * Places a tower near each controller. The chosen location is a random location with 6 squares of a spawn.
 * Each spawn will only receive one tower.
 */
function run(room, structureMap, buildList) {
    let controller = room.controller;

    if (controller === undefined || !controller.my) {
        return;
    }

    let radius = 6;
    let boundingBox = new BoundingBox(controller.pos, radius);

    if (mappingHelpers.doesAreaContainStructure(structureMap, boundingBox, [STRUCTURE_TOWER])) {
        return;
    }

    let candidates = mappingHelpers.locateClearAreas(room, structureMap, boundingBox, 3, 3);

    if (candidates.length > 0) {
        let location = candidates[0].getCenter();
        structureMap[location.y][location.x] = {
            type: STRUCTURE_TOWER,
            state: 'planned'
        };

        buildList.push({
            type: STRUCTURE_TOWER,
            pos: location
        });
    }
}

module.exports = {
    run: run
};
