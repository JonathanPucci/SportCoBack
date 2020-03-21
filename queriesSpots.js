var db = require("./dbconnection").db;

// add query functions
function getAllSpots(req, res, next) {
  db
    .any('select * from "Spots"')
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL Spots"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function getSingleSpot(req, res, next) {
  var eventID = parseInt(req.params.id);
  db
    .one('select * from "Spots" where "Spot_ID" = $1', eventID)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ONE Spot"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function createSpot(req, res, next) {
  db
    .none(
      'insert into "Spots"("Spot_longitude","Spot_latitude","Fields")' +
        "values(${Spot_lontitude}, ${Spot_latitude}, ${Fields})",
      req.body
    )
    .then(function() {
      res.status(200).json({
        status: "success",
        message: "Inserted one Spot"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function updateSpot(req, res, next) {
  db
    .none(
      'update "Spots" set "Spot_longitude"=$2,"Spot_latitude"=$3,"Fields"=$4 where "Spot_ID"=$1',
      [
        req.body.Spot_ID,
        req.body.Spot_longitude,
        req.body.Spot_latitude,
        req.body.Fields
      ]
    )
    .then(function() {
      res.status(200).json({
        status: "success",
        message: "Updated Spot"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function removeSpot(req, res, next) {
  var spotID = parseInt(req.params.id);
  db
    .result('delete from "Spots" where "Spot_ID"= $1', spotID)
    .then(function(result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} Spot`
      });
      /* jshint ignore:end */
    })
    .catch(function(err) {
      return next(err);
    });
}

module.exports = {
  getAllSpots: getAllSpots,
  getSingleSpot: getSingleSpot,
  createSpot: createSpot,
  updateSpot: updateSpot,
  removeSpot: removeSpot
};
