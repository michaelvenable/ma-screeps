var towerAi = towerAi || {};

/**
 * AI for towers. Will instruct towers to attack any hostile units in the room.
 *
 * @param tower {StructureTower} Tower that will receive instructions.
 */
towerAi.run = function (tower) {
    let intruders = tower.room.find(FIND_HOSTILE_CREEPS);

    intruders
        .filter(intruder => intruder.owner.username !== 'HOBAKK')
        .forEach(intruder => attackIntruder(tower, intruder));
}

/**
 * Instructs a tower to attack a target.
 *
 * @param tower {StructureTower}    Tower that will receive the attack instruction.
 * @param target {Creep}            Unit that will be attacked.
 */
function attackIntruder(tower, target) {
    console.log(`${tower} is attacking ${target}.`);
    tower.attack(target);
}

module.exports = towerAi;
