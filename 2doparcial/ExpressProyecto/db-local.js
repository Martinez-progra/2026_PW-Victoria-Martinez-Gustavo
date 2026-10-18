const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'cecyt9_local',
    dateStrings: true,
});


