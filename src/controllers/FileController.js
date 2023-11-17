const fs = require("fs");
const uploadFile = require("../middleware/Upload");
const errorFunction = require("../utils/ErrorFunction");
const OracleDB = require("../services/database");

const upload = async (req, res) => {
  try {
    let filePath = `uploads/`;
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Файл хоосон байна!" });
    }

    filePath += `${
      req.params.folderName +
      "/" +
      req.params.fileName +
      "." +
      req.file.originalname.split(".").pop()
    }`;

    res.status(200).send({
      filePath,
      message: "Амжилттай хууллаа.",
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "25MB-с их хэмжээтэй байна!",
      });
    }
    res.status(500).send({
      message: `Файл хуулахад алдаа гарлаа:. ${err}`,
    });
  }
};

const remove = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = "uploads/" + req.params.folderName + "/";
  if (fs.existsSync(filePath + fileName)) {
    try {
      fs.unlinkSync(filePath + fileName);

      res.status(200).send({
        message: "Файлыг устгалаа.",
      });
    } catch (err) {
      res.status(500).send({
        message: "Амжилтгүй. " + err,
      });
    }
  } else {
    res.status(200).send({
      message: "Файлыг устгалаа.",
    });
  }
};
const get = async (req, res) => {
  try {
    const fileID = req.query.StatID;

    let ListQuery =
      `SELECT ID, STAT_AUDIT_ID, FILE_NAME, FILE_PATH, IS_ACTIVE, CREATED_BY FROM AUD_STAT.STAT_AUDIT_FILE WHERE IS_ACTIVE = 1 AND STAT_AUDIT_ID = ` +
      fileID;
    const result = await OracleDB.simpleExecute(ListQuery);

    return res.send(result.rows[0]);
  } catch (err) {
    return errorFunction.saveErrorAndSend(req, res, err);
  }
};
const post = async (req, res) => {
  try {
    const fileID = req.query.StatID;

    let file = {};

    if (req.body.file !== undefined) {
      file.P_ID = req.body.file.ID != null ? parseInt(req.body.file.ID) : null;
      file.P_STAT_AUDIT_ID = CheckNullInt(req.body.file.STAT_AUDIT_ID);
      file.P_FILE_NAME = req.body.file.FILE_NAME;
      file.P_FILE_PATH = req.body.file.FILE_PATH;
      file.P_IS_ACTIVE = parseInt(req.body.file.IS_ACTIVE);
      file.P_CREATED_BY = parseInt(req.body.CREATED_BY);
    }

    let queryStatFile = `BEGIN AUD_STAT.STAT_AUDIT_FILE_I_U (:P_ID, :P_STAT_AUDIT_ID, :P_FILE_NAME, :P_FILE_PATH, :P_IS_ACTIVE, :P_CREATED_BY); END;`;

    const resultFile = await OracleDB.simpleExecute(queryStatFile, file);

    return res.send(resultFile.rows[0]);
  } catch (err) {
    return errorFunction.saveErrorAndSend(req, res, err);
  }
};

module.exports = {
  upload,
  get,
  post,
  remove,
};
