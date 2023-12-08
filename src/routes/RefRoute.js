const ReferenceController = require("../controllers/ReferenceController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.get("/refPeriod", ReferenceController.refPeriodList);
  app.get("/refDepartment?:DepType", ReferenceController.refDepartmentList);
  app.post("/refEmployee", ReferenceController.refEmployeeList);
  app.get("/refDocument?:DocType", ReferenceController.refDocumentList);
  app.get("/refAuditType", ReferenceController.refAuditTypeList);
  app.get("/refPeriodYear", ReferenceController.refPeriodList);
  app.get("/refErrorConflict", ReferenceController.refErrorConflictList);
  app.get("/refSolution", ReferenceController.refSolutionList);
};
