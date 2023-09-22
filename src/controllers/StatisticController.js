const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");
const { CheckNullInt, DateFormat } = require("../utils/Helper");

module.exports = {
  async regStatisticList(req, res) {
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
  async regStatisticIU(req, res) {
    try {
      const queryAuditSEQ = `SELECT AUD_STAT.SEQ_STAT_AUDIT_ID.NEXTVAL FROM DUAL`;
      const queryAudit = `BEGIN AUD_STAT.STAT_AUDIT_I_U(:P_STAT_AUDIT_ID, :P_PERIOD_ID, :P_DEPARTMENT_ID, :P_DOCUMENT_ID, :P_CONFIRM_DATE, :P_CREATED_BY); END;`;
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
          P_CONFIRM_DATE: DateFormat(req.body.Audit.CONFIRM_DATE),
          P_CREATED_BY: parseInt(req.body.CREATED_BY),
        };
        if (req.body.Team?.length > 0) {
          req.body.Team?.forEach((element) => {
            team.push({
              P_ID: element.ID != null ? parseInt(element.ID) : null,
              P_STAT_AUDIT_ID: CheckNullInt(req.body.STAT_AUDIT_ID),
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
        message: "Хадгаллаа.",
      });
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
