let roles = require('constants').roles;
let helpers = require('helpers');

function numberOfBuilders() {
    return helpers.numberOfCreepsInRole(roles.builder);
}

function numberOfConstructionSites(room) {
    return room.find(FIND_CONSTRUCTION_SITES).length;
}

function run(creep) {
    if (numberOfBuilders() < (numberOfConstructionSites(creep.room) * (1/3))) {
        console.log("Switching ", creep.name, " to a builder.");
        creep.memory.role = roles.builder;
        creep.memory.state = undefined;
    }
    
    
    if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.state = 'upgrading';
    }
    
    if (creep.carry.energy === 0) {
        creep.memory.state = 'harvesting';
    }
    
    if (creep.memory.state === 'harvesting') {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
    else {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#FFFFFF' } });
        }
    }    
}

module.exports = {
    run: run
};