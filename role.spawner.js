let roles = require('constants').roles;

let builds = require('constants').builds;
let buildCosts = require('constants').buildCosts;

function spawnPeasant(spawn) {
    let numPeasants = spawn.room.find(FIND_MY_CREEPS)
        .filter(c => c.memory.role === 'peasant')
        .length;
        
    if (spawn.room.energyCapacityAvailable >= buildCosts.peasant[1] && numPeasants > 2) {
        if (spawn.room.energyAvailable > buildCosts.peasant[1]) {
            console.log("Spawning a peasant.");
            let result = spawn.createCreep(builds.peasant[1], undefined, { role: roles.peasant });
            if (result !== OK) {
                console.log(`${spawn} created a level 2 peasant: ${result}`);
            }
        }
    } else {
        if (spawn.room.energyAvailable > buildCosts.peasant[0]) {
            console.log("Spawning a peasant.");
            let result = spawn.createCreep(builds.peasant[0], undefined, { role: roles.peasant });
            if (result !== OK) {
                console.log(`${spawn} created a level 1 peasant: ${result}`);
            }
        }
    }
}

/**
 * Advances a spawn point one tick.
 */
function run(spawn) {
    if (spawn.spawning) {
        return;
    }
    
    cleanUpDeadCreeps();

    if (numberOfPeasants(spawn.room) < 10) {
        spawnPeasant(spawn);
        return;
    }
    
    if (numberOfGuards(spawn.room) < 4) {
        spawnGuard(spawn);
        return;
    }
    
    if (numberOfPeasants(spawn.room) < 25) {
        spawnPeasant(spawn);
        return;
    }
}

function cleanUpDeadCreeps() {
    for (let creepName in Memory.creeps) {
        let creep = Memory.creeps[creepName];
        if (Game.creeps[creepName] === undefined) {
            delete Memory.creeps[creepName];
        }
    }
}

function numberOfPeasants(room) {
    return room.find(FIND_MY_CREEPS).filter(c => c.memory.role === 'peasant').length;
}

function numberOfGuards(room) {
    return room.find(FIND_MY_CREEPS).filter(c => c.memory.role === 'guard').length;
}

function spawnGuard(spawn) {
    if (spawn.room.energyAvailable >= buildCosts.guard[0]) {
        console.log("Spawning a guard.");
        let result = spawn.createCreep(builds.guard[0], undefined, { role: 'guard' });
        if (result !== OK) {
            console.log(`${spawn} created a level 1 guard: ${result}.`);
        }
    }
}

module.exports = {
    run: run
}