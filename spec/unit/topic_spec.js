const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

   beforeEach((done) => {
      this.topic;
      this.post;
      sequelize.sync({ force: true }).then((res) => {
         // create a topic:
         Topic.create({
            title: "This is a new topic",
            description: "Just trying to conduct a test."
         })
            .then((topic) => {
               this.topic = topic;
               // create a post:
               Post.create({
                  title: "This is a new post",
                  body: "A topic can have several posts.",
                  // Associate the topic and the post by setting the topicId attribute on the post object.
                  topicId: this.topicId
               })
                  .then((post) => {
                     this.post = post;
                     done();
                  });
            })
            .catch((err) => {
               console.log(err);
               done();
            });
      });
   });

   describe("#create()", () => {
      it("should create a topic object with a title, and a body", (done) => {

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
               expect(err.message).toContain("Topic.title cannot be null");
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