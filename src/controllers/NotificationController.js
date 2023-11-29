const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");
const { CheckNullInt, DateFormat } = require("../utils/Helper");

module.exports = {
  async NotificationList(req, res) {
    try {
      const ProcessID = req.query.ProcessID;

      let ListQuery = `SELECT SN.ID, SN.AUDIT_ID, SN.DOCUMENT_ID, SN.CREATED_BY, SN.CREATED_DATE, SN.IS_SHOW, SN.REQUEST_TYPE, SN.DESCRIPTION, SN.ROLE_ID,
        RD.DOCUMENT_SHORT_NAME, RD.DOCUMENT_NAME, SU.USER_NAME, TD.AUDITOR_ID, 
        SN.MODULE_ID
        FROM AUD_REG.SYSTEM_NOTIFICATION SN
        INNER JOIN (
        SELECT SA.ID AUDIT_ID, 6 MODULE_ID, AUDITOR_ID, ROLE_ID 
        FROM AUD_STAT.STAT_AUDIT SA 
        INNER JOIN AUD_STAT.STAT_AUDIT_TEAM SAT ON SA.ID = SAT.STAT_AUDIT_ID 
        WHERE SA.IS_ACTIVE = 1 AND SAT.IS_ACTIVE = 1 AND SAT.ROLE_ID IN (1,2,3,4)
        ) TD ON SN.AUDIT_ID = TD.AUDIT_ID AND SN.MODULE_ID = TD.MODULE_ID AND TD.AUDITOR_ID = :USER_ID
        LEFT JOIN AUD_STAT.REF_DOCUMENT RD ON SN.DOCUMENT_ID  = RD.ID
        LEFT JOIN AUD_STAT.STAT_AUDIT SA ON SA.ID = SN.AUDIT_ID 
        LEFT JOIN AUD_REG.SYSTEM_USER SU ON  SN.CREATED_BY = SU.USER_ID
        WHERE SN.IS_ACTIVE  = 1`;

      //ListQuery += `\nORDER BY C.CREATED_DATE DESC`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async NotificationInsert(req, res) {
    try {
      const queryInsert = `INSERT INTO AUD_REG.SYSTEM_NOTIFICATION(AUDIT_ID, DOCUMENT_ID, IS_SHOW, REQUEST_TYPE, ROLE_ID, MODULE_ID, DESCRIPTION, IS_ACTIVE, CREATED_BY, CREATED_DATE)
      VALUES(:P_STAT_AUDIT_ID, :P_DOCUMENT_ID, 0, :P_REQUEST_TYPE, :P_ROLE_ID, :P_MODULE_ID, :P_DESCRIPTION, 1, :P_CREATED_BY, SYSDATE)`;

      let data = {
        P_STAT_AUDIT_ID: parseInt(AUDIT_ID, 10),
        P_DOCUMENT_ID: CheckNullInt(req.body.DOCUMENT_ID),
        P_REQUEST_TYPE: CheckNullInt(req.body.REQUEST_TYPE),
        P_ROLE_ID: CheckNullInt(req.body.ROLE_ID),
        P_MODULE_ID: CheckNullInt(req.body.MODULE_ID),
        P_DESCRIPTION: CheckNullInt(req.body.DESCRIPTION),
        P_CREATED_BY: req.body.CREATED_BY,
      };

      const result = await OracleDB.simpleExecute(queryInsert, data, {
        autoCommit: true,
      });

      if (result.rowsAffected) {
        return res.send({ status: 200, message: "Хадгаллаа." });
      } else {
        return res.send({ status: 200, message: "Алдаа гарлаа." });
      }
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async NotificationUpdate(req, res) {
    try {
      const queryUpdate = `UPDATE AUD_REG.SYSTEM_NOTIFICATION
      SET IS_SHOW = 1
      WHERE ID = :P_ID`;

      let data = {
        P_ID: parseInt(req.body.ID),
      };

      const result = await OracleDB.simpleExecute(queryUpdate, data, {
        autoCommit: true,
      });

      if (result.rowsAffected) {
        return res.send({ status: 200, message: "Хадгаллаа." });
      } else {
        return res.send({ status: 200, message: "Алдаа гарлаа." });
      }
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
