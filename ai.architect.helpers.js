let BoundingBox = require('class.bounding-box');
let models = require('ai.architect.models');

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

    let structures = room.lookForAtArea(LOOK_STRUCTURES, boundingBox.topLeft.y, boundingBox.topLeft.x, boundingBox.bottomRight.y, boundingBox.bottomRight.x, asArray);
    if (structures.find(item => structureTypes.includes(item.structure.structureType))) {
        return true;
    }

    let constructionSites = room.lookForAtArea(LOOK_CONSTRUCTION_SITES, boundingBox.topLeft.y, boundingBox.topLeft.x, boundingBox.bottomRight.y, boundingBox.bottomRight.x, asArray);
    if (constructionSites.find(item => structureTypes.includes(item.constructionSite.structureType))) {
        return true;
    }

    return false;
}

function establishRoad(room, from, to) {
    let path = room.findPath(from, to, { ignoreCreeps: true, ignoreRoads: true });

    for (let i = 0; i < path.length; i++) {
        let location = path[i];
        if (!isSomethingHere(room, location)) {
            establishRoadConstructionSite(room, location);
        }
    }
}

function establishRoadConstructionSite(room, location) {
    let result = room.createConstructionSite(location.x, location.y, STRUCTURE_ROAD);

    if (result === OK) {
        console.log(`Road destined for ${location.x}, ${location.y}.`);
    } else {
        console.log(`Can't build road at ${location.x}, ${location.y}, because ${result}.`);
    }
}

/**
 * Determines if a tile contains an obstacle that cannot be built upon.
 *
 * @param objects {RoomObject[]}    Objects to be checked.
 *
 * @return {boolean}    true if the location has a wall, structure, construction site, or an energy source.
 */
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

function isSomethingHere(room, location) {
    return room.lookAt(location.x, location.y).length > 1;
}

function placeTower(room, x, y) {
    let result = room.createConstructionSite(x, y, STRUCTURE_TOWER);
    if (result === OK) {
      console.log(`Tower destined for ${x}, ${y}`);
      return true;
    } else {
      console.log(`Can't build tower at ${x}, ${y}, because ${result}.`);
      return false;
    }
}

/**
 * Locates areas within a room that are free from obstacles.
 *
 * @param room {Room}           The room being searched.
 * @param area {BoundingBox}    Defines the area within the room that will be searched for clear areas.
 * @param width {number}        Desired width of the clear area.
 * @param height {number}       Desired height of the clear area.
 *
 * @return {ExtensionSiteCandidate[]}   An array of bounding boxes that define the clear areas that were found. Each
 *                                      bounding will be exactly width x height in size, will be complete contained
 *                                      within the bounding box specified by the "area" parameter, and will have no
 *                                      obstacles within it.
 */
function locateClearAreas(room, area, width, height) {
    let obstacleMap = buildObstacleMap(room, area);

    let candidates = [];

    for (let topLeftY = area.topLeft.y; topLeftY <= area.bottomRight.y - height; topLeftY++) {
        for (let topLeftX = area.topLeft.x; topLeftX < area.bottomRight.x - width; topLeftX++) {

            let areaIsClear = true;

            let boundary = BoundingBox.fromCoordinates(
                { x: topLeftX, y: topLeftY },
                { x: topLeftX + width - 1, y: topLeftY + height - 1 }
            );

            boundary.getLocations().forEach(location => {
                areaIsClear = areaIsClear && (obstacleMap[location.y][location.x] === 0);
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
function buildObstacleMap(room, area) {
    let map = {};

    for (let y = area.topLeft.y; y <= area.bottomRight.y; y++) {
        map[y] = {};

        for (let x = area.topLeft.x; x <= area.bottomRight.x; x++) {
            let objects = room.lookAt(x, y);
            map[y][x] = isObstacle(objects) ? 1 : 0;
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
    doesAreaContainStructure: doesAreaContainStructure,
    establishRoad: establishRoad,
    establishRoadConstructionSite: establishRoadConstructionSite,
    isObstacle: isObstacle,
    isSomethingHere: isSomethingHere,
    locateClearAreas: locateClearAreas,
    placeTower: placeTower
};
