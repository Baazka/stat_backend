const BMController = require("../controllers/BMController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.post("/BM1List", BMController.BM1List);
  app.post("/BM1IU", BMController.BM1IU);
  app.post("/BM2List", BMController.BM2List);
  app.post("/BM3List", BMController.BM3List);
  app.post("/BM4List", BMController.BM4List);
  app.post("/BM5List", BMController.BM5List);
  app.post("/BM6List", BMController.BM6List);
  app.post("/BM7List", BMController.BM7List);
  app.post("/BM8List", BMController.BM8List);
};
