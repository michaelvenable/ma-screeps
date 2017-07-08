let buildAction = require('action.build');
let depositAction = require('action.deposit');
let deliveringAction = require('action.delivering');

let ai = require('ai');
let gods = require('gods');

let DeliveryEnergyToController = require('coordinator.deliver-energy-to-controller');
let DeliverEnergyToSpawn = require('coordinator.deliver-energy-to-spawn');
let DeliverEnergyToExtensions = require('coordinator.deliver-energy-to-extensions');
let DeliverEnergyToConstructionSites = require('coordinator.deliver-energy-to-construction-sites');
let AssignWaitingPeasantsToUpgradeController = require('coordinator.assign-waiting-peasants-to-upgrade-controller');
let DeliverEnergyToTowers = require('coordinator.deliver-energy-to-towers');

let mapping = require('mapping');

module.exports.loop = function () {
    console.log(`================== (Tick: ${Game.time}) ==================`);

    if (Memory.architect && Memory.architect.settings && Memory.architect.settings.showWorklist) {
        printWorklist();
    }

    gods.architect.run();

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

function printWorklist() {
    let worklist = Memory.architect.worklist || {};

    console.log(`Worklist contains ${worklist.length} ${worklist.length === 1 ? "item" : "items"}.`);

    for (let i = 0; i < worklist.length; i++) {
        let workItem = worklist[i];
        let timeUntil = workItem.runAt - Game.time;
        console.log(`  ${i+1}. Action "${workItem.action}" in ${timeUntil} ${timeUntil === 1 ? "tick" : "ticks"}.`);
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
