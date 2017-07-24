let log = require('performance').log;
let worklist = require('models.worklist');

Memory.spawns = Memory.spawns || {};

if (Memory.spawns.currentPlan === undefined) {
    Memory.spawns.currentPlan = {
        count: 1,
        parts: [WORK, CARRY, MOVE]
    };
}

function run() {
    console.log("Command started: spaces.next-plan");

    if (Memory.spawns.timeOfLastBuildChange === undefined) {
        Memory.spawns.timeOfLastBuildChange = Game.time;
        log.reset('harvested');
        console.log("spawns.next-plan: Quitting early. timeOfLastBuildChange is undefined.");
        return;
    }

    if (Memory.spawns.buildPlans === undefined) {
        worklist.add('spawns', 'plan');
        console.log("spawns.next-plan: Quitting early. No build plans.");
        return;
    }

    if (Memory.spawns.buildPlans.length === 0) {
        // Set the current plan to the best performing plan and plan the next mutants.
        let history = Memory.spawns.history.sort(function (a, b) {
            if (a.production > b.production) {
                return -1;
            } else if (a.production < b.production) {
                return 1;
            }

            return 0;
        });

        let best = history[0];

        console.log(`Best plan is ${JSON.stringify(best)}.`);

        Memory.spawns.currentPlan = best.build;

        worklist.add('spawns', 'plan');

        // Clear performance history.
        Memory.spawns.history = [];

        return;
    }

    // Calculate production rate of current build.
    let amountHarvested = log.get('harvested');
    let runTime = Game.time - Memory.spawns.timeOfLastBuildChange;
    let productionRate = amountHarvested / runTime;

    console.log("Production rate is ", productionRate);

    let history = Memory.spawns.history || [];
    history.push({
        build: Memory.spawns.currentPlan,
        production: productionRate
    });
    Memory.spawns.history = history;

    Memory.spawns.currentPlan = Memory.spawns.buildPlans.shift();
    Memory.spawns.timeOflastBuildChange = Game.time;
    log.reset('harvested');

    console.log(`spawns.next-plan: Current plan is: ${JSON.stringify(Memory.spawns.currentPlan)}.`);
}

module.exports = run;
