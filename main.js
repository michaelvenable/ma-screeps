let buildAction = require('action.build');
let depositAction = require('action.deposit');
let deliveringAction = require('action.delivering');

let ai = require('ai');

let DeliveryEnergyToController = require('coordinator.deliver-energy-to-controller');
let DeliverEnergyToSpawn = require('coordinator.deliver-energy-to-spawn');
let DeliverEnergyToExtensions = require('coordinator.deliver-energy-to-extensions');
let DeliverEnergyToConstructionSites = require('coordinator.deliver-energy-to-construction-sites');
let AssignWaitingPeasantsToUpgradeController = require('coordinator.assign-waiting-peasants-to-upgrade-controller');
let DeliverEnergyToTowers = require('coordinator.deliver-energy-to-towers');

let mapping = require('mapping');

module.exports.loop = function () {
    console.log(`================== (Tick: ${Game.time}) ==================`);

    if (Memory.rebuild !== undefined) {
        rebuild(Memory.rebuild);
        Memory.rebuild = undefined;
    }

    for (let name in Game.rooms) {
        let room = Game.rooms[name];

        let peasants = room.find(FIND_MY_CREEPS).filter(c => c.memory.role === 'peasant');
        console.log(`Peasants (${room.name}): ${peasants.length}`);
    }

    ai.architect.run();

    assignTasksToPeasants();
    runTowers();
    runControllers();

    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];
        ai.spawn.run(spawn);
    }

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if (creep.spawning) {
            continue;
        }

        if (creep.memory.job === undefined) {
            console.log(`${creep} does not have a job, so he does nothing.`);
            continue;
        }

        if (creep.memory.job.action === 'deposit') {
            depositAction.run(creep);
        } else if (creep.memory.job.action === 'upgrade') {
            deliveringAction.run(creep);
        } else if (creep.memory.job.action === 'build') {
            buildAction.run(creep);
        } else {
            console.log(`${creep} has an unrecognized job.`);
        }
    }
}

function rebuild(roomName) {
    let room = Game.rooms[roomName];
    if (room === undefined) {
        console.log(`No room with name ${roomName}.`);
        return;
    }

    room.find(FIND_MY_STRUCTURES)
        .filter(structure => [STRUCTURE_LINK, STRUCTURE_TOWER, STRUCTURE_EXTENSION].includes(structure.structureType))
        .forEach(structure => structure.destroy());

    room.find(FIND_MY_CONSTRUCTION_SITES)
        .forEach(structure => structure.remove());

    room.find(FIND_STRUCTURES)
        .filter(structure => structure.structureType === STRUCTURE_ROAD)
        .forEach(structure => structure.destroy());

    Memory.architect.worklist = undefined;
    Memory.architect.maps = {};
    Memory.architect.buildLists = {};

    console.log("Room structures reset.");
}

/**
 * Assigns tasks to peasants in each room.
 */
function assignTasksToPeasants() {
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];

        let coordinators = [
            new DeliveryEnergyToController(room),
            new DeliverEnergyToSpawn(room),
            new DeliverEnergyToExtensions(room),
            new DeliverEnergyToConstructionSites(room),
            new DeliverEnergyToTowers(room),
            new AssignWaitingPeasantsToUpgradeController(room),
        ];

        let peasants = room.find(FIND_MY_CREEPS).filter(creep => creep.memory.role === 'peasant');
        coordinators.forEach(builder => builder.assignJobs(peasants));
    }
}

/**
 * Runs the AI for all controllers in all rooms.
 */
function runControllers() {
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];

        if (room.controller !== undefined && room.controller.my) {
            ai.controller.run(room.controller);
        }
    }
}

/**
 * Runs the AI for all towers in all rooms.
 */
function runTowers() {
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER }});
        towers.forEach(tower => ai.tower.run(tower));
    }
}
