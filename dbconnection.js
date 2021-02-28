var promise = require("bluebird");

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

const config =
  process.env.DATABASE_URL != undefined ? process.env.DATABASE_URL : cn;
// var db = pgp(config);
var db = pgp("postgres://sifsrwtukzmsjn:ef0bad6eff5d7481a7ebde324bd2743bb1c41270368d0ac89b85c69deccfe207@ec2-176-34-97-213.eu-west-1.compute.amazonaws.com:5432/d93n3ksu2f8gha");
console.log(cn)

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


