const pgp = require('pg-promise')();
require('dotenv').config();

// Connect to Database
// const devConfig = {
//     host: process.env.PG_HOST,
//     port: process.env.PG_PORT,
//     database: process.env.PG_DATABASE,
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD
// }
const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const proConfig = {
    connectionString: process.env.DATABASE_URL // Heroku Addon
}

let db = pgp(proConfig);

module.exports = db;