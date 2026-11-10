const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 6612,
  user: process.env.DB_USER || 'ZnSoft',
  password: process.env.DB_PASS || 'MySQL@ZnSoft',
  database: process.env.DB_NAME || 'stellar_trace',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
})

module.exports = pool
