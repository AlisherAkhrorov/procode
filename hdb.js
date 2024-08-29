const oracledb = require('oracledb');
require('dotenv').config();

// oracledb.autoCommit = true;

async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });
    return connection;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
}

module.exports = {
  getConnection,
};