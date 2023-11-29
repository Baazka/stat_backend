const NotificationController = require("../controllers/NotificationController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.post("/NotificationList", NotificationController.NotificationList);
  app.post("/NotificationInsert", NotificationController.NotificationInsert);
  app.post("/NotificationUpdate", NotificationController.NotificationUpdate);
};
