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
        {
            count: 25,
            getCost: getCost,
            parts: [
                WORK,
                CARRY,
                MOVE
            ]
        }, {
            count: 20,
            getCost: getCost,
            parts: [
                WORK, WORK, WORK,
                CARRY, CARRY,
                MOVE, MOVE
            ]
        }, {
            count: 15,
            getCost: getCost,
            parts: [
                WORK, WORK, WORK,
                CARRY, CARRY, CARRY,
                MOVE, MOVE
            ]
        }
    ]
};

function getCost() {
    return this.parts.reduce((sum, part) => sum + BODYPART_COST[part], 0);
}

/**
 * Height of each room in tiles.
 */
let roomHeight = 50;

/**
 * Width of each room in tiles.
 */
let roomWidth = 50;

module.exports = {
    actions: actions,
    builds: builds,
    roles: roles,
    roomHeight: roomHeight,
    roomWidth: roomWidth
};
