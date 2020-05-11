// ./routes/index.js
const users = require("./user");
const userstats = require("./userstats");
const userfriends = require("./userfriends");
const teammembers = require("./teammembers");
const teams = require("./teams");
const events = require("./events");
const spots = require("./spots");
const eventparticipant = require("./eventparticipant");
const eventcomment = require("./eventcomment");
const fieldspot = require("./fieldspot");
const notify = require("./notify");

module.exports = app => {
  app.use("/api/users", users);
  app.use("/api/userstats", userstats);
  app.use("/api/userfriends", userfriends);
  app.use("/api/teammembers", teammembers);
  app.use("/api/teams", teams);
  app.use("/api/events", events);
  app.use("/api/spots", spots);
  app.use("/api/eventparticipant", eventparticipant);
  app.use("/api/eventcomment", eventcomment);
  app.use("/api/fieldspot", fieldspot);
  app.use("/api/notify", notify);
  // etc..
};
