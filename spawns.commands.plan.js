Memory.spawns = Memory.spawns || {};

/**
 * Creates a variety of body builds that can be tested to see if they are better than the build we are
 * currently using. The plans that are built are assigned to Memory.spawns.buildPlans. Each of the build
 * plans can be tested to see which one performs best.
 */
function run() {
    console.log("Command started: spawns.plan.");

    let currentPlan = getBuildPlanCurrentlyInTest();
    let mutants = createPlanMutations(currentPlan);
    Memory.spawns.buildPlans = mutants;
};

/**
 * Accesses the build plan that is currently under test.
 *
 * @returns the build plan that is currently under test or, if no plan is in test, then a new initial plan is
 *          returned. The initial plan can be used as the starting point for creating build plan mutations to
 *          be tested.
 */
function getBuildPlanCurrentlyInTest() {
    let initialPlan = {
        count: 1,
        parts: [WORK, CARRY, MOVE]
    };

    return Memory.spawns.currentPlan || initialPlan;
}

/**
 * Creates variants of a build plan by mutating certain variables within an existing build plan referred to
 * as the "seed." The variants can then be tested to see if they perform better than the seed.
 *
 * @param seed      Mutations of this plan will be created.
 *
 * @returns an array of mutant plans that were derived from the seed.
 */
function createPlanMutations(seed) {
    let mutants = [];

    // Increase the count by 1.
    mutants.push({
        count: seed.count + 1,
        parts: seed.parts
    });

    // Decrease the count by 1.
    mutants.push({
        count: seed.count - 1,
        parts: seed.parts
    });

    // Add one of each body part to the plan.
    [WORK, CARRY, MOVE].forEach(bodyPart => {
        let nextBuild = [bodyPart];
        seed.parts.forEach(part => nextBuild.push(part));

        mutants.push({
            count: seed.count,
            parts: nextBuild
        });
    });

    // Also try removing a body part.
    if (seed.parts.length > 3) {
        mutants.push(seed.parts.slice(1));
    }
    return mutants;
}

module.exports = run;
