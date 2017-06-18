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

module.exports = {
    doesAreaContainStructure: doesAreaContainStructure,
    establishRoad: establishRoad,
    establishRoadConstructionSite: establishRoadConstructionSite,
    getLocationsInArea: getLocationsInArea,
    isSomethingHere: isSomethingHere,
    placeTower: placeTower
};
