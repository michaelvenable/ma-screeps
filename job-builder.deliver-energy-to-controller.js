function DeliverEnergyToController(room) {
  let job =  {
    action: 'upgrade',
    target: room.controller.id
  };

  this.assignJobs = function (peasants, ongoingJobs) {
    // If there is more than one creep, then always have at least one creep upgrading the controller.
    if (peasants.length < 2)
      return;

    if (ongoingJobs.contains(job))
      return;

    let waitingCreeps = peasants.filter(creep => creep.memory.job === undefined);

    if (waitingCreeps.length > 0) {
      assignJobToCreep(job, waitingCreeps[0]);
    }
  }

  function assignJobToCreep(job, creep) {
    creep.memory.job = job;
    creep.memory.action = undefined;
    console.log(`${creep} is tasked with ${job.action} to ${job.target} (controller).`);
  }
}

module.exports = DeliverEnergyToController;
