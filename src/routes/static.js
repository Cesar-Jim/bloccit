// All static route definitions are moved to this file.
// This is what is called "SEPARATION OF CONCERNS"

const express = require("express");
const router = express.Router(); // Getting Express functionality from its Router method
const staticController = require("../controllers/staticController"); // Importing the controller module

router.get("/", staticController.index); // Call the appropriate handler for the "/" route
// The route associates an HTTP verb with a URL pattern and a handler.
// The GET method tells router this route accepts a GET request. 

router.get("/about", staticController.about);

module.exports = router;