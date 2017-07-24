Memory.spawns = Memory.spawns || {};

/**
 * Creates a variety of body builds that can be tested to see if they are better than the build we are
 * currently using.
 */
function run() {
    console.log("Command started: spawns.plan.");

    let currentPlan = Memory.spawns.currentPlan;
    if (currentPlan === undefined) {
        currentPlan = {
            count: 1,
            parts: [WORK, CARRY, MOVE]
        };
    }

    let plans = [];

    // Increase the count by 1.
    plans.push({
        count: currentPlan.count + 1,
        parts: currentPlan.parts
    });

    // Decrease the count by 1.
    plans.push({
        count: currentPlan.count - 1,
        parts: currentPlan.parts
    });

    // Add one of each body part to the plan.
    [WORK, CARRY, MOVE].forEach(bodyPart => {
        let nextBuild = [bodyPart];
        currentPlan.parts.forEach(part => nextBuild.push(part));

        plans.push({
            count: currentPlan.count,
            parts: nextBuild
        });
    });

    // Also try removing a body part.
    if (currentPlan.parts.length > 3) {
        plans.push(currentPlan.parts.slice(1));
    }

    Memory.spawns.buildPlans = plans;
};

function BuildPlan(count, parts) {
    this.count = count;
    this.parts = bodyParts;
}

module.exports = run;
