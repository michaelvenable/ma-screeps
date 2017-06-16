function DeliverEnergyToSpawn(room) {
  this.assignJobs = function (peasants, ongoingJobs) {
    room.find(FIND_MY_SPAWNS)
      .filter(spawn => spawn.energy < spawn.energyCapacity)
      .forEach(spawn => {
        let job = {
          action: 'deposit',
          target: spawn.id
        };

        let remainingEnergy = spawn.energyCapacity - spawn.energy;

        // Calculate how much energy is remaining after the creeps assigned to the spawn have completed their job.
        peasants
          .filter(creep => creep.memory.job !== undefined)
          .filter(creep => creep.memory.job.action === 'deposit')
          .filter(creep => creep.memory.job.target === spawn.id)
          .forEach(creep => {
            if (creep.carry.energy > 0) {
              remainingEnergy -= creep.carry.energy;
            } else {
              remainingEnergy -= creep.carry.energyCapacity;
            }
          });

        // Find the most suitable creep for the job.

        // Most suitable - a creep with energy and no job.
        peasants
          .filter(creep => creep.carry.energy !== 0 && creep.memory.job === undefined)
          .forEach(creep => {
            if (remainingEnergy > 0) {
              assignJobToCreep(job, creep, 'he has energy and no job');
              remainingEnergy -= creep.carry.energy;
            }
          });

        // Next, we will re-assign any creeps who have a job and have some energy.
        peasants
          .filter(creep => creep.carry.energy >= 10)
          .filter(creep => creep.memory.job !== undefined && creep.memory.job.action !== 'deposit' && creep.memory.job.target !== spawn.id)
          .forEach(creep => {
            if (remainingEnergy > 0) {
              assignJobToCreep(job, creep, 'he has spare energy');
              remainingEnergy -= creep.carry.energy;
            }
          });

        // If there is still energy remaining in the spawn, then find creeps with no job and have them deliver some energy.
        peasants
          .filter(creep => creep.memory.job === undefined)
          .forEach(creep => {
            if (remainingEnergy > 0) {
              assignJobToCreep(job, creep, 'because he has no job');
              remainingEnergy -= creep.carry.energyCapacity;
            }
          });
      });
  }

  function assignJobToCreep(job, creep, reason) {
    creep.memory.job = job;
    creep.memory.action = undefined;

    if (reason === undefined) {
      console.log(`${creep} is tasked with ${job.action} to ${job.target} (spawn)`);
    } else {
      console.log(`${creep} is tasked with ${job.action} to ${job.target}, because ${reason}.`);
    }
  }
}

module.exports = DeliverEnergyToSpawn;
