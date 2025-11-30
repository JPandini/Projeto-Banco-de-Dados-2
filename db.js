// db.js
const sql = require('mssql');

const config = {
    user: 'sa',
    password: '!Admin123',
    server: 'localhost',
    database: 'master', // Troque pelo nome do seu banco se não for master
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = {
    sql,
    pool,
    poolConnect
};

