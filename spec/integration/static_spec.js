const request = require("request"); // Used to make requests to the server during our tests.
const server = require("../../src/server"); // our server
const base = "http://localhost:3000"; // Base URL that will be used for our tests

const routeAbout = `${base}/about`;

describe("routes : static", () => { // Test suite definition for static routes

   describe("GET /", () => { // "GET /" = HTTP verb and the route that will be tested

      it("should return status code 200 and have 'Welcome to Bloccit' in the body of the response", (done) => { // Test description.

         request.get(base, (err, res, body) => { // request sends a GET to the base URL. err -> error, res -> response, boy -> content 
            expect(res.statusCode).toBe(200); // Expectation is set that the statusCode property of the response should be 200 (OK)
            expect(body).toContain("Welcome to Bloccit"); // Expectation that the body (or content) contains the string "Welcome to Bloccit"
            done();  // Call this method to let Jasmine know the test is completed. This is required because the test is making
            // an asynchronous request to the server which will not complete before the spec is executed. If done() as a function
            // as well as (done) as parameter are removed, the tests will automatically pass because the expect call will not be
            // made before the test finishes and Jasmine assumes that no expectation means the test is successful. 
         });
      });
   });


   describe("GET /about", () => {

      it("should return status code 200", (done) => {

         request.get(routeAbout, (err, res, body) => {
            expect(res.statusCode).toBe(200);
            done();
         });
      });
   });

});