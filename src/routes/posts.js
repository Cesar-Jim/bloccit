const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController")

// GETs
router.get("/topics/:topicId/posts/new", postController.new);
router.get("/topics/:topicId/posts/:id", postController.show);
router.get("/topics/:topicId/posts/:id/edit", postController.edit);

// POSTs
router.post("/topics/:topicId/posts/create", postController.create);
router.post("/topics/:topicId/posts/:id/destroy", postController.destroy);
router.post("/topics/:topicId/posts/:id/update", postController.update);

module.exports = router;