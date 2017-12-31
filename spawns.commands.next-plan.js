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

    if (Memory.spawns.buildPlans === undefined) {
        worklist.add('spawns', 'spawns.plan');
        console.log("  \u2514 Quitting early. No build plans. You should run 'plan' first.");
        return;
    }

    if (Memory.spawns.buildPlans.length === 0) {
        // Set the current plan to the best performing plan and plan the next mutants.
        let history = Memory.spawns.history.sort(function (a, b) {
            return b.production - a.production;
        });

        let best = history[0];

        let message = `Best plan is ${JSON.stringify(best)}.`;
        Game.notify(message);

        Memory.spawns.currentPlan = best.build;

        worklist.add('spawns', 'spawns.plan');

        // Clear performance history.
        Memory.spawns.history = [];

        Memory.spawns.timeToStartWorkerProductivityMeasurements = Game.time + 1600;
        Memory.spawns.timeToStopWorkerProductivityMeasurements = Game.time + 2600;

        return;
    }

    // Calculate production rate of current build.
    let amountHarvested = log.get('harvested');
    let runTime = Memory.spawns.timeToStopWorkerProductivityMeasurements - Memory.spawns.timeToStartWorkerProductivityMeasurements;
    let productionRate = amountHarvested / runTime;

    let message = `${JSON.stringify(Memory.spawns.currentPlan)} performed at ${productionRate}.`;
    Game.notify(message);

    let history = Memory.spawns.history || [];
    history.push({
        build: Memory.spawns.currentPlan,
        production: productionRate
    });
    Memory.spawns.history = history;

    Memory.spawns.currentPlan = Memory.spawns.buildPlans.shift();

    Memory.spawns.timeToStartWorkerProductivityMeasurements = Game.time + 1600;
    Memory.spawns.timeToStopWorkerProductivityMeasurements = Game.time + 1600;

    log.reset('harvested');

    console.log(`spawns.next-plan: Current plan is: ${JSON.stringify(Memory.spawns.currentPlan)}.`);
}

module.exports = run;
