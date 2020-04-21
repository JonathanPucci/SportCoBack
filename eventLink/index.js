// ./routes/index.js
const eventLink = require("./eventLink");

module.exports = app => {
  app.use("/eventLink", eventLink);
};