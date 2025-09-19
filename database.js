const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
    const res = await pool.query(text, params);
    return res;
}

async function inicializarBanco() {
    console.log('Banco PostgreSQL pronto para uso!');
}

module.exports = {
    pool,
    query,
    inicializarBanco
};
