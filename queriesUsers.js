var db = require("./dbconnection").db;

// add query functions
function getAllUsers(req, res, next) {
  db
    .any('select * from "Users"')
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL Users"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function getSingleUser(req, res, next) {
  var eventID = parseInt(req.params.id);
  db
    .one('select * from "Users" where "User_ID" = $1', eventID)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ONE User"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function createUser(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db
    .none('insert into "Users"("User_Name")' + "values(${User_Name})", req.body)
    .then(function() {
      res.status(200).json({
        status: "success",
        message: "Inserted one User"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function updateUser(req, res, next) {
  db
    .none('update "Users" set "User_Name"=$1 where "User_ID"=$2', [
      req.body.User_Name,
      req.body.User_ID
    ])
    .then(function() {
      res.status(200).json({
        status: "success",
        message: "Updated User"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function removeUser(req, res, next) {
  var userID = parseInt(req.params.id);
  db
    .result('delete from "Users" where "User_ID"= $1', userID)
    .then(function(result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} User`
      });
      /* jshint ignore:end */
    })
    .catch(function(err) {
      return next(err);
    });
}

module.exports = {
  getAllUsers: getAllUsers,
  getSingleUser: getSingleUser,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
};
