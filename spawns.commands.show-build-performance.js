let table = require('helpers').table;

function run() {
    console.log("Command started: spawns.show-build-performance.");

    let columns = [
        { title: 'Body Parts', width: 35 },
        { title: 'Count', width: 5 },
        { title: 'Energy / Tick', width: 15 }
    ];

    let history = Memory.spawns.history || [];
    let data = [];

    history.forEach(record => {
        let partCounts = {
            carry: 0,
            move: 0,
            work: 0
        };

        record.build.parts.forEach(part => partCounts[part]++);

        let partSummary =
            `${partCounts['carry']} X carry, ${partCounts['move']} X move, ${partCounts['work']} X work`;

        data.push([
            partSummary,
            record.build.count,
            record.production
        ]);
    });

    table.draw(columns, data);
}

module.exports = run;
