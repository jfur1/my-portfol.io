const pgp = require('pg-promise')();

// Connect to Database
const dbConfig = {
    host: 'mp-identifier.cyxo9dxpukfl.us-east-2.rds.amazonaws.com',
    port: 5432,
    database: 'mpdb',
    user: 'postgres',
    password: 'mp!password'
};

let db = pgp(dbConfig);

module.exports = db;