const BMController = require("../controllers/BMController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.post("/BM1List", BMController.BM1List);
  app.post("/BM1IU", BMController.BM1IU);
  app.post("/BM2List", BMController.BM2List);
  app.post("/BM2IU", BMController.BM2IU);
  app.post("/BM3List", BMController.BM3List);
  app.post("/BM3IU", BMController.BM3IU);
  app.post("/BM4List", BMController.BM4List);
  app.post("/BM4IU", BMController.BM4IU);
  app.post("/BM5List", BMController.BM5List);
  app.post("/BM5IU", BMController.BM5IU);
  app.post("/BM6List", BMController.BM6List);
  app.post("/BM6IU", BMController.BM6IU);
  app.post("/BM7List", BMController.BM7List);
  app.post("/BM7IU", BMController.BM7IU);
  app.post("/BM8List", BMController.BM8List);
  app.post("/BM8IU", BMController.BM8IU);
  app.post("/BM9List", BMController.BM9List);
  app.post("/BM9IU", BMController.BM9IU);
  app.post("/BM9Remove", BMController.BM9Remove);
  app.post("/BM10List", BMController.BM10List);
  app.post("/BM10IU", BMController.BM10IU);
  app.post("/BM8AList", BMController.BM8AList);
  app.post("/BM8AIU", BMController.BM8AIU);
  app.post("/BM8ARemove", BMController.BM8ARemove);
};
