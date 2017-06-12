let buildAction = require('action.build');
let depositAction = require('action.deposit');
let deliveringAction = require('action.delivering');
let patrolAction = require('action.patrol');

let Architect = require('class.architect');
let Boss = require('helper.boss').Boss;
let Commander = require('helper.commander');

let actions = require('constants').actions;
let roles = require('constants').roles;
let visuals = require('constants').visuals;

let roleSpawner = require('role.spawner');

module.exports.loop = function () {
    console.log("==========================================");

    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];

        let peasants = spawn.room.find(FIND_MY_CREEPS).filter(c => c.memory.role === 'peasant');
        console.log(`Peasants (${spawn.room.name}): ${peasants.length}`);
        let guards = spawn.room.find(FIND_MY_CREEPS).filter(c => c.memory.role === 'guard');
        console.log(`Guards: (${spawn.room.name}): ${guards.length}`);
    }

    runArchitect();
    assignJobs();
    assignOrders();

    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];
        roleSpawner.run(spawn);
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
        } else if (creep.memory.job.action === 'patrol') {
            patrolAction.run(creep);
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

function assignJobs() {
    let boss = new Boss();

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        boss.assignJobs(room);
    }
}

function assignOrders() {
    let commander = new Commander();

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        commander.assignOrders(room);
    }
}
