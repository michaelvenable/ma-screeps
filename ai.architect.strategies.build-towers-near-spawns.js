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
        let towerBuilt = false;
        let numTriesRemaining = 5;

        while (!towerBuilt && numTriesRemaining > 0) {
            if (!doesSpawnHaveTower(room, spawn)) {
                let desiredPosition = getPositionNearSpawn(spawn);

                if (!helpers.isSomethingHere(room, desiredPosition)) {
                    if (helpers.placeTower(room, desiredPosition.x, desiredPosition.y)) {
                        towerBuilt = true;
                    }
                }
            }

            numTriesRemaining -= 1;
        }
    });
}

function doesSpawnHaveTower(room, spawn) {
    let boundingBox = {
        topLeft: {
            x: spawn.pos.y - 6,
            y: spawn.pos.x - 6
        },
        bottomRight: {
            x: spawn.pos.y + 6,
            y: spawn.pos.x + 6
        }
    };

    let asArray = true;
    let structures = room.lookForAtArea(LOOK_STRUCTURES, boundingBox.top, boundingBox.left, boundingBox.bottom, boundingBox.right, asArray);
    if (structures.filter(s => s.structureType === STRUCTURE_TOWER).length > 0) {
      return true;
    }

    let constructionSites = room.lookForAtArea(LOOK_CONSTRUCTION_SITES, boundingBox.top, boundingBox.left, boundingBox.bottom, boundingBox.right, asArray);
    // If there is a construction site nearby, assume that it might be a tower.
    if (constructionSites.length > 0) {
      return true;
    }

    return false;
}

function getPositionNearSpawn(spawn) {
    // Pick a random spot within a 7x7 grid around the spawn.
    let minX = spawn.pos.x - 3;
    let maxX = spawn.pos.x + 3;

    let minY = spawn.pos.y - 3;
    let maxY = spawn.pos.y + 3;

    let desiredX = Math.floor(Math.random() * (maxX - minX) + minX);
    let desiredY = Math.floor(Math.random() * (maxY - minY) + minY);

    return { x: desiredX, y: desiredY };
}

module.exports = {
    run: run
};
