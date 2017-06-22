let BoundingBox = require('class.bounding-box');
let helpers = require('ai.architect.helpers');
let models = require('ai.architect.models');

/**
 * Places construction sites for energy extensions in a room. Attempts to find large areas of empty land in
 * order to place rows of structures in an organized way.
 *
 * @param room {Room}   The room where structures will be placed.
 */
function run(room) {
    let map = buildMap(room);
    let candidates = locateIdealAreas(map);

    if (candidates.length > 0) {
        let areas = candidates.sort(models.ExtensionSiteCandidate.compareFunction);

        let location = areas[0].getCenter();
        console.log(`Building extension at ${location.x}, ${location.y}.`);

        let result = room.createConstructionSite(location.x, location.y, STRUCTURE_EXTENSION);
        if (result !== OK) {
            console.log(`Failed to build extension: ${result}`);
        }
    }
}

/**
 * Searches the map for areas that are suitable for extension construction sites.
 *
 * @param map {number[][]}  Two-dimensional that specifies whethere each tile in a room is suitable for
 *                          building. If map[y][x] is 1, then the location on the map at x, y is an obstacle
 *                          and cannot be built upon. If map[y][x] is 0, then the location is empty and can be
 *                          built upon.
 *
 * @return {ExtensionSiteCandidate[]}   Collection of candidates where extensions can be built. The collection
 *                                      can be sorted by score to order by the most optimal locations. Higher
 *                                      scores represent better locations.
 */
function locateIdealAreas(map) {
    let areas = [];

    for (let y = 1; y < 46; y++) {
        for (let x = 1; x < 46; x++) {
            if (map[y+0][x] === 0 && map[y+0][x+1] === 0 && map[y+0][x+2] === 0 &&
                map[y+1][x] === 0 && map[y+1][x+1] === 0 && map[y+1][x+2] === 0 &&
                map[y+2][x] === 0 && map[y+2][x+1] === 0 && map[y+2][x+2] === 0) {

                let boundary = BoundingBox.fromCoordinates({ x: x, y: y }, { x: x + 2, y: y + 2 })
                areas.push(new models.ExtensionSiteCandidate(1, boundary));
            }
        }
    }

    return areas;
}

/**
 * Maps the room's terrain into a two-dimensional array.
 *
 * @param room {Room}   The room that will be mapped.
 *
 * @return {number[][]} A 50x50 array that represents the room's contents, where the elment in the array at
 *                      [y][x] specifies whether the room location is an obstacle (represented in the array
 *                      as a one) or not an obstacle (represented as a zero).
 */
function buildMap(room) {
    let map = [];

    for (let y = 0; y < 50; y++) {
        map.push([]);

        for (let x = 0; x < 50; x++) {
            let objects = room.lookAt(x, y);
            map[y].push(isObstacle(objects) ? 1 : 0);
        }
    }

    return map;
}

function isObstacle(objects) {
    return isWall(objects) || hasStructure(objects) || hasConstructionSite(objects) || hasSource(objects);
}

function isWall(objects) {
    return objects.findIndex(o => o.type === 'terrain' && o.terrain === 'wall') !== -1;
}

function hasConstructionSite(objects) {
    return objects.findIndex(o => o.type === 'constructionSite') !== -1;
}

function hasStructure(objects) {
    return objects.findIndex(o => o.type === 'structure') !== -1;
}

function hasSource(objects) {
    return objects.findIndex(o => o.type === 'source') !== -1;
}

module.exports = {
    run: run
};

