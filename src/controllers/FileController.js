const fs = require("fs");
const uploadFile = require("../middleware/Upload");

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

module.exports = {
  upload,
  remove,
};
