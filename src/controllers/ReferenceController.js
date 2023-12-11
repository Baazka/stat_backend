const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");

module.exports = {
  async refPeriodList(req, res) {
    try {
      const ListQuery = `SELECT ID, PERIOD_LABEL, PERIOD_YEAR FROM AUD_STAT.REF_PERIOD WHERE IS_ACTIVE = 1 ORDER BY ID DESC`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refDepartmentList(req, res) {
    try {
      const deptype = req.query.DepType;

      let ListQuery =
        `SELECT DEPARTMENT_ID, DEPARTMENT_NAME, DEPARTMENT_SHORT_NAME FROM AUD_ORG.REF_DEPARTMENT WHERE IS_ACTIVE = 1 AND DEPARTMENT_TYPE =  ` +
        deptype;

      ListQuery += `\nORDER BY DEPARTMENT_ID`;

      const result = await OracleDB.simpleExecute(ListQuery);
      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refEmployeeList(req, res) {
    try {
      let params = {};
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID);

      let ListQuery = `SELECT SU.USER_ID, SU.USER_CODE, SU.USER_NAME, RD.DEPARTMENT_ID, RD.DEPARTMENT_NAME, RS.SUB_DEPARTMENT_NAME, RP.POSITION_NAME, RP.SUB_DEPARTMENT_ID
      FROM AUD_REG.SYSTEM_USER SU 
      INNER JOIN AUD_HR.REG_EMPLOYEE RE ON SU.USER_CODE = RE.EMP_CODE
      INNER JOIN AUD_HR.REG_POSITION RP ON RE.EMP_POSITION_ID = RP.POSITION_ID
      INNER JOIN AUD_HR.REF_POSITION_LEVEL PL ON RP.POSITION_LEVEL_ID = PL.POSITION_LEVEL_ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON RP.DEPARTMENT_ID = RD.DEPARTMENT_ID 
      LEFT JOIN AUD_HR.REF_SUB_DEPARTMENT RS ON RP.DEPARTMENT_ID = RS.DEPARTMENT_ID AND RP.SUB_DEPARTMENT_ID = RS.SUB_DEPARTMENT_ID
      WHERE RE.IS_ACTIVE = 1 AND SU.IS_ACTIVE = 1 AND SU.IS_TEST = 0 AND PL.EMP_SUB_ROLE_ID > 3 
      AND (RP.DEPARTMENT_ID = NVL(:P_DEPARTMENT_ID, RP.DEPARTMENT_ID)) `;

      if (req.body.SUB_DEPARTMENT_ID !== undefined) {
        params.P_SUB_DEPARTMENT_ID = parseInt(req.body.SUB_DEPARTMENT_ID);
        ListQuery += `\n AND (RP.SUB_DEPARTMENT_ID = NVL(:P_SUB_DEPARTMENT_ID, RP.SUB_DEPARTMENT_ID))`;
      }
      ListQuery += `\n ORDER BY RP.DEPARTMENT_ID, RP.SUB_DEPARTMENT_ID, SU.USER_CODE`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refDocumentList(req, res) {
    try {
      const doctype = req.query.DocType;

      let ListQuery =
        `SELECT ID, DOCUMENT_NAME, DOCUMENT_SHORT_NAME FROM AUD_STAT.REF_DOCUMENT WHERE IS_ACTIVE = 1 AND DOCUMENT_TYPE = ` +
        doctype;

      ListQuery += `\nORDER BY DOCUMENT_ORDER`;

      const result = await OracleDB.simpleExecute(ListQuery);
      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refAuditTypeList(req, res) {
    try {
      const ListQuery = `SELECT AUDIT_TYPE_ID, AUDIT_TYPE_NAME FROM AUD_STAT.REF_AUDIT_TYPE WHERE IS_ACTIVE = 1 ORDER BY AUDIT_TYPE_ID`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refPeriodList(req, res) {
    try {
      const ListQuery = `SELECT PERIOD_ID, YEAR_LABEL, YEAR_NAME FROM FAS_ADMIN.REF_PERIOD WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refErrorConflictList(req, res) {
    try {
      const ListQuery = `SELECT ERROR_CONFLICT_ID, ERROR_CONFLICT_NAME FROM AUD_STAT.REF_ERROR_CONFLICT WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refSolutionList(req, res) {
    try {
      const ListQuery = `SELECT SOLUTION_ID, SOLUTION_NAME FROM AUD_STAT.REF_SOLUTION WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refExpertTypeList(req, res) {
    try {
      const ListQuery = `SELECT EXPERT_TYPE_ID, EXPERT_TYPE_NAME FROM AUD_STAT.REF_EXPERT_TYPE WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refExpertReasonList(req, res) {
    try {
      const ListQuery = `SELECT EXPERT_REASON_ID, EXPERT_REASON_NAME FROM AUD_STAT.REF_EXPERT_REASON WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
