const CommentController = require("../controllers/CommentController");
//const isAuthenticated = require("../middleware/AuthMiddleware");

module.exports = (app) => {
  app.get("/CommentList?:ProcessID", CommentController.CommentList);
  app.post("/CommentInsert", CommentController.CommentInsert);
  app.post("/CommentRemove", CommentController.CommentRemove);
};
