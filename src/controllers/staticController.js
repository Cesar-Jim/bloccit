// This module defines and exports an object that contains multiple functions 
// that contain a handler for a particular route. 

module.exports = {
   index: function (req, res, next) { // Contains the route handler for the "/" route.
      res.render("static/index", { title: "Welcome to Bloccit" });
      // Used to render the template instead of returning text. The render method takes the location of the template 
      // as well as an object containing the data we wish to make available in the template.
   },

   about: function (req, res, next) {
      res.render("static/about", { title: "About Us" });
   }
}