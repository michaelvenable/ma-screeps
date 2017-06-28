let architectHelpers = require('ai.architect.helpers');
let BoundingBox = require('class.bounding-box');
let helpers = require('helpers');
let models = require('ai.architect.models');

/**
 * Places construction sites for links near spawns.
 */
function run(room) {
    // make sure we control this room.
    if (room.controller === undefined || !room.controller.my) {
        return;
    }

    // Make sure we are high enough level before doing anything.
    let numOfLinks = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK }}).length;
    let allowedNumberOfLinks = CONTROLLER_STRUCTURES.link[room.controller.level];

    if (numOfLinks >= allowedNumberOfLinks) {
        return;
    }

    room.find(FIND_MY_SPAWNS)
        .forEach(spawn => {
            let surroundingArea = new BoundingBox(spawn.pos, 15);

            if (architectHelpers.doesAreaContainStructure(room, surroundingArea, STRUCTURE_LINK)) {
                return;
            }

            let clearAreasNearSpawn = architectHelpers.locateClearAreas(room, surroundingArea, 3, 3);

            if (clearAreasNearSpawn.length > 0) {
                let areasByPriority = clearAreasNearSpawn.sort(models.ExtensionSiteCandidate.compareFunction);

                let location = areasByPriority[0].boundingBox.getCenter(); 
                let result = room.createConstructionSite(location.x, location.y, STRUCTURE_LINK);
                if (result !== OK) {
                    console.log(`Failed to build link at ${location.x}, ${location.y}.`);
                }
            }
        });

    room.find(FIND_SOURCES)
        .forEach(source => {
        });
}

module.exports = {
    run: run
};

