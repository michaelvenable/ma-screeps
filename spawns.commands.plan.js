Memory.spawns = Memory.spawns || {};

/**
 * Creates a variety of body builds that can be tested to see if they are better than the build we are
 * currently using.
 */
function run() {
    let currentBuild = Memory.spawns.currentBuild || [WORK, CARRY, MOVE];
    let plannedBuilds = [];

    // Add one of each body part to the plan.
    [WORK, CARRY, MOVE].forEach(bodyPart => {
        let nextBuild = [bodyPart];
        currentBuild.forEach(part => nextBuild.push(part));
        plannedBuilds.push(nextBuild);
    });

    // Also try removing a body part.
    if (currentBuild.length > 3) {
        plannedBuilds.push(currentBuild.slice(1));
    }

    Memory.spawns.plannedBuilds = plannedBuilds;
};

module.exports = run;
