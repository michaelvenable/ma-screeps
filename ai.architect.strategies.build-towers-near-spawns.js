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

        let boundingBox = {
            topLeft: {
                x: spawn.pos.x - radius,
                y: spawn.pos.y - radius
            },
            bottomRight: {
                x: spawn.pos.x + radius,
                y: spawn.pos.y + radius
            }
        };

        if (architect.helpers.doesAreaContainStructure(room, boundingBox, [STRUCTURE_TOWER])) {
            return;
        }

        let locations = architect.helpers.getLocationsInArea(boundingBox)
            .filter(location => room.lookAt(location.x, location.y).length < 2);

        let location = helpers.pickRandomElement(locations);
        architect.helpers.placeTower(room, location.x, location.y);
    });
}

module.exports = {
    run: run
};
