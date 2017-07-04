function DeliverEnergyToTowers(room) {
    this.assignJobs = function (peasants) {
        room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER }})
            .forEach(tower => assignWorkersToTowerIfNeeded(tower, peasants));
    }

    function assignWorkersToTowerIfNeeded(tower, peasants) {
        if (tower.energy < tower.energyCapacity) {
            assignWorkersToTower(tower, peasants);
        }
    }

    function assignWorkersToTower(tower, peasants) {
        let task = {
            action: 'deposit',
            target: tower.id
        };

        let remainingEnergy = tower.energyCapacity - tower.energy;

        // start with peasants who have energy and no task.
        peasants
            .filter(creep => creep.carry.energy > 0 && creep.memory.job === undefined)
            .forEach(creep => {
                if (remainingEnergy > 0) {
                    assignTaskToCreep(task, creep);
                    remainingEnergy -= creep.carry.energy;
                }
            });

        // Next, add peasants who have no energy and no job.
        peasants
            .filter(creep => creep.memory.job === undefined)
            .forEach(creep => {
                if (remainingEnergy > 0) {
                    assignTaskToCreep(task, creep);
                    remainingEnergy -= creep.carry.energyCapacity;
                }
            });
    }

    function assignTaskToCreep(task, creep, reason) {
        creep.memory.job = task;
        creep.memory.action = undefined;

        if (reason === undefined) {
            console.log(`${creep} is tasked with ${task.action} to ${task.target} (tower).`);
        } else {
            console.log(`${creep} is tasked with ${task.action} to ${task.target} (tower), because ${reason}.`);
        }
    }
}

module.exports = DeliverEnergyToTowers;
