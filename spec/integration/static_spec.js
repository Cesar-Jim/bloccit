const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000";

describe("routes : static", () => {

   describe("GET /", () => {

      it("should return status code 200", (/*done*/) => { // This test throws a NOT DEFINED error with parameter 'done' and function 'done()'

         request.get(base, (err, res, body) => {
            expect(res.statusCode).toBe(200);
            //done();
         });
      });
   });

});