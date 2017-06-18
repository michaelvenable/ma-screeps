let helpers = require('ai.architect.helpers');

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

        if (doesAreaContainStructure(room, boundingBox, [STRUCTURE_TOWER])) {
            return;
        }

        let locations = getLocationsInArea(boundingBox)
            .filter(location => room.lookAt(location.x, location.y).length < 2);

        let randomIndex = Math.floor(Math.random() * locations.length);

        let location = locations[randomIndex];

        helpers.placeTower(room, location.x, location.y);
    });
}

/**
 * Determines if an area contains a particular type of structure or if a construction site has been placed for
 * a particular type of struction in the area.
 *
 * @param room {Room}               The room that contains the area.
 * @param boundingBox {object}      Defines the boundary of the area to search. The boundary edges are included.
 * @param structureType {string[]}  The structure type(s) to search for. Array of STRUCTURE_* constants. 
 *
 * @example
 * let boundingBox = {
 *     topLeft: {
 *         x: 10,
 *         y: 5
 *     },
 *     bottomRight: {
 *         x: 20,
 *         y: 15
 *     }
 * };
 * doesAreaContainStructure(room, boundingBox, [STRUCTURE_SPAWN]);
 */
function doesAreaContainStructure(room, boundingBox, structureTypes) {
    let asArray = true;

    let structures = room.lookForAtArea(LOOK_STRUCTURES, boundingBox.top, boundingBox.left, boundingBox.bottom, boundingBox.right, asArray);
    if (structures.find(structure => structureTypes.includes(structure.structureType))) {
        return true;
    }

    let constructionSites = room.lookForAtArea(LOOK_CONSTRUCTION_SITES, boundingBox.top, boundingBox.left, boundingBox.bottom, boundingBox.right, asArray);
    if (constructionSites.find(site => structureTypes.includes(site.structureType))) {
        return true;
    }

    return false;
}

/**
 * Returns a collection of locations, one for each tile, in an area.
 *
 * @param boundingBox {object}  Defines the area.
 *
 * @return {object[]}   Array of all locations contained within the bounding box, edges included.
 *
 * @example
 * let boundingBox = {
 *     topLeft: {
 *         x: 5,
 *         y: 5
 *     },
 *     bottomRight: {
 *         x: 6,
 *         y: 6
 *     }
 * };
 * getLocationsInArea(boundingBox);
 * => [{x: 5, y: 5}, {x: 5, y: 6}, {x: 6, y: 5}, {x: 6, y: 6}]
 */
function getLocationsInArea(boundingBox) {
    let locations = [];

    for (let x = boundingBox.topLeft.x; x < boundingBox.bottomRight.x; x++) {
        for (let y = boundingBox.topLeft.y; y < boundingBox.bottomRight.y; y++) {
            locations.push({ x: x, y: y});
        }
    }

    return locations;
}

module.exports = {
    run: run
};
