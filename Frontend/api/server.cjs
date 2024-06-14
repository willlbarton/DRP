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
let availability = new Map(times.map((time) => [time.time, true]));
// PRE: availability.has(time);
const updateAvailability = (time, value) => {
    if (!availability.has(time)) {
        console.log("ERROR! cannot book for " + time);
        return;
    }
    availability.set(time, value);
    // Update availability for clients in realtime.
    const serialized = JSON.stringify(Array.from(availability)); // send as JSON across network.
    console.log("Broadcasting: " + serialized);
    connections.forEach((socket) => {
        socket.emit("servedAvailability", serialized);
    });
};
// handle new connections
let connections = [];
io.on('connect', (socket) => {
    connections.push(socket);
    console.log("New client connection to server.");
    console.log("Serving of size: " + availability.size);
    const serialized = JSON.stringify(Array.from(availability)); // send as JSON across network.
    console.log("Serving: " + serialized);
    socket.emit("servedAvailability", serialized);
    // Handle all signals received from client below (e.g. socket.on(...))
    socket.on ("book", (time) => 
    {
        console.log("Booking received for time " + time);
        if (availability.has(time) && availability.get(time)) {
            updateAvailability(time, false);            
        }
    });
    // probably ought to handle disconnects too.
});


httpServer.listen(PORT, () => {
 console.log(`Server is listening on port ${PORT}`);
});