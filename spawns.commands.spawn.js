let roles = require('constants').roles;

function run() {
    console.log("Command started: spawns.spawn.");

    let idleSpawns = getAllSpawns().filter(s => !s.spawning);

    idleSpawns.forEach(spawn => {
        let numPeasantsInRoom = spawn.room.find(FIND_MY_CREEPS)
                                    .filter(creep => creep.memory.role === 'peasant')
                                    .length;

        let plan = Memory.spawns.currentPlan;

        if (numPeasantsInRoom >= plan.count) {
            return;
        }

        if (spawn.room.energyAvailable >= getCost(plan.parts)) {
            let memory = {
                role: roles.peasant,
            };

            let result = spawn.createCreep(plan.parts, undefined, memory);
            console.log(`  \u2514 Spawning a peasant: ${JSON.stringify(plan.parts)}: ${result}`);
        }
    });
}

function getCost(parts) {
    return parts.reduce((sum, part) => sum + BODYPART_COST[part], 0);
}

function getAllSpawns() {
    let spawns = [];

    for (let name in Game.spawns) {
        spawns.push(Game.spawns[name]);
    }

    return spawns;
}

module.exports = run;
