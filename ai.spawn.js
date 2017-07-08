let roles = require('constants').roles;

let builds = require('constants').builds;

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
    let numPeasants = spawn.room.find(FIND_MY_CREEPS).filter(creep => creep.memory.role === 'peasant').length;

    if (numPeasants < 3) {
        // Spawn a few level 0 peasants just to kick things off.
        let build = builds.peasant[0];
        let result = spawn.createCreep(build.parts, undefined, { role: roles.peasant });
        console.log(`Architect: Spawning a level 0 peasant, because we have no peasants: ${result}`);
        return;
    }

    for (let level = builds.peasant.length - 1; level >= 0; level--) {
        let build = builds.peasant[level];

        if (spawn.room.energyCapacityAvailable >= build.getCost()) {
            if (spawn.room.energyAvailable >= build.getCost()) {
                if (numPeasants >= build.count) {
                    // Already have enough peasants. Quit.
                    return;
                }

                let memory = {
                    role: roles.peasant,
                    level: level
                };

                let result = spawn.createCreep(build.parts, undefined, { role: roles.peasant });
                console.log(`Architect: Spawning a level ${level} peasant: ${result}`);

                // We've spawned a peasant. Quit.
                return;
            } else {
                // We don't have enough energy saved up. Quit.
                return;
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

