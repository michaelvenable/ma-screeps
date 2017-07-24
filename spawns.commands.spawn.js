let roles = require('constants').roles;

function run() {
    console.log("Command started: spawns.spawn.");

    let spawns = [];

    for (let name in Game.spawns) {
        spawns.push(Game.spawns[name]);
    }

    spawns.forEach(spawn => {
        if (spawn.spawning) {
            return;
        }

        let numPeasants = spawn.room.find(FIND_MY_CREEPS).filter(creep => creep.memory.role === 'peasant').length;

        let plan = Memory.spawns.currentPlan;

        if (numPeasants >= plan.count) {
            return;
        }

        if (spawn.room.energyAvailable >= getCost(plan.parts)) {
            let memory = {
                role: roles.peasant,
            };

            let result = spawn.createCreep(plan.parts, undefined, memory);
            console.log(`Architect: Spawning a peasant: ${JSON.stringify(plan.parts)}: ${result}`);
        }
    });
}

function getCost(parts) {
    return parts.reduce((sum, part) => sum + BODYPART_COST[part], 0);
}

module.exports = run;
