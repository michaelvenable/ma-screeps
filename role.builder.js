let roles = require('constants').roles;

function getSpawnInRoom(room) {
    let spawns = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
    
    if (spawns.length > 0) {
        return spawns[0];
    } else {
        return null;
    }
}

function getIdealStorageLocation(room) {

    /**
    let spawn = getSpawnInRoom(room);
    
    if (spawn !== null) {
        for (let x = 2; x < 5; x++) {
            for (let y = 2; y < 5; y++) {
                let desiredLocation = { x: spawn.pos.x + x, y: spawn.pos.y + y };
                let objectsAtLocation = room.lookAt(desiredLocation.x, desiredLocation.y);
                
                let onlyTerrainAtThisLocation = (objectsAtLocation.length === 1);
                if (onlyTerrainAtThisLocation) {
                    return room.getPositionAt(desiredLocation.x, desiredLocation.y);
                }            
            }
        }

    }
    */
    
    return null;
}

function run(creep) {
    let site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (site === null) {
        creep.memory.role = roles.upgrader;
    }
    
    console.log(`${creep.name} is going build at ${site.pos}`);
    let result = creep.build(site);
    if (result === ERR_NOT_IN_RANGE) {
        creep.moveTo(site);
    } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
        console.log(`Swtiching ${creep.name} to harvester, because there are not enough resources to build.`);
        creep.memory.role = roles.harvester;
    } else if (result !== OK) {
        console.log(`${creep} couldn't build, because ${result}`);
    }
    return;
    /*
    if (creep.room.storage !== undefined) {
        creep.say("Skip Me");
        return;
    }
    
    let locationOfNextStorage = getIdealStorageLocation(creep.room);

    if (locationOfNextStorage === null) {
        console.log("No ideal place to build.");
        return;
    }
    
    console.log("Creating storage location", locationOfNextStorage);
    let result = creep.room.createConstructionSite(locationOfNextStorage, STRUCTURE_EXTENSION);
    if (result === ERR_RCL_NOT_ENOUGH) {
        console.log("Not high enough level for an extension structure.");
        creep.memory.role = roles.upgrader;
        creep.say("-> Upgrader");
    } else {
        console.log("Unable to build the construction site: ", result);
    }
    */
}

module.exports = {
    run: run
}