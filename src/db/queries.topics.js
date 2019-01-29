const Topic = require("./models").Topic;

module.exports = {

   getAllTopics(callback) {

      // #1
      return Topic.all()

         // #2
         .then((topics) => {
            callback(null, topics);
         })
         .catch((err) => {
            callback(err);
         })
   }
}