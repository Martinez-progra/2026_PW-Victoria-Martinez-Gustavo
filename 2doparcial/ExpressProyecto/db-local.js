const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:'localhost',
    port: 3307,
    user: 'root',
    password: 'Gus2810.',
    database: 'cecyt9_local',
    dateStrings: true,
});

module.exports = pool;

