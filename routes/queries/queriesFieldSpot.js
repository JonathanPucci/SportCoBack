var db = require("../../dbconnection").db;

// add query functions
function getAllFieldSpots(req, res, next) {
  db
    .any('select * from FieldSpots')
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL FieldSpots"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function getFieldsOfSpot(req, res, next) {
  var spotID = parseInt(req.params.id);
  db
    .any('select * from FieldSpots where spot_id = $1', spotID)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved fields of spot" + spotID
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function createFieldSpot(req, res, next) {
  db
    .none(
      'insert into FieldSpots(spot_id,Field)' +
        "values(${spot_id},${field})",
      req.body
    )
    .then(function() {
      res.status(200).json({
        status: "success",
        message: "Inserted one FieldSpot"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function removeFieldSpot(req, res, next) {
  
  let fieldspot = JSON.parse(req.params.fieldspot);

  db
    .result(
      'delete from FieldSpots where Field= ${field} AND spot_id= ${spot_id}',
      fieldspot
    )
    .then(function(result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} FieldSpot`
      });
      /* jshint ignore:end */
    })
    .catch(function(err) {
      return next(err);
    });
}

module.exports = {
  getAllFieldSpots: getAllFieldSpots,
  createFieldSpot: createFieldSpot,
  removeFieldSpot: removeFieldSpot,
  getFieldsOfSpot: getFieldsOfSpot
};
