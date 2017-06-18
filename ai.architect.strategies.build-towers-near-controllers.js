let helpers = require('ai.architect.helpers');

function run(room) {
    let controller = room.controller;

    if (controller !== undefined && controller.my) {
        let desiredTowerPositions = getDesiredTowerPositions(controller);

        while (desiredTowerPositions.length > 0) {
            let desiredPosition = pickAPosition(desiredTowerPositions);
            if (isAvailableForTower(room, desiredPosition)) {
                helpers.placeTower(room, desiredPosition.x, desiredPosition.y);
                desiredTowerPositions = [];
            } else {
                removePosition(desiredPosition, desiredTowerPositions);
            }
        }
    }
}

function getDesiredTowerPositions(controller) {
    let boundingBox = {
        topLeft: {
            x: controller.pos.x - 6,
            y: controller.pos.y - 6
        },
        bottomRight: {
            x: controller.pos.x + 6,
            y: controller.pos.y + 6
        }
    };

    let positions = [];

    for (let x = boundingBox.topLeft.x; x < boundingBox.bottomRight.x; x++) {
        for (let y = boundingBox.topLeft.y; y < boundingBox.bottomRight.y; y++) {
            let distance = Math.sqrt((x - controller.pos.x) * (x - controller.pos.x) + (y - controller.pos.y) * (y - controller.pos.y));

            if (distance > 4) {
                positions.push({x: x, y: y});
            }
        }
    }

    return positions;
}

function pickAPosition(positions) {
    let index = Math.floor(Math.random() * positions.length);
    return positions[index];
}

function isAvailableForTower(room, desiredPosition) {
    return room.lookAt(desiredPosition.x, desiredPosition.y).length < 2;
}

function removePosition(desiredPosition, desiredTowerPositions) {
    let index = desiredTowerPositions.findIndex(position => position.x === desiredPosition.x && position.y === desiredPosition.y);
    if (index !== -1) {
        desiredTowerPositions.splice(index, 1);
    }
}

module.exports = {
    run: run
};
