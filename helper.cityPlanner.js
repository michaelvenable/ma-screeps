let CityPlanner = function () {

    this.assignJobs = function (room) {
        let jobs = [];

        let ongoingJobs = getOngoingJobsInRoom(room);

        // If there is more than one creep, then always have at least one creep upgrading the controller.
        let numOfCreeps = room.find(FIND_MY_CREEPS).filter(c => c.memory.role === 'peasant').length;

        if (numOfCreeps > 1) {
            let newJob =  {
                action: 'upgrade',
                target: room.controller.id
            };
            if (!ongoingJobs.contains(newJob)) {
                let waitingCreeps = room.find(FIND_MY_CREEPS)
                    .filter(c => c.memory.role === 'peasant')
                    .filter(c => c.memory.job === undefined)
                if (waitingCreeps.length > 0) {
                    let creep = waitingCreeps[0];
                    creep.memory.job = newJob;
                    console.log(`${creep} is tasked with ${newJob.action} to ${newJob.target} (controller)`);
                }
            }
        }

        // Priority 1: Make sure the spawns have energy
        room.find(FIND_MY_SPAWNS)
            .filter(s => s.energy < s.energyCapacity)
            .forEach(s => {
                let newJob = {
                    action: 'deposit',
                    target: s.id
                };

                let remainingEnergy = s.energyCapacity - s.energy;

                // Calculate how much energy is remaining after the creeps assigned to the spawn have completed their job.
                room.find(FIND_MY_CREEPS)
                    .filter(c => c.memory.role === 'peasant')
                    .filter(c => c.memory.job !== undefined && c.memory.job.action === 'deposit' && c.memory.job.target === s.id)
                    .forEach(c => {
                        if (c.carry.energy > 0) {
                            remainingEnergy -= c.carry.energy;
                        } else {
                            remainingEnergy -= c.carry.energyCapacity;
                        }
                    });

                // Find the most suitable creep for the job.

                // Most suitable - a creep with energy and no job.
                room.find(FIND_MY_CREEPS)
                    .filter(c => c.memory.role === 'peasant')
                    .filter(c => c.carry.energy !== 0 && c.memory.job === undefined)
                    .forEach(c => {
                        if (remainingEnergy > 0) {
                            console.log(`${c} is tasked with ${newJob.action} to ${newJob.target}, because he has energy and no job.`);
                            c.memory.job = newJob;
                            remainingEnergy -= c.carry.energy;
                        }
                    });

                // Next, we will re-assign any creeps who have a job and have some energy.
                if (remainingEnergy > 0) {
                    room.find(FIND_MY_CREEPS)
                        .filter(c => c.memory.role === 'peasant')
                        .filter(c => c.carry.energy > 25 && c.memory.job.action !== 'deposit')
                        .forEach(c => {
                            if (remainingEnergy > 0) {
                                console.log(`${c} is re-assigned with ${newJob.action} to ${newJob.target}, because he has spare energy.`);
                                c.memory.job = newJob;
                                remainingEnergy -= c.carry.energy;
                            }
                        })
                }

                // If there is still energy remaining in the spawn, then find creeps with no energy and have them deliver some energy.
                if (remainingEnergy > 0) {
                    room.find(FIND_MY_CREEPS)
                        .filter(c => c.memory.role === 'peasant')
                        .filter(c => c.memory.job === undefined)
                        .forEach(c => {
                            if (remainingEnergy > 0) {
                                console.log(`${c} is tasked with ${newJob.action} to ${newJob.target}, because he has no job.`);
                                c.memory.job = newJob;
                                remainingEnergy -= c.carry.energyCapacity;
                            }
                        });
                }
            });

        room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } })
            .filter(s => s.energy < s.energyCapacity)
            .forEach(s => {
                let newJob = {
                    action: 'deposit',
                    target: s.id
                };

                let remainingEnergy = s.energyCapacity - s.energy;

                // Calculate how much energy is remaining after the creeps assigned to the spawn have completed their job.
                room.find(FIND_MY_CREEPS)
                    .filter(c => c.memory.job !== undefined && c.memory.job.action === 'deposit' && c.memory.job.target === s.id)
                    .filter(c => c.memory.role === 'peasant')
                    .forEach(c => {
                        if (c.carry.energy > 0) {
                            remainingEnergy -= c.carry.energy;
                        } else {
                            remainingEnergy -= c.carry.energyCapacity;
                        }
                    });

                // Find the most suitable creep for the job.

                // Most suitable - a creep with energy and no job.
                if (remainingEnergy > 0) {
                    room.find(FIND_MY_CREEPS)
                        .filter(c => c.memory.role === 'peasant')
                        .filter(c => c.carry.energy !== 0 && c.memory.job === undefined)
                        .forEach(c => {
                            if (remainingEnergy > 0) {
                                console.log(`${c} is tasked with ${newJob.action} to ${newJob.target}`);
                                c.memory.job = newJob;
                                remainingEnergy -= c.carry.energy;
                            }
                        });
                }

                // Next, we will re-assign any creeps who have a job and have some energy.
                if (remainingEnergy > 0) {
                    room.find(FIND_MY_CREEPS)
                        .filter(c => c.memory.role === 'peasant')
                        .filter(c => c.carry.energy > 25 && c.memory.job.action !== 'deposit')
                        .forEach(c => {
                            if (remainingEnergy > 0) {
                                console.log(`${c} is re-assigned with ${newJob.action} to ${newJob.target}, because he has spare energy.`);
                                c.memory.job = newJob;
                                remainingEnergy -= c.carry.energy;
                            }
                        })
                }

                // If there is still energy remaining in the spawn, then find creeps with no energy and have them deliver some energy.
                if (remainingEnergy > 0) {
                    room.find(FIND_MY_CREEPS)
                        .filter(c => c.memory.role === 'peasant')
                        .filter(c => c.memory.job === undefined)
                        .forEach(c => {
                            if (remainingEnergy > 0) {
                                console.log(`${c} is tasked with ${newJob.action} to ${newJob.target}`);
                                c.memory.job = newJob;
                                remainingEnergy -= c.carry.energyCapacity;
                            }
                        });
                }
            });

        // Next, work on construction sites.
        room.find(FIND_MY_CONSTRUCTION_SITES)
            .forEach(s => {
                let newJob = {
                    action: 'build',
                    target: s.id
                };

                if (!ongoingJobs.contains(newJob)) {
                    let remainingProgress = s.progressTotal - s.progress;

                    // Find the most suitable creeps for the job.

                    // The most suitable have energy and no job.
                    room.find(FIND_MY_CREEPS)
                        .filter(c => c.memory.role === 'peasant')
                        .filter(c => c.carry.energy !== 0 && c.memory.job === undefined)
                        .forEach(c => {
                            if (remainingProgress > 0) {
                                console.log(`${c} is tasked with ${newJob.action} to ${newJob.target}`);
                                c.memory.job = newJob;
                                remainingProgress -= c.carry.energy;
                            }
                        });

                    // If there is still energy remaining in the spawn, then find creeps with no energy and have them deliver some energy.
                    if (remainingProgress > 0) {
                        room.find(FIND_MY_CREEPS)
                            .filter(c => c.memory.role === 'peasant')
                            .filter(c => c.memory.job === undefined)
                            .forEach(c => {
                                if (remainingProgress > 0) {
                                    console.log(`${c} is tasked with ${newJob.action} to ${newJob.target}`);
                                    c.memory.job = newJob;
                                    remainingProgress -= c.carry.energyCapacity;
                                }
                            });
                    }
                }
            })

        // Have the remaining creeps with nothing to do upgrade the tower.
        room.find(FIND_MY_CREEPS)
            .filter(c => c.memory.role === 'peasant')
            .filter(c => c.memory.job === undefined)
            .forEach(c => {
                let newJob = {
                    action: 'upgrade',
                    target: room.controller.id
                };

                console.log(`${c} is tasked with ${newJob.action} to ${newJob.target}, because there is nothing else to do.`);
                c.memory.action = undefined;
                c.memory.job = newJob;
            });
    };

    function getOngoingJobsInRoom(room) {
        return new JobList(room);
    }

};

function JobList(room) {
    this.jobs = [];

    room.find(FIND_MY_CREEPS)
        .filter(c => c.memory.job !== undefined)
        .forEach(c => this.jobs.push(c.memory.job));
}

JobList.prototype.contains = function (job) {
    return this.jobs
        .filter(t => t.action === job.action && t.target === job.target)
        .length > 0;
}

module.exports = CityPlanner;
