const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000";

const routeAbout = `${base}/about`;

describe("routes : static", () => {

   describe("GET /", () => {

      it("should return status code 200 and have 'Welcome to Bloccit' in the body of the response", (done) => {

         request.get(base, (err, res, body) => {
            expect(res.statusCode).toBe(200);
            expect(body).toContain("Welcome to Bloccit");
            done();
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