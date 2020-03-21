// ./routes/index.js
const users = require("./user");
const events = require("./events");
const spots = require("./spots");
const eventparticipant = require("./eventparticipant");
const fieldspot = require("./fieldspot");

module.exports = app => {
  app.use("/api/users", users);
  app.use("/api/events", events);
  app.use("/api/spots", spots);
  app.use("/api/eventparticipant", eventparticipant);
  app.use("/api/fieldspot", fieldspot);
  // etc..
};
