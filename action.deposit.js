function run(creep) {
    if (creep.carry.energy === 0 && creep.memory.action === 'delivering') {
        console.log(`${creep} is out of energy, so is done with the job.`);
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
                console.log(`${creep} could not harvest energy: ${result}.`);
            }
        }
    } else {
        if (creep.carry.energy === 0) {
            console.log(`${creep} is out of energy, so is done with the job.`);
            creep.memory.action = undefined;
            creep.memory.job = undefined;
        } else {
            creep.memory.harvestTarget = undefined;
            let target = Game.getObjectById(creep.memory.job.target);

            if (target === null || target.energy === target.energyCapacity) {
                console.log(`${creep} gives up, because the deposit target is full.`);
                creep.memory.action = undefined;
                creep.memory.job = undefined;
            } else {
                let result = creep.transfer(target, RESOURCE_ENERGY);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else if (result !== OK) {
                    console.log(`${creep} could not transfer energy from ${target}: ${result}.`);
                }
            }
        }
    }
}

module.exports = {
    run: run
};
