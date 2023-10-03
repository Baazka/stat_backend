const BMController = require("../controllers/BMController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.post("/BM1List", BMController.BM1List);
  app.post("/BM1IU", BMController.BM1IU);
  app.post("/BM2List", BMController.BM2List);
};
