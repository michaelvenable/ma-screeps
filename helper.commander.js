function Commander() {
    this.assignOrders = function (room) {
        room.find(FIND_MY_CREEPS)
            .filter(c => c.memory.role === 'guard')
            .forEach(creep => {
                creep.memory.job = {
                    action: 'patrol'
                };
            })
    }
}

module.exports = Commander;