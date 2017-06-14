function AssignWaitingPeasantsToUpgradeController(room) {
  let job = {
    action: 'upgrade',
    target: room.controller.id
  };

  this.assignJobs = function (peasants, ongoingJobs) {
    peasants
      .filter(creep => creep.memory.job === undefined)
      .forEach(creep => {
        assignJobToCreep(job, creep, 'there is nothing else to do');
      });
  };

  function assignJobToCreep(job, creep, reason) {
    creep.memory.job = job;
    c.memory.action = undefined;

    if (reason === undefined) {
      console.log(`${creep} is tasked with ${newJob.action} to ${newJob.target} (spawn)`);
    } else {
      console.log(`${creep} is tasked with ${newJob.action} to ${newJob.target}, because ${reason}.`);
    }
  }
}

module.exports = AssignWaitingPeasantsToUpgradeController;
