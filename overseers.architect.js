/**
 * Decides where structures will be placed.
 *
 * @param room {StructureRoom}  The room where this architect will focus its efforts. The architect will only place construction
 *                              sites in this room.
 */
let Architect = function (room) {
    /**
     *
     */
    this.establishConstructionSites = function () {
        establishRoadsFromSpawnsToEnergySources();
        establishRoadsFromEnergySourcesToController();
        placeTowersNearSpawns();
        placeTowerNearController();
    }

    function establishRoadsFromSpawnsToEnergySources() {
        let spawns = room.find(FIND_MY_SPAWNS);
        let sources = room.find(FIND_SOURCES);

        for (let i = 0; i < spawns.length; i++) {
            let spawn = spawns[i];

            for (let i = 0; i < sources.length; i++) {
                let source = sources[i];

                establishRoad(spawn.pos, source.pos);
            }
        }
    }

    function establishRoadsFromEnergySourcesToController() {
        let sources = room.find(FIND_SOURCES);

        for (let i = 0; i < sources.length; i++) {
            let source = sources[i];
            establishRoad(source.pos, room.controller.pos);
        }

    }

    function establishRoad(from, to) {
        let path = room.findPath(from, to, { ignoreCreeps: true, ignoreRoads: true });

        for (let i = 0; i < path.length; i++) {
            let location = path[i];
            if (!isSomethingHere(location)) {
                establishRoadConstructionSite(location);
            }
        }
    }

    function isSomethingHere(location) {
        let objects = room.lookAt(location.x, location.y);
        return objects.length > 1;
    }

    function establishRoadConstructionSite(location) {
        let result = room.createConstructionSite(location.x, location.y, STRUCTURE_ROAD);

        if (result === OK) {
            console.log(`Road destined for ${location.x}, ${location.y}.`);
        } else {
            console.log(`Can't build road at ${location.x}, ${location.y}, because ${result}.`);
        }
    }

  function placeTowersNearSpawns() {
    let spawns = room.find(FIND_MY_SPAWNS);

    for (let i = 0; i < spawns.length; i++) {
      let spawn = spawns[i];

      let towerBuilt = false;
      let numTriesRemaining = 5;

      while (!towerBuilt && numTriesRemaining > 0) {
        if (!doesSpawnHaveTower(spawn)) {
          let desiredPosition = getPositionNearSpawn(spawn);

          if (!isSomethingHere(desiredPosition)) {
            if (placeTower(desiredPosition.x, desiredPosition.y)) {
              towerBuilt = true;
            }
          }
        }

        numTriesRemaining -= 1;
      }
    }
  }

    function placeTowerNearController() {
        let controller = room.controller;

        if (controller !== undefined && controller.my) {
            let desiredTowerPositions = getDesiredTowerPositions(controller);

            while (desiredTowerPositions.length > 0) {
                let desiredPosition = pickAPosition(desiredTowerPositions);
                if (isAvailableForTower(desiredPosition)) {
                    placeTower(desiredPosition.x, desiredPosition.y);
                    desiredTowerPositions = [];
                } else {
                    removePosition(desiredPosition, desiredTowerPositions);
                }
            }
        }
    }

    function getDesiredTowerPositions(controller) {
        let boundingBox = {
            topLeft: {
                x: controller.pos.x - 6,
                y: controller.pos.y - 6
            },
            bottomRight: {
                x: controller.pos.x + 6,
                y: controller.pos.y + 6
            }
        };

        let positions = [];

        for (let x = boundingBox.topLeft.x; x < boundingBox.bottomRight.x; x++) {
            for (let y = boundingBox.topLeft.y; y < boundingBox.bottomRight.y; y++) {
                let distance = Math.sqrt((x - controller.pos.x) * (x - controller.pos.x) + (y - controller.pos.y) * (y - controller.pos.y));

                if (distance > 4) {
                    positions.push({x: x, y: y});
                }
            }
        }

        return positions;
    }

    function pickAPosition(positions) {
        let index = Math.floor(Math.random() * positions.length);
        return positions[index];
    }

    function isAvailableForTower(desiredPosition) {
        return room.lookAt(desiredPosition.x, desiredPosition.y).length < 2;
    }

    function removePosition(desiredPosition, desiredTowerPositions) {
        let index = desiredTowerPositions.findIndex(position => position.x === desiredPosition.x && position.y === desiredPosition.y);
        if (index !== -1) {
            desiredTowerPositions.splice(index, 1);
        }
    }

  function doesSpawnHaveTower(spawn) {
    let boundingBox = {
      top: spawn.pos.y - 3,
      left: spawn.pos.x - 3,
      bottom: spawn.pos.y + 3,
      right: spawn.pos.x + 3
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

  function placeTower(x, y) {
    let result = room.createConstructionSite(x, y, STRUCTURE_TOWER);
    if (result === OK) {
      console.log(`Tower destined for ${x}, ${y}`);
      return true;
    } else {
      console.log(`Can't build tower at ${x}, ${y}, because ${result}.`);
      return false;
    }
  }
}

module.exports = Architect;
