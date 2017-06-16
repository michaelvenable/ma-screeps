function AssignWaitingPeasantsToUpgradeController(room) {
  let job = {
    action: 'upgrade',
    target: room.controller.id
  };

  this.assignJobs = function (peasants) {
    peasants
      .filter(creep => creep.memory.job === undefined)
      .forEach(creep => {
        assignJobToCreep(job, creep, 'there is nothing else to do');
      });
  };

  function assignJobToCreep(job, creep, reason) {
    creep.memory.job = job;
    creep.memory.action = undefined;

    if (reason === undefined) {
      console.log(`${creep} is tasked with ${job.action} to ${job.target} (controller).`);
    } else {
      console.log(`${creep} is tasked with ${job.action} to ${job.target}, because ${reason}.`);
    }
  }
}

module.exports = AssignWaitingPeasantsToUpgradeController;
