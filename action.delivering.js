let performance = require('performance');

function run(creep) {
    if (creep.carry.energy === 0 && creep.memory.action === 'delivering') {
        console.log(`${creep} is out of energy, so is done with the job (1).`);
        creep.memory.action = undefined;
        creep.memory.job = undefined;
        return;
    }

    if (creep.carry.energy === creep.carryCapacity && creep.memory.action === 'harvesting') {
        creep.memory.action = 'delivering';
    }
    if (creep.memory.action === undefined) {
        creep.memory.action = 'harvesting';
    }

    if (creep.memory.action === 'harvesting') {
        let sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
            let target;
            if (creep.memory.harvestTarget !== undefined) {
                 target = Game.getObjectById(creep.memory.harvestTarget);
            } else {
                target = sources[Math.floor(Math.random() * sources.length)];
            }
            creep.memory.harvestTarget = target.id;
            let result = creep.harvest(target);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (result !== OK) {
                console.log(`${creep} could not harvest energy from ${target}: ${result}.`);
            } else {
                performance.log.append('harvest', 1);
            }
        }
    } else {
        if (creep.carry.energy === 0) {
            console.log(`${creep} is out of energy, so is done with the job (2).`);
            creep.memory.action = undefined;
            creep.memory.job = undefined;
        } else {
            creep.memory.harvestTarget = undefined;
            let target = Game.getObjectById(creep.memory.job.target);
            let result = creep.upgradeController(target);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (result !== OK) {
                console.log(`${creep} could not upgrade: ${result}.`);
            }
        }
    }
}

module.exports = {
    run: run
};
