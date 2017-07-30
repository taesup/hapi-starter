const pgp = require('pg-promise')();
const configs = require('../configs/database');
module.exports = pgp(`postgres://${configs.host}:${configs.port}/${configs.database}`);
