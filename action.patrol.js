function run(creep) {
    let intruders = creep.room.find(FIND_HOSTILE_CREEPS);
    
    // If there are intruders, attack them.
    /*
    if (intruders.length > 0) {
        let intruder = intruders[0];
        let result = creep.attack(intruder)
        if (result === OK) {
            console.log(`${creep} is attacking ${intruder}`);
        } else if (result === ERR_NOT_IN_RANGE) {
            console.log(`${creep} is moving in to attack ${intruder}`);
            creep.moveTo(intruder);
        }
        return;
    }
    */

    // Otherwise, patrol around the room every 3 ticks. But don't go outside the room.
    if (creep.memory.lastPatrolTime === undefined || Game.time >= creep.memory.lastPatrolTime + 4) {
        let directions = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
        let index = Math.floor(Math.random() * (directions.length - 1));
        let direction = directions[index];
        
        creep.move(direction);
        
        creep.memory.lastPatrolTime = Game.time;
    }
}

module.exports = {
    run: run
};