let BoundingBox = require('class.bounding-box');
let helpers = require('helpers');
let mappingHelpers = require('mapping.helpers');

/**
 * Builds a tower next to each spawn site. The tower is placed at a randomly chosen location near each spawn
 * point. Only one tower is placed at each spawn point.
 *
 * @param run {Room}    The room containing the spawn point.
 */
function run(room, structureMap, buildList) {
    let spawns = room.find(FIND_MY_SPAWNS);

    spawns.forEach(spawn => {
       let radius = 6;
       let boundingBox = new BoundingBox(spawn.pos, radius);

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
    });
}

module.exports = {
    run: run
};
