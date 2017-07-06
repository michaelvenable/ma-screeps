function help() {
    console.log("Commands:");
    console.log("  bulldozeRoom(roomName: string)                       Destroy all structurs in a room.");
    console.log("  help()                                               Display this notice.");
    console.log("  scheduleTask(action: string, ticksFromNow: number)   Schedule task.");
    console.log("  showJobs()                                           List creeps and their jobs.");
    console.log("  toggleWorklist()                                     Continuously print worklist.");
}

module.exports = help;
