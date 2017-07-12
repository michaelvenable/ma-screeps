let productionLog = require('gods.fertility.models.production-log');

function run() {
    productionLog.print();
}

module.exports = {
    run: run
}
