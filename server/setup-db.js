const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

async function setup() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'MySQL@ZnSoft',
    multipleStatements: true
  })

  console.log('Connected to MySQL')

  // Read and execute schema.sql
  console.log('Creating database and tables...')
  const schema = fs.readFileSync(path.join(__dirname, '..', 'sql', 'schema.sql'), 'utf8')
  await conn.query(schema)
  console.log('Schema executed successfully')

  // Generate proper BCrypt hash for "123456"
  const password = '123456'
  const hash = await bcrypt.hash(password, 10)
  console.log('Generated BCrypt hash for password "123456":', hash)

  // Read seed.sql and replace the placeholder hash
  let seed = fs.readFileSync(path.join(__dirname, '..', 'sql', 'seed.sql'), 'utf8')
  seed = seed.replace(/\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy/g, hash)

  console.log('Inserting seed data...')
  await conn.query(seed)
  console.log('Seed data inserted successfully')

  await conn.end()
  console.log('Database setup complete!')
}

setup().catch(err => {
  console.error('Setup failed:', err.message)
  process.exit(1)
})
