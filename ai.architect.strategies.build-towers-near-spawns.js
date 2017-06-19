let BoundingBox = require('class.bounding-box');
let helpers = require('helpers');

let architect = {
    helpers: require('ai.architect.helpers')
};

/**
 * Builds a tower next to each spawn site. The tower is placed at a randomly chosen location near each spawn
 * point. Only one tower is placed at each spawn point.
 *
 * @param run {Room}    The room containing the spawn point.
 */
function run(room) {
    let spawns = room.find(FIND_MY_SPAWNS);

    spawns.forEach(spawn => {
        let radius = 6;
        let boundingBox = new BoundingBox(spawn.pos, radius);

        if (architect.helpers.doesAreaContainStructure(room, boundingBox, [STRUCTURE_TOWER])) {
            return;
        }

        let minimumDistance = 4;

        let locations = boundingBox.getLocations()
            .filter(location => helpers.distance(spawn.pos, location) >= minimumDistance)
            .filter(location => room.lookAt(location.x, location.y).length < 2);

        let location = helpers.pickRandomElement(locations);
        architect.helpers.placeTower(room, location.x, location.y);
    });
}

module.exports = {
    run: run
};
