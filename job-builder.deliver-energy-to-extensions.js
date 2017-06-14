function DeliverEnergyToExtensions(room) {
  this.assignJobs = function (peasants) {
    room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } })
      .filter(spawn => spawn.energy < spawn.energyCapacity)
      .forEach(spawn => {
        let job = {
          action: 'deposit',
          target: spawn.id
        };

        let remainingEnergy = s.energyCapacity - s.energy;

        // Calculate how much energy is remaining after the creeps assigned to the spawn have completed their job.
        peasants
          .filter(creep => creep.memory.job !== undefined && creep.memory.job.action === 'deposit' && creep.memory.job.target === s.id)
          .forEach(creep => {
            if (creep.carry.energy > 0) {
              remainingEnergy -= creep.carry.energy;
            } else {
              remainingEnergy -= creep.carry.energyCapacity;
            }
          });

          // Most suitable - a creep with energy and no job.
          peasants
            .filter(creep => creep.carry.energy !== 0 && creep.memory.job === undefined)
            .forEach(creep => {
              if (remainingEnergy > 0) {
                assignJobToCreep(job, creep);
                remainingEnergy -= creep.carry.energy;
              }
            });

          // Next, we will re-assign any creeps who have a job and have some energy.
          peasants
            .filter(creep => creep.carry.energy > 0 && creep.memory.job.action !== 'deposit')
            .forEach(creep => {
              if (remainingEnergy > 0) {
                assignJobToCreep(job, creep)
                remainingEnergy -= creep.carry.energy;
              }
            });

            // If there is still energy remaining in the spawn, then find creeps with no energy and have them deliver some energy.
            peasants
              .filter(creep => creep.memory.job === undefined)
              .forEach(creep => {
                if (remainingEnergy > 0) {
                  assignJobToCreep(job, creep);
                  remainingEnergy -= c.carry.energyCapacity;
                }
              });
      });
  };

  function assignJobToCreep(job, creep) {
    creep.memory.job = job;
    creep.memory.action = undefined;
    console.log(`${creep} is tasked with ${job.action} to ${job.target}`);
  }
}

module.exports = DeliverEnergyToExtensions;
