let roles = require('constants').roles;

function getCreepsByRole(role) {
    return _.filter(Game.creeps, creep => creep.memory.role === role);
}

function numberOfCreepsInRole(role) {
    return getCreepsByRole(role).length;
}

module.exports = {
    getCreepsByRole: getCreepsByRole,
    numberOfCreepsInRole: numberOfCreepsInRole
}