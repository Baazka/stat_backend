const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");
const { CheckNullInt, DateFormat, CheckNullFloat } = require("../utils/Helper");

module.exports = {
  async CM1AList(req, res) {
    try {
      let params = {};
      params.P_PERIOD_ID = CheckNullInt(req.body.PERIOD_ID);
      params.P_DEPARTMENT_ID = CheckNullInt(req.body.DEPARTMENT_ID);

      let ListQuery = `SELECT L.AUDIT_ORG_TYPE, RAOT.AUDIT_ORG_CHECK_NAME, L.BUDGET_TYPE_ID, RBT.BUDGET_SHORT_NAME, SUM(WORK_PEOPLE) WORK_PEOPLE, SUM(WORK_DAY) WORK_DAY, SUM(WORK_TIME) WORK_TIME,
      SUM(CASE WHEN FORM_TYPE_ID = 1 THEN 1 ELSE 0 END) DUGNELT, SUM(CASE WHEN FORM_TYPE_ID = 2 THEN 1 ELSE 0 END) TUUWER,
      SUM(CASE WHEN FORM_TYPE_ID = 1 AND L.AUDIT_PERCENT = 100 THEN 1 ELSE 0 END) DUGNELT_LAST, SUM(CASE WHEN FORM_TYPE_ID = 2 AND L.AUDIT_PERCENT = 100 THEN 1 ELSE 0 END) TUUWER_LAST,
      SUM(CASE WHEN REASON_TYPE_ID IS NOT NULL THEN 1 ELSE 0 END) REASON_TYPE_CNT,
      SUM(CASE WHEN CONCLUSION = 'Өөрчлөлтгүй' THEN 1 ELSE 0 END) UGUI_CNT,
      SUM(CASE WHEN CONCLUSION = 'Хязгаарлалттай Өөрчлөлттэй' THEN 1 ELSE 0 END) KHYAZGAARLALTTAI_CNT,
      SUM(CASE WHEN CONCLUSION = 'Татгалзсан Өөрчлөлттэй' THEN 1 ELSE 0 END) TATGALZSAN_CNT,
      SUM(CASE WHEN CONCLUSION = 'Сөрөг Өөрчлөлттэй' THEN 1 ELSE 0 END) SURUG_CNT
      FROM AUD_STAT.NEW_BM1_DATA BM1
      INNER JOIN AUD_STAT.STAT_AUDIT SA ON BM1.STAT_AUDIT_ID = SA.ID
      LEFT JOIN AUD_STAT.NEW_BM1_LOG L ON BM1.ID = L.BM1_ID
      LEFT JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON L.BUDGET_TYPE_ID = RBT.BUDGET_TYPE_ID 
      LEFT JOIN FAS_ADMIN.REF_AUDIT_ORG_TYPE RAOT ON L.AUDIT_ORG_TYPE = RAOT.ID 
      WHERE SA.IS_ACTIVE = 1 AND SA.PERIOD_ID = :P_PERIOD_ID AND SA.DEPARTMENT_ID = :P_DEPARTMENT_ID
      GROUP BY L.AUDIT_ORG_TYPE, RAOT.AUDIT_ORG_CHECK_NAME, L.BUDGET_TYPE_ID, RBT.BUDGET_SHORT_NAME
      ORDER BY L.AUDIT_ORG_TYPE, L.BUDGET_TYPE_ID
      `;
      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
