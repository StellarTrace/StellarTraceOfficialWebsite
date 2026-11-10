const mysql = require('mysql2/promise')

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'MySQL@ZnSoft'
    })
    console.log('MySQL connected!')
    const [rows] = await conn.query('SELECT VERSION() as version')
    console.log('MySQL version:', rows[0].version)
    await conn.end()
  } catch (err) {
    console.error('MySQL connection failed:', err.message)
  }
}

test()
