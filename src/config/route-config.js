// This module exports a function that initializes and configures all of our routes

module.exports = {
   init(app) { // init(app) loads the defined routes and defines them on the Express "app" object
      const staticRoutes = require("../routes/static");
      const topicRoutes = require("../routes/topics"); //

      app.use(staticRoutes);
      app.use(topicRoutes);
   }
}