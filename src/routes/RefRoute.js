const ReferenceController = require("../controllers/ReferenceController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.get("/refPeriod", ReferenceController.refPeriodList);
  app.get("/refDepartment", ReferenceController.refDepartmentList);
  app.post("/refEmployee", ReferenceController.refEmployeeList);
  app.get("/refDocument?:DocType", ReferenceController.refDocumentList);
};
