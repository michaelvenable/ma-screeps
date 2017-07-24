let log = require('performance.log.model');
let table = require('helpers').table;

let columns = [
    {
        title: 'Metric',
        width: 15
    }, {
        title: 'Value',
        width: 8
    }
];


function run() {
    let data = [
        [ 'Harvested', log.get('harvested') ]
    ];

    table.draw(columns, data);
}

module.exports = run;
