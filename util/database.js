const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'katomarket',
  password: 'ado567##'
})

module.exports = pool.promise()