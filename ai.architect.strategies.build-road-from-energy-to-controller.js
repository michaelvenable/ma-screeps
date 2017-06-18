let helpers = require('ai.architect.helpers');

function run(room) {
    room.find(FIND_SOURCES)
        .forEach(source => {
            helpers.establishRoad(room, source.pos, room.controller.pos);
        });
}

module.exports = {
    run: run
};
