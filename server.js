var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// setup ports
var server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address =
  process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";

const mountRoutes = require("./routes");

var initdb = require("./dbinit");

mountRoutes(app);
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// server listens in on port
app.listen(server_port, server_ip_address, function() {
  console.log(
    "Listening on " + server_ip_address + ", server_port " + server_port
  );
});

/*
Username: user5GS
  Password: 28jyraOcEmoqhP31
  Database Name: sampledb
 Connection URL: postgresql://postgresql:5432/
*/
