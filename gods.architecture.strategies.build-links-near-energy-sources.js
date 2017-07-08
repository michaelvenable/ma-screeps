let BoundingBox = require('class.bounding-box');
let helpers = require('helpers');
let mappingHelpers = require('mapping.helpers');

/**
 * Places construction sites for links near energy resources.
 */
function run(room, structureMap, buildList) {
    // make sure we control this room.
    if (room.controller === undefined || !room.controller.my) {
        return;
    }

    room.find(FIND_SOURCES)
        .forEach(source => {
            let surroundingArea = new BoundingBox(source.pos, 6);

            if (mappingHelpers.doesAreaContainStructure(structureMap, surroundingArea, [STRUCTURE_LINK])) {
                return;
            }

            let candidates = mappingHelpers.locateClearAreas(room, structureMap, surroundingArea, 3, 3);

            if (candidates.length > 0) {
                let location = candidates[0].getCenter();
                structureMap[location.y][location.x] = {
                    type: STRUCTURE_LINK,
                    state: 'planned'
                };

                buildList.push({
                    type: STRUCTURE_LINK,
                    pos: location
                });
            }
        });
}

module.exports = {
    run: run
};
