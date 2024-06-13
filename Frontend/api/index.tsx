// Server file
// Credit: some code from vecel website.

// Express dependencies and config.
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Express on Vercel")); // define base route.

// Setup CORS, start server.
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
 cors: {
  origin: "http://localhost:3000", // Specify your front-end origin
  AccessControlAllowOrigin: "http://localhost:3000",
  allowedHeaders: ["Access-Control-Allow-Origin"],
  credentials: true,
 },
});
httpServer.listen(PORT, () => {
 console.log(`Server is listening on port ${PORT}`);
});

module.exports = app