/**
 * Displays the number of creeps owned across all rooms.
 */
function showNumberOfCreeps() {
    let count = 0;

    for (let name in Game.rooms) {
        let room = Game.rooms[name];
        count += room.find(FIND_MY_CREEPS).length;
    }

    console.log(`Number of creeps: ${count}`);
}

module.exports = showNumberOfCreeps;
