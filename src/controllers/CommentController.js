const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");
const { CheckNullInt, DateFormat } = require("../utils/Helper");

module.exports = {
  async CommentList(req, res) {
    try {
      const ProcessID = req.query.ProcessID;

      let ListQuery =
        `SELECT C.ID, C.PROCESS_ID, C.COMMENT_TYPE, C.COMMENT_TEXT, C.PARENT_ID, C.IS_ACTIVE, C.CREATED_BY, SU.USER_NAME, SU.USER_CODE, TO_CHAR(C.CREATED_DATE, 'YYYY-MM-DD HH24:MI:SS') CREATED_DATE 
        FROM AUD_REG.SYSTEM_COMMENT C
        INNER JOIN AUD_REG.SYSTEM_USER SU ON C.CREATED_BY = SU.USER_ID
        WHERE C.IS_ACTIVE = 1 AND C.MODULE_ID = 6 AND C.PROCESS_ID = ` +
        ProcessID;

      ListQuery += `\nORDER BY C.CREATED_DATE DESC`;

      const result = await OracleDB.simpleExecute(ListQuery);

      return res.send(result.rows);
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
  async CommentInsert(req, res) {
    try {
      const queryInsert = `INSERT INTO AUD_REG.SYSTEM_COMMENT(SYSTEM_ID, MODULE_ID, PROCESS_ID, COMMENT_TEXT, IS_ACTIVE, CREATED_BY, CREATED_DATE)
      VALUES(:SYSTEM_ID, :MODULE_ID, :PROCESS_ID, :COMMENT_TEXT, :IS_ACTIVE, :CREATED_BY, SYSDATE)`;

      let data = {
        SYSTEM_ID: 2,
        MODULE_ID: parseInt(req.body.MODULE_ID),
        PROCESS_ID: req.body.PROCESS_ID,
        COMMENT_TEXT: req.body.COMMENT_TEXT,
        IS_ACTIVE: 1,
        CREATED_BY: req.body.CREATED_BY,
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
  async CommentRemove(req, res) {
    try {
      const deleteSql = `UPDATE AUD_REG.SYSTEM_COMMENT
        SET IS_ACTIVE = 0,
        UPDATED_BY = :UPDATED_BY,
        UPDATED_DATE = SYSDATE
        WHERE ID = :ID`;

      let data = {
        ID: req.body.ID,
        UPDATED_BY: req.body.CREATED_BY,
      };
      const result = await OracleDB.simpleExecute(deleteSql, data, {
        autoCommit: true,
      });

      if (result.rowsAffected) {
        return res.send({
          status: 200,
          message: "Амжилттай устгалаа.",
        });
      } else {
        return res.send({
          status: 200,
          message: "Бичлэг олдсонгүй.",
        });
      }
    } catch (err) {
      return errorFunction.saveErrorAndSend(req, res, err);
    }
  },
};
