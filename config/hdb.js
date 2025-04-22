const oracledb = require("oracledb");
require("dotenv").config();

async function getConnection() {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbConnectionString = process.env.DB_CONNECT_STRING;

  try {
    const connection = await oracledb.getConnection({
      user: dbUser,
      password: dbPassword,
      connectString: dbConnectionString,
    });

    return connection;
  } catch (error) {
    console.dir("Error: ", error?.message);
    throw error;
  }
}

module.exports = { getConnection };
