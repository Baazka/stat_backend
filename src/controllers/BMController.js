const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");
const { CheckNullInt, DateFormat } = require("../utils/Helper");

module.exports = {
  async BM1List(req, res) {
    try {
      let params = {};
      params.periodid = parseInt(req.body.PERIOD_ID, 10);
      params.depid = parseInt(req.body.DEPARTMENT_ID, 10);

      let ListQuery = `SELECT 
      SA.ID,
      RP.PERIOD_LABEL,
      SA.CONFIRM_DATE,
      RD.DEPARTMENT_NAME,
      D.DOCUMENT_NAME,
      D.DOCUMENT_SHORT_NAME,
      SU.USER_NAME,
      SA.CREATED_DATE
      FROM AUD_STAT.STAT_AUDIT SA
      INNER JOIN AUD_STAT.REF_PERIOD RP ON SA.PERIOD_ID = RP.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON SA.DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_STAT.REF_DOCUMENT D ON SA.DOCUMENT_ID = D.ID
      LEFT JOIN AUD_REG.SYSTEM_USER SU ON SA.CREATED_BY = SU.USER_ID
      WHERE SA.IS_ACTIVE = 1`;

      const binds = {};
      if (params.periodid) {
        ListQuery += `\n AND SA.PERIOD_ID = :PERIOD_ID`;
        binds.PERIOD_ID = params.periodid;
      }
      if (params.depid) {
        ListQuery += `\n AND SA.DEPARTMENT_ID = :DEPARTMENT_ID`;
        binds.DEPARTMENT_ID = params.depid;
      }
      ListQuery += `\n ORDER BY RD.DEPARTMENT_ID, D.DOCUMENT_ORDER`;

      const result = await OracleDB.simpleExecute(ListQuery, binds);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async BM1IU(req, res) {
    try {
      const queryBM1 = `BEGIN AUD_STAT.NEW_BM1_I_U(:P_ID, :P_AUDIT_ID, :P_AUDIT_TYPE_ID, :P_IS_EXPERT_ATTEND, :P_IS_PRESS_REPORT, :P_WORK_PEOPLE, :P_WORK_DAY, :P_WORK_TIME, :P_CREATED_BY); END;`;

      let data = [];
      function getData(req) {
        if (req.body.data?.length > 0) {
          req.body.data?.forEach((element) => {
            data.push({
              P_ID: element.ID != null ? parseInt(element.ID) : null,
              P_AUDIT_ID: CheckNullInt(element.AUDIT_ID),
              P_AUDIT_TYPE_ID: CheckNullInt(element.AUDIT_TYPE_ID),
              P_IS_EXPERT_ATTEND: CheckNullInt(element.IS_EXPERT_ATTEND),
              P_IS_PRESS_REPORT: CheckNullInt(element.IS_PRESS_REPORT),
              P_WORK_PEOPLE: CheckNullInt(element.WORK_PEOPLE),
              P_WORK_DAY: CheckNullInt(element.WORK_DAY),
              P_WORK_TIME: CheckNullInt(element.WORK_TIME),
              P_CREATED_BY: parseInt(req.body.CREATED_BY),
            });
          });
        }
        return { data };
      }

      getData(req);

      const result = await OracleDB.multipleExecute(queryBM1, data);
      return res.send({
        message: "Хадгаллаа.",
      });
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
