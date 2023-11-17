const oracledb = require("oracledb");
const dbConfig = require("./../config");

// Tell node-oracledb where to find the Oracle Instant Client 'Basic' package on macOS and Windows
if (process.platform === "darwin") {
  oracledb.initOracleClient({
    libDir: process.env.HOME + "/Downloads/instantclient_19_8",
  });
} else if (process.platform === "win32") {
  oracledb.initOracleClient({ libDir: "D:\\oracle\\instantclient_21_9" }); // note the double backslashes
} else if (process.platform === "win64") {
  oracledb.initOracleClient({ libDir: "D:\\oracle\\instantclient_21_9" }); // note the double backslashes
} // else you must set the system library search path before starting Node.js

async function initialize() {
  await oracledb.createPool(
    {
      user: dbConfig.ORACLE_DB_USER,
      password: dbConfig.ORACLE_DB_PASSWORD,
      connectString: dbConfig.ORACLE_CONNECTION,
      poolMax: 100, // maximum size of the pool
      poolMin: 1, // let the pool shrink completely
      poolIncrement: 1, // only grow the pool by one connection at a time
    },
    (err, pool) => {
      if (err) {
        console.log("createPool error ", err);
      }
    }
  );
}

module.exports.initialize = initialize;

async function close() {
  await oracledb.getPool().close(10);
}

module.exports.close = close;

async function simpleExecute(statement, binds = [], opts = {}) {
  let conn;
  let result;

  opts.outFormat = oracledb.OBJECT;

  try {
    conn = await oracledb.getConnection();
    result = await conn.execute(statement, binds, opts);
  
    return result;
  } catch (err) {
    console.error("error", err);
    throw err;
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports.simpleExecute = simpleExecute;

async function multipleExecute(statement, binds = [], opts = {}) {
  let conn;
  let result = [];

  opts.outFormat = oracledb.OBJECT;

  try {
    conn = await oracledb.getConnection();
    result = await conn.executeMany(statement, binds, opts);
    return result;
  } catch (err) {
    console.error(err);
    return {
      Error: err,
    };
    throw err;
  } finally {
    if (conn) {
      // conn assignment worked, need to close
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports.multipleExecute = multipleExecute;
