const StatisticController = require("../controllers/StatisticController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.post("/statisticList", StatisticController.regStatisticList);
  app.post("/statisticIU", StatisticController.regStatisticIU);
  app.post("/statisticCheck", StatisticController.checkStatistic);
  app.post("/statisticProcess", StatisticController.checkProcess);
};
