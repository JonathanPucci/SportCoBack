var promise = require("bluebird");
const { ConnectionString } = require('connection-string');

var options = {
  // Initialization Options
  promiseLib: promise
};

console.log(process.env.POSTGRESQL_DATABASE_URL);

var pgp = require("pg-promise")(options);
const cn = {
  host: process.env.POSTGRESQL_HOST || "localhost",
  port: process.env.POSTGRESQL_PORT || 5432,
  database: process.env.POSTGRESQL_DATABASE || "sportcodatabase",
  user: process.env.POSTGRESQL_USER || "postgres",
  password: process.env.POSTGRESQL_PASSWORD || "password"
};

// const config =
//   process.env.DATABASE_URL != undefined ? process.env.DATABASE_URL : cn;

const cnObj0 = new ConnectionString("postgres://sifsrwtukzmsjn:ef0bad6eff5d7481a7ebde324bd2743bb1c41270368d0ac89b85c69deccfe207@ec2-176-34-97-213.eu-west-1.compute.amazonaws.com:5432/d93n3ksu2f8gha");
const cnObj = new ConnectionString("postgres://wcwvgqweazxzdz:59ee9910036f0cec8fd4fb049f58de2a276c6ed9d7fbbe152c6e4c15f136a871@ec2-54-220-166-184.eu-west-1.compute.amazonaws.com:5432/da2fqr8e7smd6g");

const config = {
  host: cnObj.hostname,
  port: cnObj.port,
  database: cnObj.path[0],
  user: cnObj.user,
  password: cnObj.password,
  ssl: {
    rejectUnauthorized: false,
  },
};
console.log(cn)
var db = pgp(config);

db
  .any('select * from Users;')
  .then(function (data) {
    console.log(data)
  })
  .catch(function (err) {
    return next(err);
  });

module.exports = {
  db: db
};


