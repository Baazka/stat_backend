require("dotenv").config();

const db_options = { useNewUrlParser: true, useUnifiedTopology: true };

const ORACLE_DB_USER = process.env.ORACLE_DB_USER;
const ORACLE_DB_PASSWORD = process.env.ORACLE_DB_PASSWORD;
const ORACLE_CONNECTION = process.env.ORACLE_CONNECTION;
const bodyParserOptions = {
  limit: "100mb",
  extended: true,
  parameterLimit: 1000000,
};
const corsOptions = Object.assign({
  origin: "*",
  credentials: true,
  exposedHeaders: ["Content-Disposition"],
});
const JWT_SECRET_API = process.env.JWT_SECRET_API;
const tokenName = process.env.tokenName;
const tokenDomain = process.env.tokenDomain;

module.exports = {
  db_options,
  ORACLE_DB_USER,
  ORACLE_DB_PASSWORD,
  ORACLE_CONNECTION,
  bodyParserOptions,
  corsOptions,
  JWT_SECRET_API,
  tokenName,
  tokenDomain,
};
