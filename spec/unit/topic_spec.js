const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("Topic", () => {

   beforeEach((done) => {
      this.topic;
      this.post;
      this.user;

      sequelize.sync({ force: true }).then((res) => {

         // Create a User object
         User.create({
            email: "starman@tesla.com",
            password: "Trekkie4lyfe"
         })
            .then((user) => {
               this.user = user; //store the user

               // Create a Topic object
               Topic.create({
                  title: "Expeditions to Alpha Centauri",
                  description: "A compilation of reports from recent visits to the star system.",

                  // Use nested create to create objects and associations in a single call. For each object in posts, 
                  // Sequelize will create a Post object with the attribute values provided. The result will be a Topic 
                  // object with associated Post objects.
                  posts: [{
                     title: "My first visit to Proxima Centauri b",
                     body: "I saw some rocks.",
                     userId: this.user.id
                  }]
               }, {

                     // The include property allows us to tell the method what model to use as well as where to store the 
                     // resulting posts as in the Topic object.  [Topic instance name].posts will return an array of Post 
                     // objects associated with the  Topic object.
                     include: {
                        model: Post,
                        as: "posts"
                     }
                  })
                  .then((topic) => {
                     this.topic = topic; //store the topic
                     this.post = topic.posts[0]; //store the post
                     done();
                  })
            })
      });
   });

   describe("#create()", () => {
      it("should create a topic object with a title, and description", (done) => {

         Topic.create({
            title: "This is a new topic",
            description: "Just trying to conduct a test."
         })
            .then((topic) => {
               expect(topic.title).toBe("This is a new topic");
               expect(topic.description).toBe("Just trying to conduct a test.");
               done();
            })
            .catch((err) => {
               console.log(err);
               done();
            });
      });

      it("should not create a topic object with missing title, or description", (done) => {
         Topic.create({
            title: "Adding a new topic here"
         })
            .then((topic) => {
               done();
            })
            .catch((err) => {
               expect(err.message).toContain("Topic.description cannot be null");
               done();
            });
      });
   });


   describe("#getPosts()", () => {

      it("should return and array of associated posts", (done) => {
         this.topic.getPosts()
            .then((collectionOfPosts) => {
               expect(collectionOfPosts[0].topicId).toBe(this.topic.id);
               done();
            });
      });
   });

})