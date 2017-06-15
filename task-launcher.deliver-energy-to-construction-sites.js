function DeliverEnergyToConstructionSites(room) {
  this.assignJobs = function (peasants) {
    room.find(FIND_MY_CONSTRUCTION_SITES)
      .forEach(site => {
        let job = {
          action: 'build',
          target: site.id
        };

        let remainingProgress = site.progressTotal - site.progress;

        // How much energy is on route to this site.
        peasants
          .filter(creep => creep.memory.job !== undefined)
          .filter(creep => creep.memory.job.action === 'build' && creep.memory.job.target === site.id)
          .forEach(creep => {
            if (creep.carry.energy > 0) {
              remainingProgress -= creep.carry.energy;
            } else {
              remainingProgress -= creep.carry.carryCapacity;
            }
          });

        // The most suitable have energy and no job.
        peasants
          .filter(creep => creep.carry.energy > 0 && creep.memory.job === undefined)
          .forEach(creep => {
            if (remainingProgress > 0) {
              assignJobToCreep(job, creep);
              remainingProgress -= creep.carry.energy;
            }
          });

        // If there is still work to be done, then find creeps with no energy and have them deliver some
        // energy.
        peasants
          .filter(creep => creep.memory.job === undefined)
          .forEach(creep => {
            if (remainingProgress > 0) {
              assignJobToCreep(job, creep);
              remainingProgress -= creep.carry.energyCapacity;
            }
          });
      });
  };

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

module.exports = DeliverEnergyToConstructionSites;
