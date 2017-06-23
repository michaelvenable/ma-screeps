let roles = require('constants').roles;

let builds = require('constants').builds;
let buildCosts = require('constants').buildCosts;

/**
 * Advances a spawn point one tick.
 */
function run(spawn) {
    if (spawn.spawning) {
        return;
    }

    cleanUpDeadCreeps();
    spawnPeasantIfNeeded(spawn);
}

function cleanUpDeadCreeps() {
    for (let creepName in Memory.creeps) {
        let creep = Memory.creeps[creepName];
        if (Game.creeps[creepName] === undefined) {
            delete Memory.creeps[creepName];
        }
    }
}

function spawnPeasantIfNeeded(spawn) {
    let peasants = spawn.room.find(FIND_MY_CREEPS).filter(creep => creep.memory.role === 'peasant');

    if (peasants.length < 20) {
        spawnPeasant(spawn, peasants);
        return;
    }
}

function spawnPeasant(spawn, peasants) {
    if (spawn.room.energyCapacityAvailable >= buildCosts.peasant[1] && peasants.length > 2) {
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
 * Provides the AI for spawns.
 */
let spawn = {
    run: run
};

module.exports = spawn;

