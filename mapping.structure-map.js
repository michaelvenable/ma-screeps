let constants = require('constants');

/**
 * Builds a map of a room containing the room's structures.
 *
 * @param room {Room}   Room that will be mapped.
 *
 * @return {object[]}   50x50 array where the element at [y][x] is an object consisting of two fields: (a)
 *                      type, which is a STRUCTURE_* constant specifying the type of structure at that
 *                      location and (b) state, which specifies the state of the structure. state can be
 *                      either 'structure' or 'construction-site'.
 */
function createFromRoom(room) {
    let map = [];

    for (let y = 0; y < constants.roomHeight; y++) {
        map.push([]);

        for (let x = 0; x < constants.roomWidth; x++) {
            let objects = room.lookAt(x, y);

            let structure = objects.find(o => o.type === 'structure');
            if (structure !== undefined) {
                map[y].push({
                    type: structure.structure.structureType,
                    state: 'built'
                });
                continue;
            }

            let constructionSite = objects.find(o => o.type === 'constructionSite');
            if (constructionSite !== undefined) {
                map[y].push({
                    type: constructionSite.structureType,
                    state: 'planned'
                });
                continue;
            }

            let source = objects.find(o => o.type === 'source');
            if (source !== undefined) {
                map[y].push({
                    type: 'source'
                });
                continue;
            }
            let wall = objects.find(o => o.type === 'terrain');
            if (wall !== undefined && wall.terrain === 'wall') {
                map[y].push({
                    type: STRUCTURE_WALL,
                    state: 'permanent'
                });
                continue;
            }


            map[y].push(0);
        }
    }

    return map;
}

/**
 * Prints a structure map.
 *
 * @param map {object[][]}  Output from createFromRum(room).
 */
function print(map) {
    for (let y = 0; y < constants.roomHeight; y++) {
        let row = '';

        for (let x = 0; x < constants.roomWidth; x++) {
            let symbol;

            if (map[y][x] === 0) {
                symbol = ' ';
            } else if (map[y][x].type === STRUCTURE_WALL) {
                symbol = '\u25A0';
            } else if (map[y][x].type === STRUCTURE_SPAWN) {
                symbol = '\u2654';
            } else if (map[y][x].type === STRUCTURE_EXTENSION) {
                symbol = '\u0489';
            } else if (map[y][x].type === STRUCTURE_ROAD) {
                symbol = '\u25A2';
            } else if (map[y][x].type === STRUCTURE_RAMPART) {
                symbol = '\u25A1';
            } else if (map[y][x].type === STRUCTURE_CONTROLLER) {
                symbol = '\u2690';
            } else if (map[y][x].type === STRUCTURE_LINK) {
                symbol = '\u2666';
            } else if (map[y][x].type === STRUCTURE_STORAGE) {
                symbol = '\u20E3';
            } else if (map[y][x].type === STRUCTURE_TOWER) {
                symbol = '\u265C';
            } else if (map[y][x].type === STRUCTURE_CONTAINER) {
                symbol = '\u20E3';
            } else if (map[y][x].type === 'source') {
                symbol = '\u2600';
            } else {
                symbol = '?';
            }

            row += symbol + ' ';
        }

        console.log(row);
    }
}

module.exports = {
    createFromRoom: createFromRoom,
    print: print
};
