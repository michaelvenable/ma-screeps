let architectHelpers = require('ai.architect.helpers');
let BoundingBox = require('class.bounding-box');
let helpers = require('helpers');

/**
 * Places construction sites for links near energy resources.
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

    room.find(FIND_SOURCES)
        .forEach(source => {
            let surroundingArea = new BoundingBox(source.pos, 2);

            if (!architectHelpers.doesAreaContainStructure(room, surroundingArea, STRUCTURE_LINK)) {
                let possibleLocations = surroundingArea.getBoundary()
                    .filter(location => !architectHelpers.isObstacle(room.lookAt(location.x, location.y)));

                let location = helpers.pickRandomElement(possibleLocations);
                let result = room.createConstructionSite(location.x, location.y, STRUCTURE_LINK);
                if (result !== OK) {
                    console.log(`Failed to build link at ${location.x}, ${location.y}.`);
                }
            }
        });
}

module.exports = {
    run: run
};
