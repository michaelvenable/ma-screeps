let log = require('performance').log;
let worklist = require('models.worklist');

Memory.spawns = Memory.spawns || {};

if (Memory.spawns.currentPlan === undefined) {
    Memory.spawns.currentPlan = {
        count: 20,
        parts: [WORK, CARRY, MOVE]
    };
}

function run() {
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

    // Calculate production rate of current build.
    let amountHarvested = log.get('harvested');
    let runTime = Game.time - Memory.spawns.timeOfLastBuildChange;
    let productionRate = amountHarvested / runTime;

    console.log("Production rate is ", productionRate);

    let history = Memory.spawns.history || [];
    history.push({
        build: Memory.spawns.currentBuild,
        production: productionRate
    });
    Memory.spawns.history = history;

    Memory.spawns.currentPlan = Memory.spawns.buildPlans.shift();
    Memory.spawns.timeOflastBuildChange = Game.time;
    log.reset('harvested');

    console.log(`spawns.next-plan: Current plan is: ${JSON.stringify(Memory.spawns.currentPlan)}.`);

    if (Memory.spawns.buildPlans === undefined) {
        worklist.add('spawns', 'plan');
        return;
    }
}

module.exports = run;