const oracledb = require("oracledb");
const database = require("../services/database.js");

const loginSql = `SELECT AUD_REG.F_CHECK_USER_SYSTEM(:P_LOGINNAME, :P_PASSWORD, :P_SYSTEMID) AS USER_ID FROM DUAL`;

async function login(login) {
  const result = await database.simpleExecute(loginSql, login);

  if (result.Error !== undefined) return { code: 405, result };
  else return result.rows[0];
}

module.exports.login = login;

const passChangeSql = `UPDATE AUD_REG.SYSTEM_USER 
SET USER_PASSWORD = :P_USER_NEWCODE, 
UPDATED_BY = :P_UPDATED_BY, 
UPDATED_DATE = SYSDATE
WHERE USER_ID = :P_USER_ID`;

async function passChange(data) {
  const result = await database.simpleExecute(passChangeSql, data, {
    autoCommit: true,
  });

  if (result.rowsAffected) {
    return {
      message: "success",
    };
  } else {
    return { code: 405, result };
  }
}

module.exports.passChange = passChange;

const passUser = `SELECT USER_PASSWORD FROM AUD_REG.SYSTEM_USER WHERE USER_ID = :P_USER_ID`;

async function passGet(userid) {
  let binds = {};
  binds.P_USER_ID = userid;
  const result = await database.simpleExecute(passUser, binds);

  return result.rows?.[0]?.USER_PASSWORD;
}

module.exports.passGet = passGet;
