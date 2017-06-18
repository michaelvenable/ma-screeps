let BoundingBox = require('class.bounding-box');
let helpers = require('helpers');

let architect = {
    helpers: require('ai.architect.helpers')
};

/**
 * Places a tower near each controller. The chosen location is a random location with 6 squares of a spawn.
 * Each spawn will only receive one tower.
 */
function run(room) {
    let controller = room.controller;

    if (controller === undefined || !controller.my) {
        return;
    }

    let radius = 6;
    let boundingBox = new BoundingBox(controller.pos, radius);

    if (architect.helpers.doesAreaContainStructure(controller.room, boundingBox, [STRUCTURE_TOWER])) {
        return;
    }

    let locations = boundingBox.getLocations()
        .filter(location => room.lookAt(location.x, location.y).length < 2);

    let location = helpers.pickRandomElement(locations);
    architect.helpers.placeTower(room, location.x, location.y);
}

module.exports = {
    run: run
};
