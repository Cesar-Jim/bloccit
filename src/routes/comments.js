const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const validation = require("./validation");

// Register a route for the create action along with validation middleware and the controller action.
router.post("/topics/:topicId/posts/:postId/comments/create",
  validation.validateComments,
  commentController.create);

// Register a route for the destroy action along with validation middleware and the controller action.
router.post("/topics/:topicId/posts/:postId/comments/:id/destroy",
  commentController.destroy);
module.exports = router;