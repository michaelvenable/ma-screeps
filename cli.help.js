function help() {
    console.log("Commands:");
    console.log("  bulldozeRoom(roomName: string)                       Destroy all structurs in a room.");
    console.log("  help()                                               Display this notice.");
    console.log("  run(action: string, ticksFromNow: number)            Run a task.");
    console.log("  showBuilds()                                         Lists configured builds and costs.");
    console.log("  showJobs()                                           List creeps and their jobs.");
    console.log("  showNumberOfCreeps()                                 Displays count of all creeps.");
    console.log("  toggleWorklist()                                     Continuously print worklist.");
}

module.exports = help;
