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
    establishRoad: establishRoad,
    establishRoadConstructionSite: establishRoadConstructionSite,
    isSomethingHere: isSomethingHere,
    placeTower: placeTower
};
