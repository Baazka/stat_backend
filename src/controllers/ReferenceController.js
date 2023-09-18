const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");

module.exports = {
  async refPeriodList(req, res) {
    try {
      const ListQuery = `SELECT ID, PERIOD_LABEL FROM AUD_STAT.REF_PERIOD WHERE IS_ACTIVE = 1 ORDER BY ID`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
