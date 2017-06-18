let roles = require('constants').roles;

function numberOfCreepsInRole(role) {
    return getCreepsByRole(role).length;
}

/**
 * Retreives an element from an array at random.
 *
 * @param array {object[]}  Array containing candidtates for selection.
 *
 * @return {object} Element from array chosen at random.
 */
function pickRandomElement(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

module.exports = {
    numberOfCreepsInRole: numberOfCreepsInRole,
    pickRandomElement: pickRandomElement
}
