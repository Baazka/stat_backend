const ReferenceController = require("../controllers/ReferenceController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  //REF_PERIOD
  app.get("/refPeriod", ReferenceController.refPeriodList);
};
