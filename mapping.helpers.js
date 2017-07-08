let models = require('gods.architecture.models');
let BoundingBox = require('class.bounding-box');
let constants = require('constants');

function doesAreaContainStructure(structureMap, boundingBox, structureTypes) {
    for (let y = boundingBox.topLeft.y; y <= boundingBox.bottomRight.y; y++) {
        for (let x = boundingBox.topLeft.x; x <= boundingBox.bottomRight.x; x++) {
            if (structureTypes.includes(structureMap[y][x].type)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Searches a structure map for tiles of a particular type.
 *
 * @param structureMap {object[][]}     Structure map that will be searched. Created using
 *                                      StructureMap.createFromRoom.
 * @param includeFn {function}          Determines whether a tile should be included in the result.
 *
 *
 * @return {object[]}   Array containing the locations of matching tiles.
 */
function find(structureMap, includeFn) {
    let matches = [];

    for (let y = 0; y < constants.roomHeight; y++) {
        for (let x = 0; x < constants.roomWidth; x++) {
            if (includeFn(structureMap[y][x])) {
                matches.push({ x: x, y: y });
            }
        }
    }

    return matches;
}

function isObstacle(object) {
    return object !== 0;
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
function locateClearAreas(room, structureMap, area, width, height) {
    let candidates = [];

    for (let topLeftY = area.topLeft.y; topLeftY <= area.bottomRight.y - height; topLeftY++) {
        for (let topLeftX = area.topLeft.x; topLeftX < area.bottomRight.x - width; topLeftX++) {

            let areaIsClear = true;

            let boundary = BoundingBox.fromCoordinates(
                { x: topLeftX, y: topLeftY },
                { x: topLeftX + width - 1, y: topLeftY + height - 1 }
            );

            boundary.getLocations().forEach(location => {
                areaIsClear = areaIsClear && (structureMap[location.y][location.x] === 0);
            });

            if (areaIsClear) {
                candidates.push(new models.ExtensionSiteCandidate(room, boundary));
            }
        }
    }

    return candidates.sort(compare);
}

function compare(a, b) {
    let aScore = a.getScore();
    let bScore = b.getScore();

    if (aScore > bScore) {
        return -1;
    } else if (aScore < bScore) {
        return 1;
    }

    return 0;
}

module.exports = {
    doesAreaContainStructure: doesAreaContainStructure,
    find: find,
    isObstacle: isObstacle,
    locateClearAreas: locateClearAreas
};
