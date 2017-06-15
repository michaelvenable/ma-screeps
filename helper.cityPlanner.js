let DeliveryEnergyToController = require('task-launcher.deliver-energy-to-controller');
let DeliverEnergyToSpawn = require('task-launcher.deliver-energy-to-spawn');
let DeliverEnergyToExtensions = require('task-launcher.deliver-energy-to-extensions');
let DeliverEnergyToConstructionSites = require('task-launcher.deliver-energy-to-construction-sites');
let AssignWaitingPeasantsToUpgradeController = require('task-launcher.assign-waiting-peasants-to-upgrade-controller');

let CityPlanner = function () {

  this.assignJobs = function (room) {
    let taskLaunchers = [
      new DeliveryEnergyToController(room),
      new DeliverEnergyToSpawn(room),
      new DeliverEnergyToExtensions(room),
      new DeliverEnergyToConstructionSites(room),
      new AssignWaitingPeasantsToUpgradeController(room)
    ];

    let peasants = room.find(FIND_MY_CREEPS).filter(creep => creep.memory.role === 'peasant');
    let ongoingJobs = new JobList(room);

    taskLaunchers.forEach(builder => builder.assignJobs(peasants, ongoingJobs));
  };
};

function JobList(room) {
    this.jobs = [];

    room.find(FIND_MY_CREEPS)
        .filter(c => c.memory.job !== undefined)
        .forEach(c => this.jobs.push(c.memory.job));
}

JobList.prototype.contains = function (job) {
    return this.jobs
        .filter(j => j.action === job.action && j.target === job.target)
        .length > 0;
}

module.exports = CityPlanner;
