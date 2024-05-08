const CMController = require("../controllers/CMController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.post("/CM1AList", CMController.CM1AList);
  app.post("/CM4List", CMController.CM4List);
};
