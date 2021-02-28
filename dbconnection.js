var promise = require("bluebird");

var options = {
  // Initialization Options
  promiseLib: promise
};

console.log(process.env.POSTGRESQL_DATABASE);

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
var db = pgp(config);
console.log(cn)
console.log(db.connect())

db
    .any('select * from Users')
    .then(function (data) {
      console.log(data)
    })
    .catch(function (err) {
      return next(err);
    });

module.exports = {
  db: db
};
