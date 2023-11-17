const File = require("../controllers/FileController");
module.exports = (app) => {
  app.post("/uploadFile/:folderName/:fileName", File.upload);
  app.get("/getFile?:StatID", File.get);
  app.post("/postFile", File.post);
  app.delete("/removeFile/:folderName/:fileName", File.remove);
};
