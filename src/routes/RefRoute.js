const ReferenceController = require("../controllers/ReferenceController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.get("/refPeriod", ReferenceController.refPeriodList);
  app.get("/refDepartment?:DepType", ReferenceController.refDepartmentList);
  app.post("/refEmployee", ReferenceController.refEmployeeList);
  app.get("/refDocument?:DocType", ReferenceController.refDocumentList);
  app.get("/refAuditType", ReferenceController.refAuditTypeList);
  app.get("/refPeriodYear", ReferenceController.refPeriodListYear);
  app.get("/refErrorConflict", ReferenceController.refErrorConflictList);
  app.get("/refSolution", ReferenceController.refSolutionList);
  app.get("/refExpertType", ReferenceController.refExpertTypeList);
  app.get("/refExpertReason", ReferenceController.refExpertReasonList);
  app.get("/refBudgetLevel", ReferenceController.refBudgetLevelList);
  app.get("/refConclusionForm", ReferenceController.refConclusionFormList);
  app.get("/refConclusionType", ReferenceController.refConclusionTypeList);
  app.get("/refSubDepartment", ReferenceController.refSubDepartmentList);
  app.get("/refBenefitType", ReferenceController.refBenefitTypeList);
  app.get("/refMovementType", ReferenceController.refMovementTypeList);
  app.get("/refMovementSubType", ReferenceController.refMovementSubTypeList);
  app.get("/refTrainEnvironment", ReferenceController.refTrainEnvironmentList);
  app.get("/refTrainCatergory", ReferenceController.refTrainCatergoryList);
  app.get("/refTrainDirection", ReferenceController.refTrainDirectionList);
  app.get("/refInfoType", ReferenceController.refInfoTypeList);
  app.get(
    "/refRecommendationType",
    ReferenceController.refRecommendationTypeList
  );
  app.get("/refReportType", ReferenceController.refReportTypeList);
  app.get("/refReportEType", ReferenceController.refReportETypeList);
};
