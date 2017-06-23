/**
 * Roles that can be assigned to the "memory.role" field of creeps.
 */
let roles = {
    peasant: 'peasant'
};

let actions = {
    build: 'build',
    deliver: 'deliver',
    harvest: 'harvest',
    upgrade: 'upgrade'
};

let builds = {
    peasant: [
        [WORK, CARRY, MOVE],
        [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        [WORK, CARRY, MOVE, WORK, CARRY, MOVE, CARRY, MOVE, MOVE]
    ],
    guard: [
        [ATTACK, MOVE, ATTACK, MOVE]
    ]
};

let buildCosts = {};

for (let className in builds) {
    buildCosts[className] = []

    for (let i = 0; i < builds[className].length; i++) {
        buildCosts[className].push(0);

        let bodyParts = builds[className][i];
        for (let j = 0; j < bodyParts.length; j++) {
            let bodyPart = bodyParts[j];
            buildCosts[className][i] += BODYPART_COST[bodyPart];
        }
    }
}

let visuals = {
    path: { visualizePathStyle: { stroke: '#FFFFFF' } }
};

module.exports = {
    actions: actions,
    builds: builds,
    buildCosts: buildCosts,
    roles: roles,
    visuals: visuals
};
