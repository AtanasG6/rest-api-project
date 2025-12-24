const Database = require('better-sqlite3');
const path = require('path');

// Създаване на база данни
const db = new Database(path.join(__dirname, 'data.db'));

// Създаване на таблица за потребители (пример)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Database initialized successfully');

module.exports = db;
