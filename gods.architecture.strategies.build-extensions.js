let BoundingBox = require('class.bounding-box');
let models = require('gods.architecture.models');
let mappingHelpers = require('mapping.helpers');
let worklist = require('models').worklist;

let constants = require('constants');

/**
 * Places construction sites for energy extensions in a room. Attempts to find large areas of empty land in
 * order to place rows of structures in an organized way.
 *
 * @param room {Room}   The room where structures will be placed.
 */
function run(room, structureMap, buildList) {
    let area = BoundingBox.fromCoordinates({ x: 0, y: 0 }, { x: 49, y: 49 });

    let numExtensions = 0;

    structureMap.forEach(row => {
        row.filter(tile => tile !== 0 && tile.type === STRUCTURE_EXTENSION)
            .forEach(tile => numExtensions++);
    });

    let candidates = [];

    mappingHelpers.locateClearAreas(room, structureMap, area, 4, 4).forEach(c => candidates.push(c));

    mappingHelpers.locateClearAreas(room, structureMap, area, 4, 5).forEach(c => candidates.push(c));
    mappingHelpers.locateClearAreas(room, structureMap, area, 4, 6).forEach(c => candidates.push(c));

    mappingHelpers.locateClearAreas(room, structureMap, area, 5, 4).forEach(c => candidates.push(c));
    mappingHelpers.locateClearAreas(room, structureMap, area, 6, 4).forEach(c => candidates.push(c));

    let areas = candidates.sort(models.ExtensionSiteCandidate.compareFunction);

    if (areas.length > 0) {
        let locations = areas[0].getBuildLocations();

        locations.forEach(location => {
            if (numExtensions >= 60) {
                return;
            }

            structureMap[location.y][location.x] = {
                type: STRUCTURE_EXTENSION,
                state: 'planned'
            };

            buildList.push({
                type: STRUCTURE_EXTENSION,
                pos: location
            });

            numExtensions++;
        });
    }

    console.log(numExtensions);
    if (numExtensions < 60) {
        worklist.add('construction', 'plan-extensions', { ticksFromNow: 3 });
    } else {
        worklist.add('construction', 'plan-roads-from-spawn-to-energy', { ticksFromNow: 3 });
    }
}

/**
 * Searches the map for areas that are suitable for extension construction sites.
 *
 * @param room {Room}       Room that will contain the sites.
 * @param map {number[][]}  Two-dimensional that specifies whethere each tile in a room is suitable for
 *                          building. If map[y][x] is 1, then the location on the map at x, y is an obstacle
 *                          and cannot be built upon. If map[y][x] is 0, then the location is empty and can be
 *                          built upon.
 * @param width {number}    Width of the desired area.
 * @param height {number}   Height of the desired area.
 *
 * @return {ExtensionSiteCandidate[]}   Collection of candidates where extensions can be built. The collection
 *                                      can be sorted by score to order by the most optimal locations. Higher
 *                                      scores represent better locations.
 */
function locateCandidates(room, map, width, height) {
    let roomHeight = 50;
    let roomWidth = 50;

    let candidates = [];

    for (let topLeftY = 1; topLeftY < roomHeight - 1 - height; topLeftY++) {
        for (let topLeftX = 1; topLeftX < roomWidth - 1 - width; topLeftX++) {

            let areaIsClear = true;

            let boundary = BoundingBox.fromCoordinates(
                { x: topLeftX, y: topLeftY },
                { x: topLeftX + width - 1, y: topLeftY + height - 1 }
            );

            boundary.getLocations().forEach(location => {
                areaIsClear = areaIsClear && (map[location.y][location.x] === 0);
            });

            if (areaIsClear) {
                candidates.push(new models.ExtensionSiteCandidate(room, boundary));
            }
        }
    }

    return candidates;
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

