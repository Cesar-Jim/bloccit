// Loading dependencies for our tests:
const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;

describe("routes : topics", () => {

   // Before each test, we clear the DB by running "sequelize.sync({ force: true })"
   beforeEach((done) => {
      this.topic;
      sequelize.sync({ force: true }).then((res) => { // Clear the DB
         Topic.create({ // Add a record to the topics table
            title: "JS Frameworks",
            description: "There is a lot of them"
         })
            .then((topic) => {
               this.topic = topic; // We bind "topic" to the test context so we can use it later
               done();
            })
            .catch((err) => {
               console.log(err);
               done();
            });
      });
   });

   describe("GET /topics", () => {

      it("should return a status code 200 and all topics", (done) => {

         // Make the request: 
         request.get(base, (err, res, body) => {

            // And set the following  expectations:
            expect(res.statusCode).toBe(200);
            expect(err).toBeNull(); // There should be no error present
            expect(body).toContain("Topics"); // The body should contain the "Topics" header
            expect(body).toContain("JS Frameworks"); // And ther would be a topic with the title of "JS Frameworks"
            done();
         });
      });

   });

   describe("GET /topics/new", () => {

      it("should render a new topic form", (done) => {
         request.get(`${base}new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Topic");
            done();
         });
      });
   });

   describe("POST /topics/create", () => {
      const options = {
         url: `${base}create`,
         form: {
            title: "blink-182 songs",
            description: "What's your favorite blink-182 song?"
         }
      };

      it("should create a new topic and redirect", (done) => {

         // Using POST method on the request object. This method allows to pass a callback to it.
         // Te method takes 2 arguments, 1st is the object with keys for the url to use for the request,
         // and form values to submit along with the body of the request. The object is called options.
         request.post(options,

            // This is the calback used to set expectations. We grab the topicId from the body and perform
            // a search on the topics table for the newly created topic.
            (err, res, body) => {
               Topic.findOne({ where: { title: "blink-182 songs" } })
                  .then((topic) => {
                     expect(res.statusCode).toBe(303);
                     expect(topic.title).toBe("blink-182 songs");
                     expect(topic.description).toBe("What's your favorite blink-182 song?");
                     done();
                  })
                  .catch((err) => {
                     console.log(err);
                     done();
                  });
            }
         );
      });
   });


   // The ":" in the URI indicates that id is a URL parameter. In this case, it represents an  id passed in with the request
   describe("GET /topics/:id", () => {

      it("should render a view with the selected topic", (done) => {

         //We make a request and pass in the ID of the topic we created in the  beforeEach call
         request.get(`${base}${this.topic.id}`, (err, res, body) => {

            //We then set the expectations that we'll receive a success code as well as the view containing the title of the topic.
            expect(err).toBeNull();
            expect(body).toContain("JS Frameworks");
            done();
         });
      });

   });


   describe("POST /topics/:id/destroy", () => {

      it("should delete the topic with the associated ID", (done) => {

         // We call the all method of the Sequelize model which returns all records in the table.
         Topic.all()
            .then((topics) => {

               // When resolved, we store the number of topics that came back from the database and 
               // set the expectation that there should only be one record.
               const topicCountBeforeDelete = topics.length;
               expect(topicCountBeforeDelete).toBe(1);

               // we make the delete request, get all topics from the table and make sure we reduced the number of topics by one.
               request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
                  Topic.all()
                     .then((topics) => {
                        expect(err).toBeNull();
                        expect(topics.length).toBe(topicCountBeforeDelete - 1);
                        done();
                     })
               });
            });
      });
   });


   // Just like the test for topics/new, we make the request and set the expectation that 
   // there will be something on the page telling us where we are, in this case, the  Edit Topic heading.
   // Since we are editing an existing topic, we make sure to populate the fields with content that belongs to the given topic.
   describe("GET /topics/:id/edit", () => {

      it("should render a view with an edit topic form", (done) => {
         request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Topic");
            expect(body).toContain("JS Frameworks");
            done();
         });
      });
   })


   describe("POST /topics/:id/update", () => {

      it("should update the topic with the given values", (done) => {
         const options = {
            url: `${base}${this.topic.id}/update`,
            form: {
               title: "JavaScript Frameworks",
               description: "There are a lot of them"
            }
         };

         // We call post and pass in our object with the URL and form properties needed.
         request.post(options,
            (err, res, body) => {
               expect(err).toBeNull();
               //We then set the expectation that there be no error present and that we changed title of the topic
               Topic.findOne({
                  whre: { id: this.topic.id }
               })
                  .then((topic) => {
                     expect(topic.title).toBe("JavaScript Frameworks");
                     done();
                  });
            }
         );
      });
   });


});