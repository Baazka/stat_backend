const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");
const { CheckNullInt, DateFormat } = require("../utils/Helper");

module.exports = {
  async regStatisticList(req, res) {
    try {
      let params = {};
      params.periodid = parseInt(req.body.PERIOD_ID, 10);
      params.docid = parseInt(req.body.FILTER_DOCUMENT_ID, 10);
      params.depid =
        req.body.USER_TYPE_NAME === "ADMIN" ||
        req.body.USER_TYPE_NAME === "ALL_VIEWER" ||
        req.body.USER_TYPE_NAME === "STAT_ADMIN" ||
        req.body.USER_TYPE_NAME === "ANUZG"
          ? parseInt(req.body.FILTER_DEPARTMENT_ID, 10)
          : parseInt(req.body.USER_DEPARTMENT_ID, 10);
      params.doctype = req.body.USER_TYPE_NAME === "ANUZG" ? 1 : null;
      params.userid = parseInt(req.body.USER_ID, 10);
      params.userid = parseInt(req.body.USER_ID, 10);
      params.usertype = req.body.USER_TYPE_NAME;

      let ListQuery = `   SELECT 
      SA.ID,
      RP.PERIOD_LABEL,
      SA.DEPARTMENT_ID ,
      RP.PERIOD_YEAR,
      SA.CONFIRM_DATE,
      RD.DEPARTMENT_NAME,
      SA.DOCUMENT_ID,
      D.DOCUMENT_NAME,
      D.DOCUMENT_SHORT_NAME,
      SA.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      SU.USER_NAME,
      SA.CREATED_DATE,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FAT.ID) FROM AUD_STAT.STAT_AUDIT_TEAM FAT INNER JOIN AUD_REG.SYSTEM_USER SU ON FAT.AUDITOR_ID = SU.USER_ID WHERE FAT.STAT_AUDIT_ID = SA.ID AND FAT.ROLE_ID = 1 AND FAT.IS_ACTIVE = 1 GROUP BY FAT.STAT_AUDIT_ID) AUDITOR_MEMBER,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FAT.ID) FROM AUD_STAT.STAT_AUDIT_TEAM FAT INNER JOIN AUD_REG.SYSTEM_USER SU ON FAT.AUDITOR_ID = SU.USER_ID WHERE FAT.STAT_AUDIT_ID = SA.ID AND FAT.ROLE_ID = 2 AND FAT.IS_ACTIVE = 1 GROUP BY FAT.STAT_AUDIT_ID) AUDIT_APPROVE_MEMBER1,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FAT.ID) FROM AUD_STAT.STAT_AUDIT_TEAM FAT INNER JOIN AUD_REG.SYSTEM_USER SU ON FAT.AUDITOR_ID = SU.USER_ID WHERE FAT.STAT_AUDIT_ID = SA.ID AND FAT.ROLE_ID = 3 AND FAT.IS_ACTIVE = 1 GROUP BY FAT.STAT_AUDIT_ID) AUDIT_APPROVE_MEMBER2,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FAT.ID) FROM AUD_STAT.STAT_AUDIT_TEAM FAT INNER JOIN AUD_REG.SYSTEM_USER SU ON FAT.AUDITOR_ID = SU.USER_ID WHERE FAT.STAT_AUDIT_ID = SA.ID AND FAT.ROLE_ID = 4 AND FAT.IS_ACTIVE = 1 GROUP BY FAT.STAT_AUDIT_ID) AUDIT_APPROVE_MEMBER3,
      SA.IS_LOCK
      FROM AUD_STAT.STAT_AUDIT SA
      INNER JOIN AUD_STAT.REF_PERIOD RP ON SA.PERIOD_ID = RP.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON SA.DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_STAT.REF_DOCUMENT D ON SA.DOCUMENT_ID = D.ID 
      INNER JOIN AUD_STAT.REF_AUDIT_TYPE RAT ON SA.AUDIT_TYPE_ID = RAT.AUDIT_TYPE_ID
      LEFT JOIN AUD_REG.SYSTEM_USER SU ON SA.CREATED_BY = SU.USER_ID
     
  WHERE SA.IS_ACTIVE = 1`;

      const binds = {};
      // if (
      //   params.usertype === "ADMIN" ||
      //   params.usertype === "ALL_VIEWER" ||
      //   params.usertype === "HEAD_AUDITOR" ||
      //   params.usertype === "STAT_ADMIN"
      // ) {
      //   ListQuery += `\n AND 1 = 1 `;
      // } else {
      //   if (params.userid) {
      //     binds.USER_ID = params.userid;
      //     ListQuery += `\n AND EXISTS (SELECT AUDITOR_ID FROM AUD_STAT.STAT_AUDIT_TEAM T WHERE T.IS_ACTIVE = 1 AND T.AUDITOR_ID = :USER_ID AND T.STAT_AUDIT_ID = SA.ID)`;
      //   } //else binds = {};
      // }
      if (
        params.periodid !== 999 &&
        params.periodid !== null &&
        !isNaN(params.periodid)
      ) {
        ListQuery += `\n AND SA.PERIOD_ID = :PERIOD_ID`;
        binds.PERIOD_ID = CheckNullInt(params.periodid);
      }
      if (params.depid !== 999 && !isNaN(params.depid)) {
        ListQuery += `\n AND SA.DEPARTMENT_ID = :DEPARTMENT_ID`;
        binds.DEPARTMENT_ID = CheckNullInt(params.depid);
      }
      if (params.docid !== 999 && !isNaN(params.docid)) {
        ListQuery += `\n AND SA.DOCUMENT_ID = :DOCUMENT_ID`;
        binds.DOCUMENT_ID = CheckNullInt(params.docid);
      }
      if (params.usertype === "ANUZG") {
        ListQuery += `\n AND D.IS_TAB = NVL(:IS_TAB, D.IS_TAB)`;
        binds.IS_TAB = params.doctype;
      }

      ListQuery += `\n ORDER BY RD.DEPARTMENT_ID, D.DOCUMENT_ORDER`;

      //console.log(ListQuery, binds, "bindsbindsbindsbindsbinds");

      const result = await OracleDB.simpleExecute(ListQuery, binds);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async regStatisticListOne(req, res) {
    try {
      let params = {};
      params.ID = parseInt(req.body.ID, 10);
      console.log(req.body, "regStatisticListOne");

      let ListQuery = `SELECT 
      SA.ID,
      RP.PERIOD_LABEL,
      SA.DEPARTMENT_ID ,
      RP.PERIOD_YEAR,
      SA.CONFIRM_DATE,
      RD.DEPARTMENT_NAME,
      SA.DOCUMENT_ID,
      D.DOCUMENT_NAME,
      D.DOCUMENT_SHORT_NAME,
      SA.AUDIT_TYPE_ID,
      RAT.AUDIT_TYPE_NAME,
      SU.USER_NAME,
      SA.CREATED_DATE,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FAT.ID) FROM AUD_STAT.STAT_AUDIT_TEAM FAT INNER JOIN AUD_REG.SYSTEM_USER SU ON FAT.AUDITOR_ID = SU.USER_ID WHERE FAT.STAT_AUDIT_ID = SA.ID AND FAT.ROLE_ID = 1 AND FAT.IS_ACTIVE = 1 GROUP BY FAT.STAT_AUDIT_ID) AUDITOR_MEMBER,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FAT.ID) FROM AUD_STAT.STAT_AUDIT_TEAM FAT INNER JOIN AUD_REG.SYSTEM_USER SU ON FAT.AUDITOR_ID = SU.USER_ID WHERE FAT.STAT_AUDIT_ID = SA.ID AND FAT.ROLE_ID = 2 AND FAT.IS_ACTIVE = 1 GROUP BY FAT.STAT_AUDIT_ID) AUDIT_APPROVE_MEMBER1,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FAT.ID) FROM AUD_STAT.STAT_AUDIT_TEAM FAT INNER JOIN AUD_REG.SYSTEM_USER SU ON FAT.AUDITOR_ID = SU.USER_ID WHERE FAT.STAT_AUDIT_ID = SA.ID AND FAT.ROLE_ID = 3 AND FAT.IS_ACTIVE = 1 GROUP BY FAT.STAT_AUDIT_ID) AUDIT_APPROVE_MEMBER2,
      (SELECT LISTAGG(SU.USER_NAME,', ') WITHIN GROUP(ORDER BY FAT.ID) FROM AUD_STAT.STAT_AUDIT_TEAM FAT INNER JOIN AUD_REG.SYSTEM_USER SU ON FAT.AUDITOR_ID = SU.USER_ID WHERE FAT.STAT_AUDIT_ID = SA.ID AND FAT.ROLE_ID = 4 AND FAT.IS_ACTIVE = 1 GROUP BY FAT.STAT_AUDIT_ID) AUDIT_APPROVE_MEMBER3,
      SA.IS_LOCK
      FROM AUD_STAT.STAT_AUDIT SA
      INNER JOIN AUD_STAT.REF_PERIOD RP ON SA.PERIOD_ID = RP.ID
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON SA.DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_STAT.REF_DOCUMENT D ON SA.DOCUMENT_ID = D.ID
      INNER JOIN AUD_STAT.REF_AUDIT_TYPE RAT ON SA.AUDIT_TYPE_ID = RAT.AUDIT_TYPE_ID
      LEFT JOIN AUD_REG.SYSTEM_USER SU ON SA.CREATED_BY = SU.USER_ID
     
  WHERE SA.IS_ACTIVE = 1 AND SA.ID = :ID`;

      const binds = {};
      binds.ID = params.ID;
      // if (
      //   params.usertype === "ADMIN" ||
      //   params.usertype === "ALL_VIEWER" ||
      //   params.usertype === "HEAD_AUDITOR" ||
      //   params.usertype === "STAT_ADMIN"
      // ) {
      //   ListQuery += `\n AND 1 = 1 `;
      // } else {
      //   if (params.userid) {
      //     binds.USER_ID = params.userid;
      //     ListQuery += `\n AND EXISTS (SELECT AUDITOR_ID FROM AUD_STAT.STAT_AUDIT_TEAM T WHERE T.IS_ACTIVE = 1 AND T.AUDITOR_ID = :USER_ID AND T.STAT_AUDIT_ID = SA.ID)`;
      //   } //else binds = {};
      // }

      ListQuery += `\n ORDER BY RD.DEPARTMENT_ID, D.DOCUMENT_ORDER`;

      //console.log(ListQuery, binds, "bindsbindsbindsbindsbinds");

      const result = await OracleDB.simpleExecute(ListQuery, binds);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async regStatisticIU(req, res) {
    try {
      const queryAuditSEQ = `SELECT AUD_STAT.SEQ_STAT_AUDIT_ID.NEXTVAL FROM DUAL`;
      const queryAudit = `BEGIN AUD_STAT.STAT_AUDIT_I_U(:P_STAT_AUDIT_ID, :P_PERIOD_ID, :P_DEPARTMENT_ID, :P_DOCUMENT_ID, :P_AUDIT_TYPE_ID, :P_CONFIRM_DATE, :P_CREATED_BY); END;`;
      const queryTeam = `BEGIN AUD_STAT.STAT_AUDIT_TEAM_I_U (:P_ID, :P_STAT_AUDIT_ID, :P_AUDITOR_ID, :P_ROLE_ID, :P_IS_ACTIVE, :P_CREATED_BY); END;`;

      let audit = {};
      let team = [];
      function getData(req) {
        audit = {
          P_STAT_AUDIT_ID:
            req.body.Audit.ID != null ? parseInt(req.body.Audit.ID) : null,
          P_PERIOD_ID: CheckNullInt(req.body.Audit.PERIOD_ID),
          P_DEPARTMENT_ID: CheckNullInt(req.body.Audit.DEPARTMENT_ID),
          P_DOCUMENT_ID: CheckNullInt(req.body.Audit.DOCUMENT_ID),
          P_AUDIT_TYPE_ID: CheckNullInt(req.body.Audit.AUDIT_TYPE_ID),
          P_CONFIRM_DATE: DateFormat(req.body.Audit.CONFIRM_DATE),
          P_CREATED_BY: parseInt(req.body.CREATED_BY),
        };
        if (req.body.Team?.length > 0) {
          req.body.Team?.forEach((element) => {
            team.push({
              P_ID: element.ID != null ? parseInt(element.ID) : null,
              P_STAT_AUDIT_ID: CheckNullInt(element.STAT_AUDIT_ID),
              P_AUDITOR_ID: CheckNullInt(element.AUDITOR_ID),
              P_ROLE_ID: CheckNullInt(element.ROLE_ID),
              P_IS_ACTIVE: parseInt(element.IS_ACTIVE),
              P_CREATED_BY: parseInt(req.body.CREATED_BY),
            });
          });
        }
        return { audit, team };
      }

      getData(req);

      let AUDIT_ID;
      if (
        audit.P_STAT_AUDIT_ID === null ||
        audit.P_STAT_AUDIT_ID === undefined
      ) {
        const resultSeq = await OracleDB.simpleExecute(queryAuditSEQ);
        AUDIT_ID = resultSeq.rows[0].NEXTVAL;
        audit.P_STAT_AUDIT_ID = resultSeq.rows[0].NEXTVAL;
      } else AUDIT_ID = audit.P_STAT_AUDIT_ID;

      if (team?.length > 0) {
        team.map((a, index) => {
          team[index].P_STAT_AUDIT_ID = AUDIT_ID;
        });
      }

      const result = await OracleDB.simpleExecute(queryAudit, audit);
      const resultTeam = await OracleDB.multipleExecute(queryTeam, team);
      return res.send({
        status: 200,
        message: "Хадгаллаа.",
      });
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },

  async getStatisticPlan(req, res) {
    try {
      let params = {};

      if (req.body.STAT_ID === undefined || req.body.STAT_ID === null)
        return res.send("STAT_ID ilgeenuu");

      params.STAT_ID = parseInt(req.body.STAT_ID, 10);

      let ListQuery = `SELECT ID, PERIOD_ID, DEPARTMENT_ID, DOCUMENT_ID, AUDIT_TYPE_ID, CONFIRM_DATE, STATUS, IS_ACTIVE, CREATED_BY, CREATED_DATE 
      FROM AUD_STAT.STAT_AUDIT
      WHERE ID = :STAT_ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      let team_query = `SELECT ID,
      STAT_AUDIT_ID,
      AUDITOR_ID,
      ROLE_ID,
      sat.IS_ACTIVE,
      sat.CREATED_BY ,
      su.USER_CODE ,
      su.USER_NAME 
      FROM AUD_STAT.STAT_AUDIT_TEAM sat 
      INNER JOIN AUD_REG."SYSTEM_USER" su ON su.USER_ID = sat.AUDITOR_ID 
      WHERE STAT_AUDIT_ID = :STAT_ID`;

      const team_result = await OracleDB.simpleExecute(team_query, params);
      if (result.rows !== undefined && result.rows.length > 0)
        return res.send({
          Audit: result.rows[0],
          Team: team_result.rows,
          CREATED_BY: result.rows[0].CREATED_BY,
        });
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async checkStatistic(req, res) {
    try {
      let params = {};
      params.P_PERIOD_ID = parseInt(req.body.PERIOD_ID, 10);
      params.P_DEPARTMENT_ID = parseInt(req.body.DEPARTMENT_ID, 10);
      params.P_DOCUMENT_ID = parseInt(req.body.DOCUMENT_ID, 10);
      params.P_AUDIT_TYPE_ID = parseInt(req.body.AUDIT_TYPE_ID, 10);

      let ListQuery = `SELECT COUNT(*) CNT FROM AUD_STAT.STAT_AUDIT 
      WHERE IS_ACTIVE = 1 AND PERIOD_ID = :P_PERIOD_ID AND DEPARTMENT_ID = :P_DEPARTMENT_ID AND  DOCUMENT_ID = :P_DOCUMENT_ID AND AUDIT_TYPE_ID = :P_AUDIT_TYPE_ID`;

      const result = await OracleDB.simpleExecute(ListQuery, params);
      return res.send(result.rows[0]?.CNT > 0 ? true : false);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async changeProcess(req, res) {
    try {
      let params = {};
      params.P_PROCESS_ID = CheckNullInt(req.body.ID, 10);
      params.P_STAT_AUDIT_ID = parseInt(req.body.STAT_AUDIT_ID, 10);
      params.P_ACTION_ID = parseInt(req.body.ACTION_ID, 10);
      params.P_ACTION_DESC = req.body.ACTION_DESC;
      params.P_CREATED_BY = parseInt(req.body.CREATED_BY, 10);

      const queryProcess = `BEGIN AUD_STAT.STAT_AUDIT_PROCESS_CHANGE (:P_PROCESS_ID, :P_STAT_AUDIT_ID, :P_ACTION_ID, :P_ACTION_DESC, :P_CREATED_BY); END;`;

      const result = await OracleDB.simpleExecute(queryProcess, params);
      return res.send({
        status: 200,
        message: "Хадгаллаа.",
      });
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async getProcess(req, res) {
    try {
      let params = {
        P_ID: CheckNullInt(req.body.ID, 10),
      };

      const AuditStatus = `SELECT P.ID, SA.STATUS, SU.USER_NAME, SU.USER_CODE, 
        SU1.USER_ID APPROVED_FIRST_ID, SU1.USER_NAME APPROVED_FIRST_NAME, SU1.USER_CODE APPROVED_FIRST_CODE, P.APPROVED_FIRST_DATE,
        SU2.USER_ID APPROVED_SECOND_ID, SU2.USER_NAME APPROVED_SECOND_NAME, SU2.USER_CODE APPROVED_SECOND_CODE, P.APPROVED_SECOND_DATE,
        SU3.USER_ID APPROVED_THIRD_ID, SU3.USER_NAME APPROVED_THIRD_NAME, SU3.USER_CODE APPROVED_THIRD_CODE, P.APPROVED_THIRD_DATE
        FROM AUD_STAT.STAT_AUDIT SA
        LEFT JOIN AUD_STAT.STAT_AUDIT_PROCESS P ON SA.ID = P.STAT_AUDIT_ID
        LEFT JOIN AUD_REG.SYSTEM_USER SU ON P.SAVED_BY = SU.USER_ID
        LEFT JOIN AUD_REG.SYSTEM_USER SU1 ON P.APPROVED_FIRST_ID = SU1.USER_ID
        LEFT JOIN AUD_REG.SYSTEM_USER SU2 ON P.APPROVED_SECOND_ID = SU2.USER_ID
        LEFT JOIN AUD_REG.SYSTEM_USER SU3 ON P.APPROVED_THIRD_ID = SU3.USER_ID
        WHERE SA.ID = :P_ID`;

      const result = await OracleDB.simpleExecute(AuditStatus, params);

      let stat_role = `SELECT AT.AUDITOR_ID, SU.USER_NAME, AT.ROLE_ID, R.ROLE_NAME FROM AUD_STAT.STAT_AUDIT_TEAM AT
      LEFT JOIN AUD_REG.SYSTEM_USER SU ON AT.AUDITOR_ID = SU.USER_ID
      LEFT JOIN AUD_STAT.REF_ROLE R ON AT.ROLE_ID = R.ID
      WHERE AT.IS_ACTIVE = 1 AND AT.STAT_AUDIT_ID = :P_ID`;

      const result_role = await OracleDB.simpleExecute(stat_role, params);
      return res.send({ STATUS: result.rows[0], ROLE: result_role.rows });
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async getRole(req, res) {
    try {
      let params = {
        P_ID: CheckNullInt(req.body.ID, 10),
      };

      const ListTeamRole = `SELECT AT.AUDITOR_ID, SU.USER_NAME, AT.ROLE_ID, R.ROLE_NAME FROM AUD_STAT.STAT_AUDIT_TEAM AT
      LEFT JOIN AUD_REG.SYSTEM_USER SU ON AT.AUDITOR_ID = SU.USER_ID
      LEFT JOIN AUD_STAT.REF_ROLE R ON AT.ROLE_ID = R.ID
      WHERE AT.IS_ACTIVE = 1 AND AT.STAT_AUDIT_ID = :P_ID`;

      const result = await OracleDB.simpleExecute(ListTeamRole, params);
      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async changeLock(req, res) {
    try {
      let params = [];
      if (req.body?.lockData.length > 0) {
        req.body?.lockData.forEach((element) => {
          params.push({
            P_STAT_AUDIT_ID: CheckNullInt(element.ID),
            P_IS_LOCK: CheckNullInt(element.IS_LOCK),
            P_CREATED_BY: parseInt(req.body.CREATED_BY),
          });
        });
      }
      const queryLock = `BEGIN AUD_STAT.STAT_AUDIT_LOCK (:P_STAT_AUDIT_ID, :P_IS_LOCK, :P_CREATED_BY); END;`;

      const result = await OracleDB.multipleExecute(queryLock, params);
      return res.send({
        status: 200,
        message: "Хадгаллаа.",
      });
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async removeStatistic(req, res) {
    try {
      let params = {
        P_ID: CheckNullInt(req.body.ID),
        P_CREATED_BY: parseInt(req.body.CREATED_BY),
      };

      const queryRemove = `BEGIN AUD_STAT.STAT_AUDIT_REMOVE (:P_ID, :P_CREATED_BY); END;`;

      const result = await OracleDB.simpleExecute(queryRemove, params);
      return res.send({
        status: 200,
        message: "Хадгаллаа.",
      });
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async getEntList(req, res) {
    try {
      let params = {};

      let ListQuery = `SELECT AE.ENT_ID, AER.REL_ENT_NAME TEZ_NAME, AER2.REL_ENT_NAME TTZ_NAME, AE.ENT_NAME, AO.ORG_REGISTER_NO, RBT.BUDGET_SHORT_NAME, RD.DEPARTMENT_NAME
      FROM AUD_ORG.AUDIT_ENTITY AE
      INNER JOIN AUD_ORG.AUDIT_ORGANIZATION AO on AE.ENT_ORG_ID = AO.ORG_ID
      INNER JOIN AUD_ORG.AUDIT_ENTITY_RELATION AER ON AE.ENT_ID = AER.ENT_ID AND AER.REL_ENT_TYPE = 1 AND AER.IS_ACTIVE = 1
      LEFT JOIN AUD_ORG.AUDIT_ENTITY_RELATION AER2 ON AE.ENT_ID = AER2.ENT_ID AND AER2.REL_ENT_TYPE = 2 AND AER2.IS_ACTIVE = 1
      INNER JOIN AUD_ORG.REF_DEPARTMENT RD ON AE.ENT_DEPARTMENT_ID = RD.DEPARTMENT_ID
      INNER JOIN AUD_ORG.REF_BUDGET_TYPE RBT ON AE.ENT_BUDGET_TYPE = RBT.BUDGET_TYPE_ID
      WHERE AO.IS_ACTIVE = 1 AND AE.IS_ACTIVE = 1
      ORDER BY AE.ENT_DEPARTMENT_ID, AE.ENT_NAME, AO.ORG_REGISTER_NO`;

      const result = await OracleDB.simpleExecute(ListQuery, params);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
