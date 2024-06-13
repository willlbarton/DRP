// Server file

// Express dependencies and config.
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

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

const times = [9,10,11,12,13,14,15,16,17].flatMap((hour) => [
    { time: `${hour}:00`, display: `${hour}:00` },
    { time: `${hour}:15`, display: `${hour}:15` },
    { time: `${hour}:30`, display: `${hour}:30` },
    { time: `${hour}:45`, display: `${hour}:45` }
]);
// for now, do not load availabilities from database.
let availability = new Map(times.map((time) => [time, true]));
// handle new connections
let connections : any[] = [];
io.on('connect', (socket) => {
    connections.push(socket);
    console.log("New client connection to server.");
    socket.emit("servedAvailability", availability);

    // Handle all signals received from client below (e.g. socket.on(...))

    // probably ought to handle disconnects too.
});

httpServer.listen(PORT, () => {
 console.log(`Server is listening on port ${PORT}`);
});