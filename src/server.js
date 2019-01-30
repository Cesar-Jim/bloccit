// This file functions as our Node server.

const app = require("./app");
const http = require("http");

const port = normalizePort(process.env.PORT || "3000");
// Normalize the port to select it either assigned by the environment or port 3000.
// Allow the environment to set the port that our application will use if given. Otherwise, we select our own.   

app.set("port", port);

const server = http.createServer(app); // server creation

server.listen(port);

function normalizePort(val) {
   const port = parseInt(val, 10);

   if (isNaN(port)) {
      return val;

   }
   if (port >= 0) {
      return port;
   }
   return false;
}

server.on("listening", () => {
   console.log(`server is listening for requests on port ${server.address().port}`);
});