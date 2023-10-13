const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");
const { CheckNullInt, DateFormat } = require("../utils/Helper");

module.exports = {
  async BM1List(req, res) {
    try {
      let params = {};
      params.P_PERIOD_YEAR = parseInt(req.body.PERIOD_LABEL, 10);
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID, 10);

      let ListQuery = `SELECT 
      BM1.ID,
      FAS.FAS_AUDIT_ID AUDIT_ID,
      FAS.AUDIT_TYPE_ID,
      FAS.AUDIT_TYPE_NAME,
      FAS.AUDIT_NAME,
      FAS.AUDIT_CODE,
      FAS.ENT_NAME,
      FAS.ORG_REGISTER_NO,
      FAS.BUDGET_TYPE_ID,
      FAS.BUDGET_SHORT_NAME,
      FAS.SALBAR_ANGILAL, 
      --HOSLUULAH
      --SEDVIN UNDESLEL
      FAS.FORM_TYPE_ID,
      FAS.AUDIT_TYPE,
      --TATGALZSAN
      BM1.IS_EXPERT_ATTEND,
      BM1.IS_PRESS_REPORT,
      BM1.WORK_PEOPLE,
      BM1.WORK_DAY,
      BM1.WORK_TIME,
      FAS.TUL_BENEFIT,
      FAS.TOD_BENEFIT, 
      FAS.AUDIT_ORG_TYPE,
      FAS.AUDIT_ORG_CHECK_NAME,
      FAS.DEPARTMENT_NAME,
      FAS.CHECK_DEPARTMENT_NAME,
      FAS.AUDIT_DEPARTMENT_NAME,
      FAS.AUDITOR_LEAD,
      FAS.AUDITOR_MEMBER
      
      FROM AUD_STAT.NEW_BM1_DATA BM1
      RIGHT JOIN (SELECT 
      --NEW TABLE ID
      FA.ID FAS_AUDIT_ID,
      RAT.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ||' - '|| RAT.AUDIT_TYPE_NAME AUDIT_NAME,
      FA.AUDIT_CODE,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ENT_NAME,
      AO.ORG_REGISTER_NO,
      RBT.BUDGET_TYPE_ID,
      RBT.BUDGET_SHORT_NAME,
      RDI.IND_VALUE_NAME SALBAR_ANGILAL, 
      RFT.FORM_TYPE_ID,
      RFT.FORM_TYPE_NAME AUDIT_TYPE,
      C.TUL_BENEFIT,
      NVL(CASE WHEN(CASE WHEN FA.STATUS = 1 AND FA.PERIOD_ID > 3 THEN 3 ELSE FA.AUDIT_FORM_TYPE END) = 1 THEN A.SUO ELSE B.SUO END, 0) + 
      NVL(CASE WHEN(CASE WHEN FA.STATUS = 1 AND FA.PERIOD_ID > 3 THEN 3 ELSE FA.AUDIT_FORM_TYPE END) = 1 THEN D.ZAL_AMOUNT ELSE D1.ZAL_AMOUNT_SAMPLE END, 0) TOD_BENEFIT, 
      FA.AUDIT_ORG_TYPE,
      RAOT.AUDIT_ORG_CHECK_NAME,
      (CASE WHEN RCD.DEPARTMENT_NAME IS NOT NULL AND FA.AUDIT_ORG_TYPE = 1 AND FA.AUDIT_CHECK_DEP_ID IN (101,102) THEN RD.DEPARTMENT_NAME||' - '||RCD.DEPARTMENT_NAME ELSE RD.DEPARTMENT_NAME END) DEPARTMENT_NAME,
      RD.DEPARTMENT_NAME AS CHECK_DEPARTMENT_NAME,
      RD1.DEPARTMENT_NAME AS AUDIT_DEPARTMENT_NAME,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FATD.ID) FROM FAS_ADMIN.FAS_AUDIT_TEAM_DATA FATD INNER JOIN AUD_REG.SYSTEM_USER SU ON FATD.AUDITOR_ID = SU.USER_ID WHERE FATD.FAS_AUDIT_ID = FA.ID AND FATD.ROLE_ID = 2 AND FATD.IS_ACTIVE = 1 GROUP BY FATD.FAS_AUDIT_ID) AUDITOR_LEAD,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FATD.ID) FROM FAS_ADMIN.FAS_AUDIT_TEAM_DATA FATD INNER JOIN AUD_REG.SYSTEM_USER SU ON FATD.AUDITOR_ID = SU.USER_ID WHERE FATD.FAS_AUDIT_ID = FA.ID AND FATD.ROLE_ID = 3 AND FATD.IS_ACTIVE = 1 GROUP BY FATD.FAS_AUDIT_ID) AUDITOR_MEMBER,
      FA.PERIOD_ID
      FROM FAS_ADMIN.FAS_AUDIT FA
      
      INNER JOIN AUD_ORG.AUDIT_ENTITY AE ON FA.ENT_ID = AE.ENT_ID
      INNER JOIN AUD_ORG.AUDIT_ORGANIZATION AO ON AE.ENT_ORG_ID = AO.ORG_ID
      LEFT JOIN FAS_ADMIN.ENTITY_NAME EN ON FA.ENT_ID = EN.ENT_ID 
      INNER JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON AE.ENT_BUDGET_TYPE = RBT.BUDGET_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_TYPE RAT ON FA.AUDIT_TYPE = RAT.AUDIT_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_FORM_TYPE RFT ON FA.AUDIT_FORM_TYPE = RFT.FORM_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_ORG_TYPE RAOT ON FA.AUDIT_ORG_TYPE = RAOT.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON FA.USER_DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD1 ON FA.AUDIT_CHECK_DEP_ID = RD1.DEPARTMENT_ID
      LEFT JOIN FAS_ADMIN.REF_CHECK_DEPARTMENT RCD ON FA.AUDIT_CHECK_DEP_ID = RCD.DEPARTMENT_ID AND FA.CHECK_DEPARTMENT_ID = RCD.ID
      LEFT JOIN FAS_ADMIN.FAS_DOCUMENT_DATA FDD2 ON FA.ID = FDD2.FAS_AUDIT_ID AND FDD2.IS_ACTIVE = 1 AND FDD2.IND_ID IN (71,346,437,534)
      LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE RDI ON FDD2.IND_VALUE = RDI.ID
      --START UR UGUUJ
      LEFT JOIN (SELECT FAS_AUDIT_ID, SUM(CASE WHEN INDICATOR_ID IN(228, 672) THEN BENEFIT_RESULT END) TUL_BENEFIT, SUM(CASE WHEN INDICATOR_ID IN (229, 673) THEN BENEFIT_RESULT END) TUL_BUS_BENEFIT 
      FROM FAS_ADMIN.FAS_AUDIT_BENEFIT_DATA
      GROUP BY FAS_AUDIT_ID) C ON FA.ID = C.FAS_AUDIT_ID
      LEFT JOIN (SELECT A.FAS_AUDIT_ID, SUM(CASE WHEN A.UR_UGUUJ_TYPE = 320 THEN A.AMOUNT END) SUO, SUM(CASE WHEN A.UR_UGUUJ_TYPE = 321 THEN A.AMOUNT END) SBUO FROM 
      (SELECT A.FAS_AUDIT_ID,A.ID,A.AMOUNT, C.UR_UGUUJ_TYPE           
      FROM FAS_ADMIN.FAS_DOC_5_1 A
         INNER JOIN FAS_ADMIN.FAS_DOC_5_5 B ON A.ID = B.ID_5_1
         INNER JOIN FAS_ADMIN.FAS_DOC_5_6 C ON A.ID = C.ID_5_1 AND C.IS_CLAUSE = 0
         WHERE A.IS_ACTIVE = 1 AND A.IS_ZALRUULAH = 284 AND B.UR_UGUUJ = 283
      UNION ALL
      SELECT A.FAS_AUDIT_ID,A.ID,A.AMOUNT, B.UR_UGUUJ_TYPE          
      FROM FAS_ADMIN.FAS_DOC_5_1_CLAUSE A
      INNER JOIN FAS_ADMIN.FAS_DOC_5_6 B ON A.ID = B.ID_5_1 AND B.IS_CLAUSE = 1
      WHERE A.IS_ACTIVE = 1 AND A.UR_UGUUJ = 283
      ) A
         GROUP BY A.FAS_AUDIT_ID) A ON FA.ID = A.FAS_AUDIT_ID
         
      LEFT JOIN (SELECT A.FAS_AUDIT_ID, SUM(A.AMOUNT) ZAL_AMOUNT
        FROM FAS_ADMIN.FAS_DOC_5_1 A
        INNER JOIN FAS_ADMIN.FAS_DOC_5_2 B ON A.ID = B.ID_5_1
        INNER JOIN FAS_ADMIN.FAS_DOC_5_6 C ON A.ID = C.ID_5_1
        WHERE A.IS_ACTIVE = 1 AND A.IS_ZALRUULAH = 283 AND B.UR_UGUUJ = 283
      GROUP BY A.FAS_AUDIT_ID) D ON FA.ID = D.FAS_AUDIT_ID
      LEFT JOIN (SELECT A.FAS_AUDIT_ID, SUM(ZAL_AMOUNT_SAMPLE) ZAL_AMOUNT_SAMPLE FROM
      (SELECT A.FAS_AUDIT_ID, A.AMOUNT ZAL_AMOUNT_SAMPLE,A.ID
        FROM FAS_ADMIN.FAS_DOC_5_2_SAMPLE A
        WHERE A.IS_ACTIVE = 1 AND A.UR_UGUUJ = 283
        UNION ALL  
      SELECT  A.FAS_AUDIT_ID, A.AMOUNT ZAL_AMOUNT_SAMPLE, A.ID
      FROM FAS_ADMIN.FAS_DOC_5_1_CLAUSE A
      WHERE A.IS_ACTIVE = 1 AND A.UR_UGUUJ = 283 
      ) A
      INNER JOIN FAS_ADMIN.FAS_DOC_5_6_SAMPLE C ON A.ID = C.ID_5_2
      GROUP BY A.FAS_AUDIT_ID) D1 ON FA.ID = D1.FAS_AUDIT_ID
        
      LEFT JOIN (SELECT A.FAS_AUDIT_ID, SUM(CASE WHEN A.UR_UGUUJ_TYPE = 320 THEN A.AMOUNT END) SUO, SUM(CASE WHEN A.UR_UGUUJ_TYPE = 321 THEN A.AMOUNT END) SBUO FROM 
      (SELECT A.FAS_AUDIT_ID, A.ID, A.AMOUNT, B.UR_UGUUJ_TYPE
      FROM FAS_ADMIN.FAS_DOC_5_5_SAMPLE A
      INNER JOIN FAS_ADMIN.FAS_DOC_5_6_SAMPLE B ON A.ID = B.ID_5_5 AND B.IS_CLAUSE = 0
      WHERE A.IS_ACTIVE = 1 AND A.UR_UGUUJ = 283 
      UNION ALL
      SELECT A.FAS_AUDIT_ID,A.ID, A.AMOUNT, B.UR_UGUUJ_TYPE          
      FROM FAS_ADMIN.FAS_DOC_5_1_CLAUSE A
      INNER JOIN FAS_ADMIN.FAS_DOC_5_6_SAMPLE B ON A.ID = B.ID_5_5 AND B.IS_CLAUSE = 1
      WHERE A.IS_ACTIVE = 1 AND A.UR_UGUUJ = 283 
      ) A
      GROUP BY A.FAS_AUDIT_ID) B ON FA.ID = B.FAS_AUDIT_ID
      --END UR UGUUJ
      
      WHERE FA.IS_ACTIVE = 1 AND AE.IS_ACTIVE = 1 AND FA.AUDIT_CHECK_DEP_ID = :P_DEPARTMENT_ID AND FA.PERIOD_ID = (SELECT PERIOD_ID FROM FAS_ADMIN.REF_PERIOD WHERE IS_ACTIVE = 1 AND YEAR_LABEL = :P_PERIOD_YEAR)) FAS ON BM1.AUDIT_ID = FAS.FAS_AUDIT_ID AND BM1.AUDIT_TYPE_ID = FAS.AUDIT_TYPE_ID`;

      ListQuery += `\n ORDER BY BM1.ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

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
  async BM2List(req, res) {
    try {
      let params = {};
      params.P_PERIOD_YEAR = parseInt(req.body.PERIOD_LABEL, 10);
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID, 10);

      let ListQuery = `SELECT 
      FA.ID FAS_AUDIT_ID,
      RAT.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ||' - '|| RAT.AUDIT_TYPE_NAME AUDIT_NAME,
      FA.AUDIT_CODE,
      --SEDVIN UNDESLEL
      RFT.FORM_TYPE_ID,
      RFT.FORM_TYPE_NAME AUDIT_TYPE,
      FA.AUDIT_ORG_TYPE,
      RAOT.AUDIT_ORG_CHECK_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ENT_NAME,
      AO.ORG_REGISTER_NO,
      RBT.BUDGET_TYPE_ID,
      RBT.BUDGET_SHORT_NAME,
      RDI.IND_VALUE_NAME SALBAR_ANGILAL, 
      (CASE WHEN RCD.DEPARTMENT_NAME IS NOT NULL AND FA.AUDIT_ORG_TYPE = 1 AND FA.AUDIT_CHECK_DEP_ID IN (101,102) THEN RD.DEPARTMENT_NAME||' - '||RCD.DEPARTMENT_NAME ELSE RD.DEPARTMENT_NAME END) DEPARTMENT_NAME,
      RD.DEPARTMENT_NAME AS CHECK_DEPARTMENT_NAME,
      RD1.DEPARTMENT_NAME AS AUDIT_DEPARTMENT_NAME
      FROM FAS_ADMIN.FAS_AUDIT FA
      INNER JOIN AUD_ORG.AUDIT_ENTITY AE ON FA.ENT_ID = AE.ENT_ID
      INNER JOIN AUD_ORG.AUDIT_ORGANIZATION AO ON AE.ENT_ORG_ID = AO.ORG_ID
      LEFT JOIN FAS_ADMIN.ENTITY_NAME EN ON FA.ENT_ID = EN.ENT_ID 
      INNER JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON AE.ENT_BUDGET_TYPE = RBT.BUDGET_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_TYPE RAT ON FA.AUDIT_TYPE = RAT.AUDIT_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_FORM_TYPE RFT ON FA.AUDIT_FORM_TYPE = RFT.FORM_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_ORG_TYPE RAOT ON FA.AUDIT_ORG_TYPE = RAOT.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON FA.USER_DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD1 ON FA.AUDIT_CHECK_DEP_ID = RD1.DEPARTMENT_ID
      LEFT JOIN FAS_ADMIN.REF_CHECK_DEPARTMENT RCD ON FA.AUDIT_CHECK_DEP_ID = RCD.DEPARTMENT_ID AND FA.CHECK_DEPARTMENT_ID = RCD.ID
      LEFT JOIN FAS_ADMIN.FAS_DOCUMENT_DATA FDD2 ON FA.ID = FDD2.FAS_AUDIT_ID AND FDD2.IS_ACTIVE = 1 AND FDD2.IND_ID IN (71,346,437,534)
      LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE RDI ON FDD2.IND_VALUE = RDI.ID
      WHERE FA.IS_ACTIVE = 1 AND AE.IS_ACTIVE = 1
      AND FA.AUDIT_CHECK_DEP_ID = :P_DEPARTMENT_ID AND FA.PERIOD_ID = (SELECT PERIOD_ID FROM FAS_ADMIN.REF_PERIOD WHERE IS_ACTIVE = 1 AND YEAR_LABEL = :P_PERIOD_YEAR)`;

      //ListQuery += `\n ORDER BY BM1.ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async BM3List(req, res) {
    try {
      let params = {};
      params.P_PERIOD_YEAR = parseInt(req.body.PERIOD_LABEL, 10);
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID, 10);

      let ListQuery = `SELECT 
      FA.ID FAS_AUDIT_ID,
      RAT.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ||' - '|| RAT.AUDIT_TYPE_NAME AUDIT_NAME,
      FA.AUDIT_CODE,
      RFT.FORM_TYPE_ID,
      RFT.FORM_TYPE_NAME AUDIT_TYPE,
      FA.AUDIT_ORG_TYPE,
      RAOT.AUDIT_ORG_CHECK_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ENT_NAME,
      AO.ORG_REGISTER_NO,
      RBT.BUDGET_TYPE_ID,
      RBT.BUDGET_SHORT_NAME,
      RD.DEPARTMENT_NAME AS CHECK_DEPARTMENT_NAME,
      RD1.DEPARTMENT_NAME AS AUDIT_DEPARTMENT_NAME,
      A.IS_ZALRUULAH,
      A.IS_ZALRUULAH_NAME,
      A.ALD_SHORT_DESC,
      A.AMOUNT,
      A.IS_SUB_ERROR_CONFLICT,
      A.IS_SUB_ERROR_CONFLICT_NAME,
      A.UR_UGUUJ, A.UR_UGUUJ_NAME,
      A.UR_UGUUJ_TYPE, A.UR_UGUUJ_TYPE_NAME
      FROM FAS_ADMIN.FAS_AUDIT FA
      INNER JOIN AUD_ORG.AUDIT_ENTITY AE ON FA.ENT_ID = AE.ENT_ID
      INNER JOIN AUD_ORG.AUDIT_ORGANIZATION AO ON AE.ENT_ORG_ID = AO.ORG_ID
      LEFT JOIN FAS_ADMIN.ENTITY_NAME EN ON FA.ENT_ID = EN.ENT_ID 
      INNER JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON AE.ENT_BUDGET_TYPE = RBT.BUDGET_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_TYPE RAT ON FA.AUDIT_TYPE = RAT.AUDIT_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_FORM_TYPE RFT ON FA.AUDIT_FORM_TYPE = RFT.FORM_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_ORG_TYPE RAOT ON FA.AUDIT_ORG_TYPE = RAOT.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON FA.USER_DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD1 ON FA.AUDIT_CHECK_DEP_ID = RD1.DEPARTMENT_ID
      INNER JOIN ((
        SELECT A.FAS_AUDIT_ID, C.ID, A.SHORT_DESC ALD_SHORT_DESC,
        A.SOLUTION, V1.IND_VALUE_NAME SOLUTION_NAME,
        A.AMOUNT, 
        NULL IS_ZALRUULAH, NULL IS_ZALRUULAH_NAME,
        NULL IS_SUB_ERROR_CONFLICT, NULL IS_SUB_ERROR_CONFLICT_NAME,
        A.UR_UGUUJ, V8.IND_VALUE_NAME UR_UGUUJ_NAME,
        E.UR_UGUUJ_TYPE UR_UGUUJ_TYPE, V9.IND_VALUE_NAME UR_UGUUJ_TYPE_NAME
        FROM FAS_ADMIN.FAS_DOC_5_5_SAMPLE A
        INNER JOIN FAS_ADMIN.FAS_DOC_7_1 C ON A.ID = C.ID_5_5
        LEFT JOIN FAS_ADMIN.FAS_DOC_5_6_SAMPLE E ON A.ID = E.ID_5_5 AND E.IS_CLAUSE = 0
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V1 ON A.SOLUTION = V1.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V8 ON A.UR_UGUUJ = V8.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V9 ON E.UR_UGUUJ_TYPE = V9.ID
        WHERE A.IS_ACTIVE = 1 AND A.SOLUTION != 341 AND A.IS_ERROR_CONFLICT = 285
        UNION 
        SELECT A.FAS_AUDIT_ID, C.ID, A.SHORT_DESC ALD_SHORT_DESC,
        A.SOLUTION, V1.IND_VALUE_NAME SOLUTION_NAME,
        A.AMOUNT, 
        NULL IS_ZALRUULAH, NULL IS_ZALRUULAH_NAME,
        NULL IS_SUB_ERROR_CONFLICT, NULL IS_SUB_ERROR_CONFLICT_NAME,
        A.UR_UGUUJ, V8.IND_VALUE_NAME UR_UGUUJ_NAME,
        E.UR_UGUUJ_TYPE UR_UGUUJ_TYPE, V9.IND_VALUE_NAME UR_UGUUJ_TYPE_NAME
        FROM FAS_ADMIN.FAS_DOC_5_1_CLAUSE A
        INNER JOIN FAS_ADMIN.FAS_DOC_7_1 C ON A.ID = C.ID_5_1_CLAUSE
        LEFT JOIN FAS_ADMIN.FAS_DOC_5_6_SAMPLE E ON A.ID = E.ID_5_5 AND E.IS_CLAUSE = 1
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V1 ON A.SOLUTION = V1.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V8 ON A.UR_UGUUJ = V8.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V9 ON E.UR_UGUUJ_TYPE = V9.ID
        WHERE A.IS_ACTIVE = 1 AND A.SOLUTION IS NOT NULL AND A.IS_ERROR_CONFLICT = 285
        ) 
        UNION
        (
        SELECT A.FAS_AUDIT_ID, C.ID, A.SHORT_DESC ALD_SHORT_DESC,
        A.SOLUTION, V1.IND_VALUE_NAME SOLUTION_NAME, 
        A.AMOUNT, 
        NULL IS_ZALRUULAH, NULL IS_ZALRUULAH_NAME,
        NULL IS_SUB_ERROR_CONFLICT, NULL IS_SUB_ERROR_CONFLICT_NAME,
        A.UR_UGUUJ, V8.IND_VALUE_NAME UR_UGUUJ_NAME,
        E.UR_UGUUJ_TYPE UR_UGUUJ_TYPE, V9.IND_VALUE_NAME UR_UGUUJ_TYPE_NAME
        FROM FAS_ADMIN.FAS_DOC_5_1_CLAUSE A
        INNER JOIN FAS_ADMIN.FAS_DOC_7_1 C ON A.ID = C.ID_5_1_CLAUSE
        LEFT JOIN FAS_ADMIN.FAS_DOC_5_6 E ON A.ID = E.ID_5_1 AND E.IS_CLAUSE = 1
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V1 ON A.SOLUTION = V1.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V8 ON A.UR_UGUUJ = V8.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V9 ON E.UR_UGUUJ_TYPE = V9.ID
        WHERE A.IS_ACTIVE = 1 AND A.SOLUTION IS NOT NULL AND A.IS_ERROR_CONFLICT = 285
        UNION 
        SELECT A.FAS_AUDIT_ID, C.ID, A.SHORT_DESC ALD_SHORT_DESC,
        B.SOLUTION, V1.IND_VALUE_NAME SOLUTION_NAME, 
        A.AMOUNT, 
        A.IS_ZALRUULAH, V6.IND_VALUE_NAME IS_ZALRUULAH_NAME,
        D.IS_SUB_ERROR_CONFLICT, V7.IND_VALUE_NAME IS_SUB_ERROR_CONFLICT_NAME,
        B.UR_UGUUJ, V8.IND_VALUE_NAME UR_UGUUJ_NAME,
        E.UR_UGUUJ_TYPE UR_UGUUJ_TYPE, V9.IND_VALUE_NAME UR_UGUUJ_TYPE_NAME
        FROM FAS_ADMIN.FAS_DOC_5_1 A
        INNER JOIN FAS_ADMIN.FAS_DOC_5_5 B ON A.ID = B.ID_5_1
        INNER JOIN FAS_ADMIN.FAS_DOC_7_1 C ON A.ID = C.ID_5_1
        LEFT JOIN FAS_ADMIN.FAS_DOC_5_2 D ON A.ID = D.ID_5_1
        LEFT JOIN FAS_ADMIN.FAS_DOC_5_6 E ON A.ID = E.ID_5_1 AND E.IS_CLAUSE = 0
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V1 ON B.SOLUTION = V1.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V6 ON A.IS_ZALRUULAH = V6.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V7 ON D.IS_SUB_ERROR_CONFLICT = V7.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V8 ON B.UR_UGUUJ = V8.ID
        LEFT JOIN FAS_ADMIN.REF_DOCUMENT_INDICATOR_VALUE V9 ON E.UR_UGUUJ_TYPE = V9.ID
        WHERE A.IS_ACTIVE = 1 AND B.SOLUTION != 341 AND A.IS_ERROR_CONFLICT = 285
        )) A ON FA.ID = A.FAS_AUDIT_ID
      WHERE FA.IS_ACTIVE = 1 AND AE.IS_ACTIVE = 1
      AND FA.AUDIT_CHECK_DEP_ID = :P_DEPARTMENT_ID AND FA.PERIOD_ID = (SELECT PERIOD_ID FROM FAS_ADMIN.REF_PERIOD WHERE IS_ACTIVE = 1 AND YEAR_LABEL = :P_PERIOD_YEAR)`;

      //ListQuery += `\n ORDER BY BM1.ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async BM4List(req, res) {
    try {
      let params = {};
      params.P_PERIOD_YEAR = parseInt(req.body.PERIOD_LABEL, 10);
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID, 10);

      let ListQuery = `SELECT 
      FA.ID FAS_AUDIT_ID,
      RAT.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ||' - '|| RAT.AUDIT_TYPE_NAME AUDIT_NAME,
      FA.AUDIT_CODE,
      RFT.FORM_TYPE_ID,
      RFT.FORM_TYPE_NAME AUDIT_TYPE,
      FA.AUDIT_ORG_TYPE,
      RAOT.AUDIT_ORG_CHECK_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ENT_NAME,
      AO.ORG_REGISTER_NO,
      RBT.BUDGET_TYPE_ID,
      RBT.BUDGET_SHORT_NAME,
      RD.DEPARTMENT_NAME AS CHECK_DEPARTMENT_NAME,
      RD1.DEPARTMENT_NAME AS AUDIT_DEPARTMENT_NAME
      FROM FAS_ADMIN.FAS_AUDIT FA
      INNER JOIN AUD_ORG.AUDIT_ENTITY AE ON FA.ENT_ID = AE.ENT_ID
      INNER JOIN AUD_ORG.AUDIT_ORGANIZATION AO ON AE.ENT_ORG_ID = AO.ORG_ID
      LEFT JOIN FAS_ADMIN.ENTITY_NAME EN ON FA.ENT_ID = EN.ENT_ID 
      INNER JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON AE.ENT_BUDGET_TYPE = RBT.BUDGET_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_TYPE RAT ON FA.AUDIT_TYPE = RAT.AUDIT_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_FORM_TYPE RFT ON FA.AUDIT_FORM_TYPE = RFT.FORM_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_ORG_TYPE RAOT ON FA.AUDIT_ORG_TYPE = RAOT.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON FA.USER_DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD1 ON FA.AUDIT_CHECK_DEP_ID = RD1.DEPARTMENT_ID
      WHERE FA.IS_ACTIVE = 1 AND AE.IS_ACTIVE = 1
      AND FA.AUDIT_CHECK_DEP_ID = :P_DEPARTMENT_ID AND FA.PERIOD_ID = (SELECT PERIOD_ID FROM FAS_ADMIN.REF_PERIOD WHERE IS_ACTIVE = 1 AND YEAR_LABEL = :P_PERIOD_YEAR)`;

      //ListQuery += `\n ORDER BY BM1.ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async BM5List(req, res) {
    try {
      let params = {};
      params.P_PERIOD_YEAR = parseInt(req.body.PERIOD_LABEL, 10);
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID, 10);

      let ListQuery = `SELECT 
      FA.ID FAS_AUDIT_ID,
      RAT.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ||' - '|| RAT.AUDIT_TYPE_NAME AUDIT_NAME,
      FA.AUDIT_CODE,
      RFT.FORM_TYPE_ID,
      RFT.FORM_TYPE_NAME AUDIT_TYPE,
      FA.AUDIT_ORG_TYPE,
      RAOT.AUDIT_ORG_CHECK_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ENT_NAME,
      AO.ORG_REGISTER_NO,
      RBT.BUDGET_TYPE_ID,
      RBT.BUDGET_SHORT_NAME,
      RD.DEPARTMENT_NAME AS CHECK_DEPARTMENT_NAME,
      RD1.DEPARTMENT_NAME AS AUDIT_DEPARTMENT_NAME
      FROM FAS_ADMIN.FAS_AUDIT FA
      INNER JOIN AUD_ORG.AUDIT_ENTITY AE ON FA.ENT_ID = AE.ENT_ID
      INNER JOIN AUD_ORG.AUDIT_ORGANIZATION AO ON AE.ENT_ORG_ID = AO.ORG_ID
      LEFT JOIN FAS_ADMIN.ENTITY_NAME EN ON FA.ENT_ID = EN.ENT_ID 
      INNER JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON AE.ENT_BUDGET_TYPE = RBT.BUDGET_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_TYPE RAT ON FA.AUDIT_TYPE = RAT.AUDIT_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_FORM_TYPE RFT ON FA.AUDIT_FORM_TYPE = RFT.FORM_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_ORG_TYPE RAOT ON FA.AUDIT_ORG_TYPE = RAOT.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON FA.USER_DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD1 ON FA.AUDIT_CHECK_DEP_ID = RD1.DEPARTMENT_ID
      WHERE FA.IS_ACTIVE = 1 AND AE.IS_ACTIVE = 1
      AND FA.AUDIT_CHECK_DEP_ID = :P_DEPARTMENT_ID AND FA.PERIOD_ID = (SELECT PERIOD_ID FROM FAS_ADMIN.REF_PERIOD WHERE IS_ACTIVE = 1 AND YEAR_LABEL = :P_PERIOD_YEAR)`;

      //ListQuery += `\n ORDER BY BM1.ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async BM6List(req, res) {
    try {
      let params = {};
      params.P_PERIOD_YEAR = parseInt(req.body.PERIOD_LABEL, 10);
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID, 10);

      let ListQuery = `SELECT 
      FA.ID FAS_AUDIT_ID,
      RAT.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ||' - '|| RAT.AUDIT_TYPE_NAME AUDIT_NAME,
      FA.AUDIT_CODE,
      RFT.FORM_TYPE_ID,
      RFT.FORM_TYPE_NAME AUDIT_TYPE,
      FA.AUDIT_ORG_TYPE,
      RAOT.AUDIT_ORG_CHECK_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ENT_NAME,
      AO.ORG_REGISTER_NO,
      RBT.BUDGET_TYPE_ID,
      RBT.BUDGET_SHORT_NAME,
      RD.DEPARTMENT_NAME AS CHECK_DEPARTMENT_NAME,
      RD1.DEPARTMENT_NAME AS AUDIT_DEPARTMENT_NAME
      FROM FAS_ADMIN.FAS_AUDIT FA
      INNER JOIN AUD_ORG.AUDIT_ENTITY AE ON FA.ENT_ID = AE.ENT_ID
      INNER JOIN AUD_ORG.AUDIT_ORGANIZATION AO ON AE.ENT_ORG_ID = AO.ORG_ID
      LEFT JOIN FAS_ADMIN.ENTITY_NAME EN ON FA.ENT_ID = EN.ENT_ID 
      INNER JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON AE.ENT_BUDGET_TYPE = RBT.BUDGET_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_TYPE RAT ON FA.AUDIT_TYPE = RAT.AUDIT_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_FORM_TYPE RFT ON FA.AUDIT_FORM_TYPE = RFT.FORM_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_ORG_TYPE RAOT ON FA.AUDIT_ORG_TYPE = RAOT.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON FA.USER_DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD1 ON FA.AUDIT_CHECK_DEP_ID = RD1.DEPARTMENT_ID
      WHERE FA.IS_ACTIVE = 1 AND AE.IS_ACTIVE = 1
      AND FA.AUDIT_CHECK_DEP_ID = :P_DEPARTMENT_ID AND FA.PERIOD_ID = (SELECT PERIOD_ID FROM FAS_ADMIN.REF_PERIOD WHERE IS_ACTIVE = 1 AND YEAR_LABEL = :P_PERIOD_YEAR)`;

      //ListQuery += `\n ORDER BY BM1.ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async BM7List(req, res) {
    try {
      let params = {};
      params.P_PERIOD_YEAR = parseInt(req.body.PERIOD_LABEL, 10);
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID, 10);

      let ListQuery = `SELECT 
      FA.ID FAS_AUDIT_ID,
      RAT.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ||' - '|| RAT.AUDIT_TYPE_NAME AUDIT_NAME,
      FA.AUDIT_CODE,
      RFT.FORM_TYPE_ID,
      RFT.FORM_TYPE_NAME AUDIT_TYPE,
      FA.AUDIT_ORG_TYPE,
      RAOT.AUDIT_ORG_CHECK_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ENT_NAME,
      AO.ORG_REGISTER_NO,
      RBT.BUDGET_TYPE_ID,
      RBT.BUDGET_SHORT_NAME,
      RD.DEPARTMENT_NAME AS CHECK_DEPARTMENT_NAME,
      RD1.DEPARTMENT_NAME AS AUDIT_DEPARTMENT_NAME
      FROM FAS_ADMIN.FAS_AUDIT FA
      INNER JOIN AUD_ORG.AUDIT_ENTITY AE ON FA.ENT_ID = AE.ENT_ID
      INNER JOIN AUD_ORG.AUDIT_ORGANIZATION AO ON AE.ENT_ORG_ID = AO.ORG_ID
      LEFT JOIN FAS_ADMIN.ENTITY_NAME EN ON FA.ENT_ID = EN.ENT_ID 
      INNER JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON AE.ENT_BUDGET_TYPE = RBT.BUDGET_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_TYPE RAT ON FA.AUDIT_TYPE = RAT.AUDIT_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_FORM_TYPE RFT ON FA.AUDIT_FORM_TYPE = RFT.FORM_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_ORG_TYPE RAOT ON FA.AUDIT_ORG_TYPE = RAOT.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON FA.USER_DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD1 ON FA.AUDIT_CHECK_DEP_ID = RD1.DEPARTMENT_ID
      WHERE FA.IS_ACTIVE = 1 AND AE.IS_ACTIVE = 1
      AND FA.AUDIT_CHECK_DEP_ID = :P_DEPARTMENT_ID AND FA.PERIOD_ID = (SELECT PERIOD_ID FROM FAS_ADMIN.REF_PERIOD WHERE IS_ACTIVE = 1 AND YEAR_LABEL = :P_PERIOD_YEAR)`;

      //ListQuery += `\n ORDER BY BM1.ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async BM8List(req, res) {
    try {
      let params = {};
      params.P_PERIOD_YEAR = parseInt(req.body.PERIOD_LABEL, 10);
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID, 10);

      let ListQuery = `SELECT 
      FA.ID FAS_AUDIT_ID,
      RAT.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ||' - '|| RAT.AUDIT_TYPE_NAME AUDIT_NAME,
      FA.AUDIT_CODE,
      RFT.FORM_TYPE_ID,
      RFT.FORM_TYPE_NAME AUDIT_TYPE,
      FA.AUDIT_ORG_TYPE,
      RAOT.AUDIT_ORG_CHECK_NAME,
      NVL(EN.PERIOD5_NAME, NVL(EN.PERIOD4_NAME, NVL(EN.PERIOD3_NAME, AE.ENT_NAME))) ENT_NAME,
      AO.ORG_REGISTER_NO,
      RBT.BUDGET_TYPE_ID,
      RBT.BUDGET_SHORT_NAME,
      RD.DEPARTMENT_NAME AS CHECK_DEPARTMENT_NAME,
      RD1.DEPARTMENT_NAME AS AUDIT_DEPARTMENT_NAME
      FROM FAS_ADMIN.FAS_AUDIT FA
      INNER JOIN AUD_ORG.AUDIT_ENTITY AE ON FA.ENT_ID = AE.ENT_ID
      INNER JOIN AUD_ORG.AUDIT_ORGANIZATION AO ON AE.ENT_ORG_ID = AO.ORG_ID
      LEFT JOIN FAS_ADMIN.ENTITY_NAME EN ON FA.ENT_ID = EN.ENT_ID 
      INNER JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON AE.ENT_BUDGET_TYPE = RBT.BUDGET_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_TYPE RAT ON FA.AUDIT_TYPE = RAT.AUDIT_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_FORM_TYPE RFT ON FA.AUDIT_FORM_TYPE = RFT.FORM_TYPE_ID
      INNER JOIN FAS_ADMIN.REF_AUDIT_ORG_TYPE RAOT ON FA.AUDIT_ORG_TYPE = RAOT.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON FA.USER_DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD1 ON FA.AUDIT_CHECK_DEP_ID = RD1.DEPARTMENT_ID
      WHERE FA.IS_ACTIVE = 1 AND AE.IS_ACTIVE = 1
      AND FA.AUDIT_CHECK_DEP_ID = :P_DEPARTMENT_ID AND FA.PERIOD_ID = (SELECT PERIOD_ID FROM FAS_ADMIN.REF_PERIOD WHERE IS_ACTIVE = 1 AND YEAR_LABEL = :P_PERIOD_YEAR)`;

      //ListQuery += `\n ORDER BY BM1.ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
