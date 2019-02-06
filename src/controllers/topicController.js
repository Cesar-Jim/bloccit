// This module creates the controller and configures the route for GET /topics.
const topicQueries = require("../db/queries.topics.js");
const Authorizer = require("../policies/topic.js");

module.exports = {
   index(req, res, next) {
      // Passing a callback with 2 args to represent a possible error and the array of topics we expect to receive
      topicQueries.getAllTopics((err, topics) => {

         // If there is an error, redirect to the landing page and send server error code
         if (err) {
            res.redirect(500, "static/index");

         } else {
            // If no error, render the index template of the topics resource and pass the collection of topics into it
            res.render("topics/index", { topics });
         }
      })
   },

   // Configure the action to render the template that will contain the form to create a new topic
   new(req, res, next) {
      const authorized = new Authorizer(req.user).new();

      if (authorized) {
         res.render("topics/new");
      } else {
         req.flash("notice", "You are not authorized to do that.");
         res.redirect("/topics");
      }
   },

   // The create action grabs the values from the body property of the request and assigns them to a JavaScript object.
   create(req, res, next) {

      // Pass the user to the policy constructor and call create on the policy instance.
      const authorized = new Authorizer(req.user).create();

      // If authorized evaluates to true, continue with Topic object creation.
      if (authorized) {
         let newTopic = {
            title: req.body.title,
            description: req.body.description
         };
         topicQueries.addTopic(newTopic, (err, topic) => {
            if (err) {
               res.redirect(500, "/topics/new");
            } else {
               res.redirect(303, `/topics/${topic.id}`);
            }
         });
      } else {
         // If the user is not authorized, flash an error and redirect.
         req.flash("notice", "You are not authorized to do that.");
         req.redirect("/topics");
      }

   },

   show(req, res, next) {

      // When the information we need is in the URL, we use "req.params" instead of "req.body".
      // For example, for topics/5, the value 5 is stored in a key called id in the params property of the request.
      topicQueries.getTopic(req.params.id, (err, topic) => {

         // In the callback, we could find ourselves with a successful request that results in no record found.
         // For that reason, we check for the presence of an error or the lack of a returned topic.
         // If so, we send a not found status code and redirect to the root page. 
         // Otherwise, we render the show partial and pass in the topic to render.
         if (err || topic == null) {
            res.redirect(404, "/");

         } else {

            res.render("topics/show", { topic });
         }
      });
   },

   // We call deleteTopic and pass in the URL parameter for the topic ID.
   destroy(req, res, next) {
      // Pass the request object to the deleteTopic method.
      topicQueries.deleteTopic(req.params.id, (err, topic) => {

         // On error, we return a server error and redirect to the show view. On success, we redirect to the /topics path.
         if (err) {
            res.redirect(err, `/topics/${req.params.id}`)
         } else {
            res.redirect(303, "/topics")
         }
      });
   },

   // We use the getTopic method to get the topic with the matching ID passed in the request.
   edit(req, res, next) {
      // Query for the topic with the matching ID from the URL parameters.
      topicQueries.getTopic(req.params.id, (err, topic) => {

         // If there is an error present or there is no topic returned, we redirect to the landing 
         // page with a 404. Otherwise, we render the edit view with the topic returned.
         if (err || topic == null) {
            res.redirect(404, "/");

         } else {

            // If we find the topic we pass it to the policy constructor along with the signed in user. 
            // Then we call the edit method of the policy class to determine if the user is authorized.
            const authorized = new Authorizer(req.user, topic).edit();

            // If the user is authorized, render the edit view. If not, flash an error and redirect.
            if (authorized) {
               res.render("topics/edit", { topic });
            } else {
               req.flash("You are not authorized to do that.")
               res.redirect(`/topics/${req.params.id}`)
            }
         }
      });
   },


   update(req, res, next) {

      // We call updateTopic and pass in the ID from the URL parameters as well as the body of the 
      // request which contains the key-value pairs for the fields we want to update.
      topicQueries.updateTopic(req, req.body, (err, topic) => {

         // If we don't find a topic, we return a 404 and redirect to the edit view. Otherwise, we 
         // redirect to the updated show view with the newly updated topic. 
         if (err || topic == null) {
            res.redirect(401, `/topics/${req.params.id}/edit`);
         } else {
            res.redirect(`/topics/${req.params.id}`);
         }
      });
   }


}