/**
 * AI for towers. Will instruct towers to attack any hostile units in the room.
 *
 * @param tower {StructureTower} Tower that will receive instructions.
 */
function run(tower) {
    let intruders = tower.room.find(FIND_HOSTILE_CREEPS)
        .filter(intruder => intruder.owner.username !== 'HOBAKK');

    if (intruders.length > 0) {
        console.log("Intruder!!!");
        attackIntruder(tower, intruders[0]);
        return;
    }


    let damagedRoads = tower.room.find(FIND_STRUCTURES)
        .filter(structure => structure.structureType === STRUCTURE_ROAD)
        .filter(road => road.hits < road.hitsMax * 0.8);

    console.log(`structures : ${damagedRoads.length}`);
    if (damagedRoads.length > 0) {
        repairStructure(tower, damagedRoads[0]);
        return;
    }
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

/**
 * Instructs a tower to repair a structure.
 *
 * @param tower {StructureTower}    Tower that will receive the reqpair instruction.
 * @param tower {Structure}         Structure that will be repair by the tower.
 */
function repairStructure(tower, target) {
    console.log(`${tower} is repairing ${target}.`);
    tower.repair(target);

}

module.exports = {
    run: run
};
