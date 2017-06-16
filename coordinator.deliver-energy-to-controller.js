function DeliverEnergyToController(room) {
    this.assignJobs = function (peasants) {

        if (room.controller === undefined) {
            return;
        }

        let task =  {
            action: 'upgrade',
            target: room.controller.id
        };

        // If there is more than one creep, then always have at least one creep upgrading the controller.
        if (peasants.length < 2) {
            return;
        }

        let numCreepsUpgradingController = peasants.filter(creep => creep.memory.job !== undefined)
            .filter(creep => creep.memory.job.action === task.action && creep.memory.job.target === task.target).length;

        if (numCreepsUpgradingController > 0) {
            return;
        }

        let waitingCreeps = peasants.filter(creep => creep.memory.job === undefined);

        if (waitingCreeps.length > 0) {
            assignTaskToCreep(task, waitingCreeps[0]);
        }
    }

    function assignTaskToCreep(task, creep) {
        creep.memory.job = task;
        creep.memory.action = undefined;
        console.log(`${creep} is tasked with ${task.action} to ${task.target} (controller).`);
    }
}

module.exports = DeliverEnergyToController;
