// Whenever the model, schema, and DB are ready to accept data, we can use the Sequelize
// models we created and directly call methods on them to perform CRUD actions
// (Create, Read, Update, and Delete).
// This is a promise-based module that abstracts the above mentioned actions
const Topic = require("./models").Topic;
const Post = require("./models").Post;
const Flair = require("./models").Flair;
const Authorizer = require("../policies/topic");

module.exports = {
  // Return the result of calling "all" on the Sequalize model which will return
  // all records in the topics table
  getAllTopics(callback) {
    return (
      Topic.all()

        // When successful, the callback passed to the ".then" method will execute. It contains
        // all topics (if any) in the "topics" parameter. Inside, it calls the callback method
        // passed into "getAllTopics" with "null" and the topics that came from the DB.
        // When we call "getAllTopics" from the controller, we'll pass afunction that renders the
        // view according to what we pass to the callback inside "getAllTopics"
        .then(topics => {
          callback(null, topics);
        })
        .catch(err => {
          callback(err);
        })
    );
  },

  // We define addTopic to take two arguments. The first will be a plain JavaScript object with the
  // attributes to set for the topic and the second is a callback.
  addTopic(newTopic, callback) {
    return Topic.create({
      title: newTopic.title,
      description: newTopic.description
    })
      .then(topic => {
        callback(null, topic);
      })
      .catch(err => {
        callback(err);
      });
  },

  getTopic(id, callback) {
    // Calling findById queries the topics table for the topic with a matching id and uses
    // the include option to eager load all associated posts.
    return Topic.findById(id, {
      // tell include what model to use and what to call the property we want to attach the
      // resulting posts as when the topic is returned.
      include: [
        {
          model: Post,
          as: "posts"
        },
        {
          model: Flair,
          as: "flairs"
        }
      ]
    })
      .then(topic => {
        callback(null, topic);
      })
      .catch(err => {
        callback(err);
      });
  },

  // in deleteTopic we call the destroy method on the Topic model. We tell the model to look for Topic
  // objects where the id property matches the id argument passed into the deleteTopic method.
  deleteTopic(req, callback) {
    return Topic.findById(req.params.id)
      .then((topic) => {
        const authorized = new Authorizer(req.user, topic).destroy();

        if (authorized) {
          topic.destroy()
            .then((res) => {
              callback(null, topic);
            });

        } else {
          req.flash("notice", "You are not authorized to do that.")
          callback(401);
        }
      })
      .catch((err) => {
        callback(err);
      });
  },

  // We define updateTopic with parameters that represent the topic ID, an object with the new values
  // and the callback. We search by ID, and if we don't find a topic, we return with a message stating so.
  updateTopic(req, updatedTopic, callback) {
    return Topic.findById(req.params.id)
      .then((topic) => {
        if (!topic) {
          return callback("Topic not found");
        }
        const authorized = new Authorizer(req.user, topic).update();

        if (authorized) {
          topic.update(updatedTopic, {
            fields: Object.keys(updatedTopic)
          })
            .then(() => {
              callback(null, topic);
            })
            .catch((err) => {
              callback(err);
            });

        } else {
          req.flash("notice", "You are not authorized to do that.");
          callback("Forbidden");
        }
      });
  }
};
