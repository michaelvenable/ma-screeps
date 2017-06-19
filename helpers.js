let roles = require('constants').roles;

/**
 * Calculates the straight-line distance between two points. This method does not consider walls and other
 * obstacles.
 *
 * @param start {object}    The first of the two points used when calculating the distance.
 * @param start.x {number}  The X value.
 * @param start.y {number}  The Y value.
 * @param end {object}      The second of the two points used when calculating the distance.
 * @param end.x {number}    The X value.
 * @param end.y {number}    The Y value.
 *
 * @return {number} The straight-line distance between the given points. 
 */
function distance(start, end) {
    return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
}

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
    distance: distance,
    numberOfCreepsInRole: numberOfCreepsInRole,
    pickRandomElement: pickRandomElement
}
