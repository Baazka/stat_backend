const File = require("../controllers/FileController");
module.exports = (app) => {
  app.post("/uploadFile/:folderName/:fileName", File.upload);
  app.post("/getFile?:FileID", File.get);
  app.delete("/removeFile/:folderName/:fileName", File.remove);
};
