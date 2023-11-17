const util = require("util");
const multer = require("multer");
const maxSize = 25 * 1024 * 1024;
const fs = require("fs-extra");

let folderName = "";
let fileName = "";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fileName = req.params.fileName;
    if (req.params.folderName) {
      folderName = req.params.folderName;

      fs.ensureDir("uploads/" + folderName)
        .then(() => {
          cb(null, "uploads/" + folderName);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      cb(null, "uploads/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, fileName + "." + file.originalname.split(".").pop());
  },
});
let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
