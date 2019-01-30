// This is the route file for the Topic resource

const express = require("express");
const router = express.Router();

const topicController = require("../controllers/topicController") // Import the controller

// ...And configure all the routes:
router.get("/topics", topicController.index);
router.get("/topics/new", topicController.new); // Create the "new" view and populate it with its corresponding form (see new.ejs)
router.get("/topics/:id", topicController.show); // Create the ":id" view to show the requested topic
router.get("/topics/:id/edit", topicController.edit);

router.post("/topics/create", topicController.create); // Create the "create" view to show newly created topic
router.post("/topics/:id/destroy", topicController.destroy); // Create the "destroy" view and see that the topic has been deleted
router.post("/topics/:id/update", topicController.update);

module.exports = router;