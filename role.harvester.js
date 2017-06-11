let helpers = require('helpers');
let roles = require('constants').roles;

function run(creep) {
    let spawn = Game.spawns['Atl'];
        
    if (creep.carry.energy < creep.carryCapacity) {
        harvest(creep);
    } else if (creep.carry.energy === creep.carryCapacity) {
        decideWhatToDoNext(creep);        
    } else if (spawn.energy < spawn.energyCapacity) {
        deliver(creep, spawn);
    } else {
        creep.say("Waiting.");
    }    
}

function numberOfBuilders() {
    return helpers.numberOfCreepsInRole(roles.builder);
}

function numberOfConstructionSites(room) {
    return room.find(FIND_CONSTRUCTION_SITES).length;
}

function decideWhatToDoNext(creep) {
    if (numberOfBuilders() < (numberOfConstructionSites(creep.room) * (1/3))) {
        console.log(`Switching ${creep} to a ${roles.builder}.`);
        creep.memory.role = roles.builder;
    }
}

function harvest(creep) {

}

function deliver(creep, spawn) {
    if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn, { visualizePathStyle: { stroke: '#FFFFFF' } });
    }
}

let roleHarvester = {
    run: run
}

module.exports = roleHarvester;