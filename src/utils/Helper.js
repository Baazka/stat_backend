const jwt = require("jsonwebtoken");
const moment = require("moment");
const { tokenDomain, tokenName } = require("../config");

module.exports = {
  getCookie(name, cookie) {
    const value = "; " + cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2 || parts.length === 3)
      return parts.pop().split(";").shift();
  },
  removeCookieToken(res) {
    if (tokenName) {
      const tokenOptions = {
        expires: new Date(0),
        httpOnly: true,
        path: "/",
        sameSite: "Strict",
      };
      if (tokenDomain) {
        tokenOptions.domain = tokenDomain;
      }
      res.cookie(tokenName, "", tokenOptions);
    }
  },
  setCookieToken(res, data) {
    if (tokenName) {
      const tokenDay = 2;
      const tokenOptions = {
        expires: moment().add(tokenDay, "d").toDate(),
        httpOnly: true,
        path: "/",
        sameSite: "Strict",
      };
      if (tokenDomain) {
        tokenOptions.domain = tokenDomain;
      }
      res.cookie(tokenName, data.token, tokenOptions);
    }
  },
  jwtSign(val) {
    const { data, expiresIn, secret } = Object.assign(
      { expiresIn: "2d", secret: authentication.jwtSecretApi },
      val
    );
    return jwt.sign(data, secret, { expiresIn });
  },
  jwtVerify(val) {
    const { token, secret } = Object.assign(
      { secret: authentication.jwtSecretApi },
      val
    );
    return jwt.verify(token, secret);
  },

  DateFormat(val) {
    return val === null || val === undefined || val === "Invalid date"
      ? null
      : moment(val).format("DD-MMM-YYYY");
  },

  CheckNullInt(val) {
    if (val === undefined) return null;
    else if (val === null) return null;
    else if (val === "") return null;
    else if (val === NaN) return null;
    else if (val === 999) return null;
    else if (val === "999") return null;
    else return parseInt(val);
  },
  CheckNullFloat(val) {
    if (val === undefined) return null;
    else if (val === null) return null;
    else if (val === "") return null;
    else if (val === NaN) return null;
    else return parseFloat(val);
  },
};
