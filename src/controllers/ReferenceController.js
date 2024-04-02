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
        `SELECT ID, DOCUMENT_NAME, DOCUMENT_SHORT_NAME, IS_TAB FROM AUD_STAT.REF_DOCUMENT WHERE IS_ACTIVE = 1 AND DOCUMENT_TYPE = ` +
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
  async refPeriodListYear(req, res) {
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
  async refBudgetLevelList(req, res) {
    try {
      const ListQuery = `SELECT BUDGET_LEVEL_ID, BUDGET_LEVEL_NAME FROM AUD_ORG.REF_BUDGET_LEVEL WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refConclusionFormList(req, res) {
    try {
      const ListQuery = `SELECT CONCLUSION_FORM_ID, CONCLUSION_FORM_NAME FROM AUD_STAT.REF_CONCLUSION_FORM WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refConclusionTypeList(req, res) {
    try {
      const ListQuery = `SELECT CONCLUSION_TYPE_ID, CONCLUSION_TYPE_NAME FROM AUD_STAT.REF_CONCLUSION_TYPE WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refSubDepartmentList(req, res) {
    try {
      const ListQuery = `SELECT SUB_DEPARTMENT_ID, DEPARTMENT_ID, SUB_DEPARTMENT_SHORT_NAME, SUB_DEPARTMENT_NAME FROM AUD_HR.REF_SUB_DEPARTMENT WHERE IS_ACTIVE = 1 ORDER BY SUB_DEPARTMENT_ID`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refBenefitTypeList(req, res) {
    try {
      const ListQuery = `SELECT BENEFIT_TYPE_ID, BENEFIT_TYPE_NAME FROM AUD_STAT.REF_BENEFIT_TYPE WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refMovementTypeList(req, res) {
    try {
      const ListQuery = `SELECT MOVEMENT_TYPE_ID, MOVEMENT_TYPE_NAME FROM AUD_HR.REF_MOVEMENT_TYPE WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refMovementSubTypeList(req, res) {
    try {
      const ListQuery = `SELECT MOVEMENT_SUB_TYPE_ID, MOVEMENT_SUB_TYPE_NAME, MOVEMENT_TYPE_ID FROM AUD_HR.REF_MOVEMENT_SUB_TYPE WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refTrainEnvironmentList(req, res) {
    try {
      const ListQuery = `SELECT TRAIN_ENVIRONMENT_ID, TRAIN_ENVIRONMENT_NAME FROM AUD_STAT.REF_TRAIN_ENVIRONMENT WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refTrainCatergoryList(req, res) {
    try {
      const ListQuery = `SELECT TRAIN_CATEGORY_ID, TRAIN_CATEGORY_NAME FROM AUD_STAT.REF_TRAIN_CATEGORY WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refTrainDirectionList(req, res) {
    try {
      const ListQuery = `SELECT TRAIN_DIRECTION_ID, TRAIN_DIRECTION_NAME FROM AUD_STAT.REF_TRAIN_DIRECTION WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refInfoTypeList(req, res) {
    try {
      const ListQuery = `SELECT INFO_TYPE_ID, INFO_TYPE_NAME FROM AUD_STAT.REF_INFO_TYPE WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refRecommendationTypeList(req, res) {
    try {
      const ListQuery = `SELECT RECOMMENDATION_TYPE_ID, RECOMMENDATION_TYPE_NAME FROM AUD_STAT.REF_RECOMMENDATION_TYPE WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refReportTypeList(req, res) {
    try {
      const ListQuery = `SELECT REPORT_TYPE_ID, REPORT_TYPE_NAME FROM AUD_STAT.REF_REPORT_TYPE WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async refReportETypeList(req, res) {
    try {
      const ListQuery = `SELECT REPORT_ETYPE_ID, REPORT_ETYPE_NAME FROM AUD_STAT.REF_REPORT_ETYPE WHERE IS_ACTIVE = 1`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
