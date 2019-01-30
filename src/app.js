// This file contains the Express application

const express = require("express");
const app = express();

const appConfig = require("./config/main-config.js"); // Module that configures all middleware used in the application
const routeConfig = require("./config/route-config.js"); // Module that initializes and configures all of our routes

appConfig.init(app, express); // Passing the app and express variables
routeConfig.init(app); // Initial route configuration in "app"

module.exports = app;