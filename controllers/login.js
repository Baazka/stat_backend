const parse = require("nodemon/lib/cli/parse");
const login = require("../db_apis/login");

function getLoginFromRec(req) {
  const user = {
    P_LOGINNAME: req.body.username,
    P_PASSWORD: req.body.password,
    P_SYSTEMID: req.body.systemid,
  };

  return user;
}

async function post(req, res, next) {
  try {
    let func = getLoginFromRec(req);

    result = await login.login(func);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

