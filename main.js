let buildAction = require('action.build');
let depositAction = require('action.deposit');
let deliveringAction = require('action.delivering');

let Architect = require('class.architect');

let ai = require('ai');

let DeliveryEnergyToController = require('coordinator.deliver-energy-to-controller');
let DeliverEnergyToSpawn = require('coordinator.deliver-energy-to-spawn');
let DeliverEnergyToExtensions = require('coordinator.deliver-energy-to-extensions');
let DeliverEnergyToConstructionSites = require('coordinator.deliver-energy-to-construction-sites');
let AssignWaitingPeasantsToUpgradeController = require('coordinator.assign-waiting-peasants-to-upgrade-controller');
let DeliverEnergyToTowers = require('coordinator.deliver-energy-to-towers');

let towerAi = require('tower-ai');

module.exports.loop = function () {
    console.log(`================== (Tick: ${Game.time}) ==================`);

    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];

        let peasants = spawn.room.find(FIND_MY_CREEPS).filter(c => c.memory.role === 'peasant');
        console.log(`Peasants (${spawn.room.name}): ${peasants.length}`);
        let guards = spawn.room.find(FIND_MY_CREEPS).filter(c => c.memory.role === 'guard');
        console.log(`Guards: (${spawn.room.name}): ${guards.length}`);
    }

    runArchitect();
    assignTasksToPeasants();
    runTowers();

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

function runArchitect() {
    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];

        if (Memory.lastBuildTime === undefined) {
            Memory.lastBuildTime = Game.time;
        }

        // console.log(`${Game.time} ${Memory.lastBuildTime}`);

        if (Game.time >= (Memory.lastBuildTime + 100)) {
            Memory.lastBuildTime = Game.time;
            new Architect(spawn.room).establishConstructionSites();
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
 * Runs the AI for all towers in all rooms.
 */
function runTowers() {
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER }});
        towers.forEach(tower => towerAi.run(tower));
    }
}
