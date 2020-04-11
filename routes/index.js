// ./routes/index.js
const users = require("./user");
const userstats = require("./userstats");
const events = require("./events");
const spots = require("./spots");
const eventparticipant = require("./eventparticipant");
const eventcomment = require("./eventcomment");
const fieldspot = require("./fieldspot");

module.exports = app => {
  app.use("/api/users", users);
  app.use("/api/userstats", userstats);
  app.use("/api/events", events);
  app.use("/api/spots", spots);
  app.use("/api/eventparticipant", eventparticipant);
  app.use("/api/eventcomment", eventcomment);
  app.use("/api/fieldspot", fieldspot);
  // etc..
};
