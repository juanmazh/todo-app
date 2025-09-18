const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'todos.db');

const getDatabase = () => {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error al conectar con la base de datos:', err);
      throw err;
    }
  });
};

module.exports = { getDatabase };
