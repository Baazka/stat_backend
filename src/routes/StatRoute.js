const StatisticController = require("../controllers/StatisticController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.post("/statisticList", StatisticController.regStatisticList);
  app.post("/statisticListOne", StatisticController.regStatisticListOne);
  app.post("/statisticIU", StatisticController.regStatisticIU);
  app.post("/get_stat_plan", StatisticController.getStatisticPlan);
  app.post("/statisticCheck", StatisticController.checkStatistic);
  app.post("/statisticProcessChange", StatisticController.changeProcess);
  app.post("/getProcess", StatisticController.getProcess);
  app.post("/getRole", StatisticController.getRole);
  app.post("/statisticLock", StatisticController.changeLock);
  app.post("/statisticRemove", StatisticController.removeStatistic);
  app.post("/getEntList", StatisticController.getEntList);
};
