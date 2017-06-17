/**
 * Runs the AI for controllers. If the controller is owned by us and enemies are in the room, the controller
 * will activate safe mode.
 */
function run(controller) {
    let intruders =controller.room.find(FIND_HOSTILE_CREEPS);

    if (intruders.length > 0 && controller.safeModeAvailable) {
        controller.activateSafeMode();
    }
}

module.exports = {
    run: run
};
