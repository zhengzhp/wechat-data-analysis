// import sqlite3 from 'sqlite3'
const sqlite3 = require('sqlite3').verbose()

const sqlitePath =
  '/Users/xxxxx/Desktop/Documents/5d36756da6a6xxxxxxxxxx/DB/WCDB_Contact.sqlite'

const contactDb = new sqlite3.Database(sqlitePath, sqlite3.OPEN_READONLY, function(error) {
  if (error) {
    console.log('Database error:', error)
  }
})
contactDb.all('select * from Friend', function(_, row) {
  console.log(JSON.stringify(row))
})
